import React, { useState } from 'react';
import { Heart, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmailRegistrationModal from '../components/EmailRegistrationModal';

export default function WriteStory() {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('sedih');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const registeredEmail = localStorage.getItem('registeredEmail');
    if (!registeredEmail) {
      setIsEmailModalOpen(true);
      return;
    }
    
    submitStory();
  };

  const submitStory = async () => {
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, tag, title, excerpt })
      });
      
      if (res.ok) {
        navigate('/cerita');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center px-4 md:px-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          <h1 className="text-3xl font-extrabold text-[#4a4a4a]">Tulis Ceritamu</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[#4a4a4a] text-sm">Nama / Nama Samaran</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: BintangKecil"
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[#4a4a4a] text-sm">Perasaanmu saat ini</label>
            <select 
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50"
            >
              <option value="sedih">Sedih</option>
              <option value="marah">Marah</option>
              <option value="bingung">Bingung</option>
              <option value="lelah">Lelah</option>
              <option value="kecewa">Kecewa</option>
              <option value="senang">Senang</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[#4a4a4a] text-sm">Judul Cerita</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Beri judul yang mewakili ceritamu..."
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[#4a4a4a] text-sm">Isi Cerita</label>
            <textarea 
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Ceritakan apa yang sedang kamu rasakan..."
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50 min-h-[200px] resize-y"
              required
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-4 flex items-center justify-center rounded-full h-14 px-8 bg-primary text-white text-base font-bold shadow-md shadow-primary/30 hover:bg-primary-dark transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Mengirim...' : 'Bagikan Cerita'}
          </button>
        </form>
      </div>

      <EmailRegistrationModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSuccess={submitStory}
        title="Daftar Email Dulu Yuk!"
        description="Untuk menjaga komunitas tetap aman dan nyaman, mohon daftarkan emailmu sebelum membagikan cerita."
      />
    </main>
  );
}
