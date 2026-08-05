import React, { useState } from 'react';
import { Search, Car, DollarSign, MapPin, MessageCircle, Upload, Filter, ShieldCheck, Zap, SlidersHorizontal } from 'lucide-react';

const INITIAL_CARS = [
  {
    id: '1',
    title: 'Honda HR-V 1.5 SE Facelift',
    brand: 'Honda',
    year: 2022,
    mileage: 18000,
    fuelType: 'Bensin',
    bodyType: 'SUV',
    condition: 'Bekas',
    price: 345000000,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

export default function App() {
  const [cars] = useState(INITIAL_CARS);
  const [filterCondition, setFilterCondition] = useState('Semua');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    ownerName: '', whatsappNumber: '', brandType: '', year: '', mileage: '', expectedPrice: ''
  });

  const filteredCars = cars.filter(car => 
    filterCondition === 'Semua' || car.condition === filterCondition
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setStatusMessage({ type: 'error', text: 'Maksimal 5 foto yang boleh diunggah.' });
      return;
    }
    if (files.some(file => file.size > 5 * 1024 * 1024)) {
      setStatusMessage({ type: 'error', text: 'Ada file yang melebihi batas ukuran 5MB.' });
      return;
    }
    setSelectedFiles(files);
    setStatusMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setStatusMessage({ type: 'error', text: 'Silakan unggah minimal 1 foto mobil.' });
      return;
    }
    
    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => dataToSend.append(key, formData[key]));
    selectedFiles.forEach(file => dataToSend.append('photos', file));

    try {
      const response = await fetch('https://mobilsiap.com/api/submit', {
        method: 'POST',
        body: dataToSend,
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Gagal mengirim pengajuan.');

      setStatusMessage({ type: 'success', text: result.message || 'Pengajuan berhasil dikirim!' });
      setFormData({ ownerName: '', whatsappNumber: '', brandType: '', year: '', mileage: '', expectedPrice: '' });
      setSelectedFiles([]);
    } catch (error) {
      setStatusMessage({ type: 'error', text: error.message || 'Gangguan koneksi ke server.' });
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = (message) => {
    const adminNumber = '628123456789'; // Replace with actual number
    window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-neutral-50 text-neutral-900 font-sans antialiased min-h-screen">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#121212] text-white border-b border-red-600/20">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold text-xl">M</div>
            <span className="text-2xl font-black text-white">Mobil<span className="text-red-600">Siap</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium">
            <a href="#katalog" className="hover:text-red-500 transition">Cari Mobil</a>
            <a href="#titip-jual" className="hover:text-red-500 transition">Titip Jual</a>
          </div>
          <a href="#titip-jual" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg transition">Mulai Titip Jual</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative bg-[#121212] text-white pt-24 pb-36 text-center">
        <span className="bg-red-600/10 border border-red-600/30 text-red-500 text-sm font-semibold px-4 py-1.5 rounded-full inline-block mb-6">Platform Titip Jual Mobil Terbaik</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-6">Jual Mobil Anda Tanpa Ribet, <br/><span className="text-red-600">100% Transparan.</span></h1>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto mb-12">Titipkan mobil Anda di MobilSiap. Kami bantu pasarkan ke ribuan pembeli aktif setiap hari tanpa biaya iklan tersembunyi.</p>

        {/* QUICK SEARCH */}
        <div className="bg-white p-4 rounded-2xl shadow-2xl text-neutral-800 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          <div className="flex items-center gap-3 px-3 py-2 border-r border-neutral-200 text-left">
            <Car className="text-red-600 shrink-0" size={22} />
            <div className="w-full">
              <label className="text-xs text-neutral-400 block font-semibold">MEREK</label>
              <select className="w-full font-bold focus:outline-none text-sm bg-transparent">
                <option>Semua Merek</option>
                <option>Honda</option>
                <option>Toyota</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 border-r border-neutral-200 text-left">
            <DollarSign className="text-red-600 shrink-0" size={22} />
            <div className="w-full">
              <label className="text-xs text-neutral-400 block font-semibold">HARGA MAKSIMAL</label>
              <select className="w-full font-bold focus:outline-none text-sm bg-transparent">
                <option>Semua Harga</option>
                <option>Di bawah 200jt</option>
                <option>200jt - 500jt</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-left">
            <MapPin className="text-red-600 shrink-0" size={22} />
            <div className="w-full">
              <label className="text-xs text-neutral-400 block font-semibold">LOKASI</label>
              <select className="w-full font-bold focus:outline-none text-sm bg-transparent">
                <option>Semua Kota</option>
                <option>Jakarta</option>
                <option>Surabaya</option>
              </select>
            </div>
          </div>
          <button className="w-full bg-[#121212] hover:bg-red-600 text-white font-bold h-12 rounded-xl transition flex items-center justify-center gap-2">
            <Search size={18} /> Cari Mobil
          </button>
        </div>
      </header>

      {/* KEUNGGULAN */}
      <section className="max-w-7xl mx-auto px-4 py-16 -mt-16 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xl border-b-4 border-red-600 flex items-start gap-4">
          <div className="p-3 bg-red-50 rounded-xl text-red-600"><ShieldCheck size={28}/></div>
          <div><h3 className="font-bold text-lg mb-1">Titip Jual Aman</h3><p className="text-sm text-neutral-500">Kontrak legal transparan, kondisi mobil terjaga prima.</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-xl border-b-4 border-neutral-900 flex items-start gap-4">
          <div className="p-3 bg-neutral-100 rounded-xl text-neutral-900"><Zap size={28}/></div>
          <div><h3 className="font-bold text-lg mb-1">Pasti Cepat Laku</h3><p className="text-sm text-neutral-500">Iklan langsung didistribusikan secara premium ke berbagai kanal.</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-xl border-b-4 border-red-600 flex items-start gap-4">
          <div className="p-3 bg-red-50 rounded-xl text-red-600"><SlidersHorizontal size={28}/></div>
          <div><h3 className="font-bold text-lg mb-1">Proses Transparan</h3><p className="text-sm text-neutral-500">Pantau penawaran masuk dari pembeli secara langsung via WhatsApp.</p></div>
        </div>
      </section>

      {/* KATALOG */}
      <main id="katalog" className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="bg-white p-6 rounded-2xl shadow-md border border-neutral-100 h-fit sticky top-24">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-neutral-100">
            <Filter size={18} className="text-red-600" />
            <h2 className="font-bold text-lg uppercase tracking-wider">Filter</h2>
          </div>
          <div className="mb-6">
            <label className="block text-xs font-bold text-neutral-400 uppercase mb-3">Kondisi</label>
            <div className="flex gap-2">
              {['Semua', 'Baru', 'Bekas'].map((cond) => (
                <button 
                  key={cond} 
                  onClick={() => setFilterCondition(cond)} 
                  className={'flex-1 py-2 text-sm font-semibold rounded-lg border transition ' + (filterCondition === cond ? 'bg-red-600 text-white border-red-600' : 'bg-transparent border-neutral-200')}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredCars.map((car) => (
              <div key={car.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col group">
                <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                  <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1 leading-snug">{car.title}</h3>
                    <p className="text-xs text-neutral-400 font-semibold mb-4">{car.year} • {car.fuelType}</p>
                    <div className="text-xl font-black text-red-600 mb-5">Rp {car.price.toLocaleString('id-ID')}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="w-full border border-neutral-200 font-bold text-xs py-3 rounded-xl hover:bg-neutral-50 transition">Lihat Detail</button>
                    <button 
                      onClick={() => openWhatsApp('Halo Admin MobilSiap.com, saya tertarik dengan unit iklan: ' + car.title + ' (' + car.year + ').')} 
                      className="w-full bg-emerald-600 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:bg-emerald-700 transition"
                    >
                      <MessageCircle size={14} /> Hubungi Admin
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FORM TITIP JUAL */}
      <section id="titip-jual" className="bg-white py-20 border-t border-neutral-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Formulir Titip Jual</h2>
            <p className="text-neutral-500">Lengkapi data di bawah ini, tim kami akan segera menghubungi Anda.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Nama Pemilik</label>
                <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-red-600 outline-none" placeholder="Contoh: Budi Santoso" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Nomor WhatsApp</label>
                <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-red-600 outline-none" placeholder="0812..." />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Merek & Tipe</label>
                <input type="text" name="brandType" value={formData.brandType} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-red-600 outline-none" placeholder="Honda HR-V" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Tahun</label>
                <input type="number" name="year" value={formData.year} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-red-600 outline-none" placeholder="2022" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Harga Harapan</label>
                <input type="number" name="expectedPrice" value={formData.expectedPrice} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-red-600 outline-none" placeholder="350000000" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">Foto Mobil (Maks 5)</label>
              <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-8 text-center hover:border-red-600 transition cursor-pointer relative">
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Upload className="mx-auto text-neutral-400 mb-2" />
                <p className="text-sm text-neutral-500">{selectedFiles.length > 0 ? `${selectedFiles.length} file terpilih` : 'Klik atau seret foto ke sini'}</p>
              </div>
            </div>

            {statusMessage.text && (
              <div className={`p-4 rounded-xl text-sm font-bold ${statusMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {statusMessage.text}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-neutral-400 text-white font-bold py-4 rounded-xl transition shadow-lg">
              {loading ? 'Mengirim...' : 'Kirim Pengajuan Jual'}
            </button>
          </form>
        </div>
      </section>

      {/* FLOATING WHATSAPP */}
      <button onClick={() => openWhatsApp('Halo CS MobilSiap.com, saya butuh bantuan mengenai unit atau layanan titip jual.')} className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition duration-300 animate-bounce">
        <MessageCircle size={28} />
      </button>
    </div>
  );
}
