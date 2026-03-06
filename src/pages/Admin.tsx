import React, { useEffect, useState } from 'react';
import { Trash2, ShieldAlert, Users, BookOpen, Lock } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'cerita' | 'pengguna'>('cerita');
  const [stories, setStories] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded password for demonstration
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Password salah!');
    }
  };

  const fetchStories = () => {
    fetch('/api/stories')
      .then(res => res.json())
      .then(data => setStories(data))
      .catch(err => console.error(err));
  };

  const fetchSubscribers = () => {
    fetch('/api/subscribers')
      .then(res => res.json())
      .then(data => setSubscribers(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'cerita') fetchStories();
      if (activeTab === 'pengguna') fetchSubscribers();
    }
  }, [isAuthenticated, activeTab]);

  const handleDeleteStory = async (id: number) => {
    if (confirm('Yakin ingin menghapus cerita ini?')) {
      try {
        await fetch(`/api/stories/${id}`, { method: 'DELETE' });
        fetchStories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#4a4a4a] mb-2">Akses Terbatas</h1>
          <p className="text-gray-500 mb-8 text-sm">Silakan masukkan password admin untuk melanjutkan.</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password Admin"
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all bg-gray-50 text-center"
              required
            />
            <button 
              type="submit" 
              className="w-full rounded-full h-12 bg-gray-800 text-white text-base font-bold shadow-md hover:bg-black transition-all cursor-pointer"
            >
              Masuk
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col gap-8 px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-[#4a4a4a] flex items-center gap-3">
            <ShieldAlert className="text-red-400 w-8 h-8" />
            Panel Admin
          </h1>
          <p className="text-[#777777]">Kelola konten dan pengguna website.</p>
        </div>
        
        <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-100">
          <button 
            onClick={() => setActiveTab('cerita')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'cerita' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <BookOpen className="w-4 h-4" /> Cerita
          </button>
          <button 
            onClick={() => setActiveTab('pengguna')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'pengguna' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <Users className="w-4 h-4" /> Pengguna
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'cerita' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-bold text-[#4a4a4a] text-sm">ID</th>
                  <th className="p-4 font-bold text-[#4a4a4a] text-sm">Penulis</th>
                  <th className="p-4 font-bold text-[#4a4a4a] text-sm">Judul</th>
                  <th className="p-4 font-bold text-[#4a4a4a] text-sm">Tanggal</th>
                  <th className="p-4 font-bold text-[#4a4a4a] text-sm text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {stories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">Belum ada cerita.</td>
                  </tr>
                ) : (
                  stories.map((story: any) => (
                    <tr key={story.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-sm text-gray-500">#{story.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${story.initialBg}`}>
                            {story.initial}
                          </div>
                          <span className="font-bold text-[#4a4a4a] text-sm">{story.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-[#4a4a4a]">{story.title}</td>
                      <td className="p-4 text-sm text-gray-500">{new Date(story.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteStory(story.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Cerita"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'pengguna' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-bold text-[#4a4a4a] text-sm">ID</th>
                  <th className="p-4 font-bold text-[#4a4a4a] text-sm">Email Terdaftar</th>
                  <th className="p-4 font-bold text-[#4a4a4a] text-sm">Tanggal Daftar</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-400">Belum ada pengguna yang mendaftar.</td>
                  </tr>
                ) : (
                  subscribers.map((sub: any) => (
                    <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-sm text-gray-500">#{sub.id}</td>
                      <td className="p-4 text-sm font-medium text-[#4a4a4a]">{sub.email}</td>
                      <td className="p-4 text-sm text-gray-500">{new Date(sub.created_at).toLocaleDateString('id-ID')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
