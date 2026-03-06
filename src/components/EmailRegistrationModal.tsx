import React, { useState } from 'react';
import { X, Mail, Heart } from 'lucide-react';

interface EmailRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  description: string;
}

export default function EmailRegistrationModal({ isOpen, onClose, onSuccess, title, description }: EmailRegistrationModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      // We consider it a success if it's a new subscription or if the email is already registered
      if (res.ok || data.error === 'Email sudah terdaftar') {
        localStorage.setItem('registeredEmail', email);
        onSuccess();
        onClose();
      } else {
        setError(data.error || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center text-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#4a4a4a]">{title}</h3>
            <p className="text-gray-500 text-sm mt-2">{description}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 text-left">
            <label className="font-bold text-[#4a4a4a] text-sm">Alamat Email</label>
            <input 
              type="email" 
              placeholder="nama@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50"
              required
            />
            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
          </div>
          <button 
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full rounded-full h-12 bg-primary text-white text-base font-bold shadow-md shadow-primary/30 hover:bg-primary-dark transition-all cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? 'Memproses...' : 'Lanjutkan'}
          </button>
        </form>
      </div>
    </div>
  );
}
