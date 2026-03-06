import React, { useState, useRef } from 'react';
import { Heart, Search, X, CheckCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [registerStatus, setRegisterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const clickCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSecretClick = (e: React.MouseEvent) => {
    clickCountRef.current += 1;
    
    if (clickCountRef.current === 3) {
      e.preventDefault();
      navigate('/admin');
      clickCountRef.current = 0;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1500);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-primary font-semibold" : "text-[#888888] hover:text-primary font-medium";
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/cerita?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok || data.error === 'Email sudah terdaftar') {
        localStorage.setItem('registeredEmail', email);
        setRegisterStatus('success');
        setTimeout(() => { 
          setIsModalOpen(false); 
          setRegisterStatus('idle'); 
          setEmail(''); 
        }, 2000);
      } else {
        setRegisterStatus('error');
        setErrorMessage(data.error || 'Terjadi kesalahan');
      }
    } catch (err) {
      setRegisterStatus('error');
      setErrorMessage('Gagal terhubung ke server');
    }
  };

  return (
    <>
      <header className="flex items-center justify-between bg-white/80 backdrop-blur-md rounded-full px-6 py-3 shadow-sm border border-white/50">
        <Link to="/" onClick={handleSecretClick} className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <h2 className="text-xl font-bold text-[#4a4a4a]">TemanCerita</h2>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link className={`text-sm transition-colors ${isActive('/')}`} to="/">Beranda</Link>
          <Link className={`text-sm transition-colors ${isActive('/cerita')}`} to="/cerita">Cerita</Link>
          <Link className={`text-sm transition-colors ${isActive('/tulis')}`} to="/tulis">Tulis Cerita</Link>
          {/* Admin link is hidden from public view */}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Cari cerita..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-transparent border-none outline-none text-sm w-24 focus:w-32 transition-all placeholder:text-gray-400"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full text-sm font-bold transition-colors shadow-sm shadow-primary/30 cursor-pointer"
          >
            Daftar
          </button>
        </div>
      </header>

      {/* Register Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col items-center text-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary fill-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#4a4a4a]">Bergabung Bersama Kami</h3>
                <p className="text-gray-500 text-sm mt-2">Daftarkan emailmu untuk mendapatkan update cerita terbaru dan fitur eksklusif lainnya.</p>
              </div>
            </div>

            {registerStatus === 'success' ? (
              <div className="flex flex-col items-center gap-3 text-green-600 py-4">
                <CheckCircle className="w-12 h-12" />
                <p className="font-bold">Pendaftaran Berhasil!</p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 text-left">
                  <label className="font-bold text-[#4a4a4a] text-sm">Alamat Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50"
                    required
                  />
                  {registerStatus === 'error' && (
                    <p className="text-red-500 text-xs font-medium">{errorMessage}</p>
                  )}
                </div>
                <button 
                  type="submit" 
                  disabled={registerStatus === 'loading'}
                  className="w-full rounded-full h-12 bg-primary text-white text-base font-bold shadow-md shadow-primary/30 hover:bg-primary-dark transition-all cursor-pointer disabled:opacity-70"
                >
                  {registerStatus === 'loading' ? 'Memproses...' : 'Daftar Sekarang'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
