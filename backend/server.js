const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: 'https://mobilsiap.com' }));
app.use(express.json());

const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { status: 'error', message: 'Terlalu banyak permintaan upload dari IP ini.' }
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', (qr) => {
    console.log('PINDAI QR CODE INI UNTUK LOGIN BOT WHATSAPP ADMIN:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => console.log('WhatsApp Engine MobilSiap Aktif!'));
client.initialize();

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Hanya menerima berkas gambar valid.'), false);
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

app.post('/api/titip-jual', uploadLimiter, upload.array('photos', 5), async (req, res) => {
    try {
        const { ownerName, whatsappNumber, brandType, year, mileage, expectedPrice } = req.body;
        if (!ownerName || !whatsappNumber || !brandType || !req.files) {
            return res.status(400).json({ status: 'error', message: 'Parameter tidak lengkap.' });
        }

        const processedImages = [];
        for (const file of req.files) {
            const uniqueName = `car-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
            const finalPath = path.join(uploadDir, uniqueName);

            await sharp(file.buffer)
                .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(finalPath);

            processedImages.push(`https://mobilsiap.com{uniqueName}`);
        }

        const msgAdmin = `🚨 *NOTIFIKASI TITIP JUAL MOBILSIAP.COM* 🚨\n\n👤 *Pemilik:* ${ownerName}\n📱 *WA Pengaju:* ${whatsappNumber}\n🚗 *Unit:* ${brandType} (${year})\ngd🛣️ *KM:* ${Number(mileage).toLocaleString()} KM\n💰 *Harga Diminta:* Rp ${Number(expectedPrice).toLocaleString()}\n\n📸 *Link Foto Terproses:* ${processedImages}`;
        
        await client.sendMessage("6285883027422@c.us", msgAdmin);

        res.status(200).json({ status: 'success', message: 'Data titip jual berhasil terkirim dan disimpan aman di platform MobilSiap.com!' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.listen(PORT, () => console.log(`Backend server ready on port ${PORT}`));
