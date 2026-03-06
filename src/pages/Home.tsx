import React, { useEffect, useState } from 'react';
import { Heart, MessageSquare, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import StoryCard from '../components/StoryCard';

export default function Home() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch('/api/stories')
      .then(res => res.json())
      .then(data => setStories(data.slice(0, 3)))
      .catch(err => console.error(err));
  }, []);

  return (
    <main className="flex-1 flex flex-col gap-16 relative w-full overflow-hidden pb-20">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        {/* Soft gradient background matching the mockup */}
        <div className="absolute inset-0 bg-[#fdfbf7]"></div>
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `
            radial-gradient(circle at 15% 50%, #e0f2fe 0%, transparent 40%),
            radial-gradient(circle at 85% 30%, #fce7f3 0%, transparent 40%),
            radial-gradient(circle at 50% 80%, #fef3c7 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, #e0e7ff 0%, transparent 40%)
          `
        }}></div>
        
        {/* Clouds */}
        <svg className="absolute top-10 left-10 w-32 h-20 text-blue-100 opacity-60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 19c2.48 0 4.5-2.02 4.5-4.5S19.98 10 17.5 10c-.17 0-.33.01-.5.04C16.32 7.17 13.86 5 11 5 7.69 5 5 7.69 5 11c0 .15.01.29.02.44C2.77 11.76 1 13.67 1 16c0 2.76 2.24 5 5 5h11.5z" />
        </svg>
        <svg className="absolute top-40 right-20 w-48 h-32 text-pink-100 opacity-60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 19c2.48 0 4.5-2.02 4.5-4.5S19.98 10 17.5 10c-.17 0-.33.01-.5.04C16.32 7.17 13.86 5 11 5 7.69 5 5 7.69 5 11c0 .15.01.29.02.44C2.77 11.76 1 13.67 1 16c0 2.76 2.24 5 5 5h11.5z" />
        </svg>
        <svg className="absolute bottom-40 left-20 w-40 h-24 text-blue-100 opacity-60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 19c2.48 0 4.5-2.02 4.5-4.5S19.98 10 17.5 10c-.17 0-.33.01-.5.04C16.32 7.17 13.86 5 11 5 7.69 5 5 7.69 5 11c0 .15.01.29.02.44C2.77 11.76 1 13.67 1 16c0 2.76 2.24 5 5 5h11.5z" />
        </svg>

        {/* Floating Hearts */}
        <Heart className="absolute top-32 left-1/3 w-6 h-6 text-pink-300 fill-pink-300 opacity-70 animate-pulse" />
        <Heart className="absolute top-20 right-1/3 w-4 h-4 text-red-300 fill-red-300 opacity-60 animate-bounce" style={{ animationDuration: '3s' }} />
        <Heart className="absolute top-60 right-1/4 w-8 h-8 text-pink-200 fill-pink-200 opacity-50 animate-pulse" style={{ animationDuration: '4s' }} />
        
        {/* Decorative Plants/Leaves (Abstract shapes) */}
        <svg className="absolute bottom-0 left-0 w-64 h-64 text-teal-100 opacity-50" viewBox="0 0 200 200" fill="currentColor">
          <path d="M 0 200 C 50 200 100 150 100 100 C 100 50 50 0 0 0 Z" />
          <path d="M 0 200 C 80 200 150 120 150 50 C 100 50 0 100 0 200 Z" className="text-teal-200" />
        </svg>
        <svg className="absolute bottom-0 right-0 w-80 h-80 text-blue-100 opacity-50" viewBox="0 0 200 200" fill="currentColor">
          <path d="M 200 200 C 150 200 100 150 100 100 C 100 50 150 0 200 0 Z" />
          <path d="M 200 200 C 120 200 50 120 50 50 C 100 50 200 100 200 200 Z" className="text-indigo-100" />
        </svg>
        
        {/* Sparkles */}
        <Sparkles className="absolute top-40 left-1/4 w-5 h-5 text-yellow-300 fill-yellow-300 opacity-60" />
        <Sparkles className="absolute bottom-60 right-1/5 w-6 h-6 text-yellow-200 fill-yellow-200 opacity-50" />
      </div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 px-4 md:px-8 max-w-6xl mx-auto w-full pt-12 md:pt-20 relative z-10">
        <div className="flex flex-col gap-6 md:w-1/2 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-[#4a4a4a]">
            Tempat aman untuk<br />berbagi cerita
          </h1>
          <p className="text-[#777777] text-lg md:text-xl leading-relaxed max-w-md">
            Tidak ada yang harus kamu hadapi sendirian.<br />Di sini selalu ada ruang untuk didengar.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link to="/tulis" className="flex items-center justify-center rounded-full h-12 px-8 bg-[#8ab4f8] text-white text-base font-bold shadow-md shadow-blue-200 hover:bg-[#7aa4e8] transition-all cursor-pointer">
              <Heart className="w-5 h-5 mr-2" />
              Tulis Cerita
            </Link>
            <Link to="/cerita" className="flex items-center justify-center rounded-full h-12 px-8 bg-white text-[#5a5a5a] border border-gray-200 text-base font-bold hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
              <MessageSquare className="w-5 h-5 mr-2 text-gray-400" />
              Baca Cerita
            </Link>
          </div>
        </div>
        
        <div className="md:w-1/2 flex justify-center relative z-10 mt-8 md:mt-0">
          {/* Illustration Container */}
          <div className="relative w-full max-w-lg flex items-center justify-center animate-float">
             {/* We use a placeholder that matches the vibe, or a clean illustration */}
             <img 
               src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1000&auto=format&fit=crop" 
               alt="Teman yang saling mendukung" 
               className="w-full h-auto object-cover rounded-[3rem] shadow-2xl shadow-blue-900/10 border-8 border-white/80 aspect-[4/3] saturate-[1.2] contrast-[1.05]"
               referrerPolicy="no-referrer"
             />
             {/* Decorative elements around the image */}
             <div className="absolute -z-10 w-[110%] h-[110%] bg-gradient-to-tr from-blue-200/40 to-pink-200/40 rounded-[4rem] blur-2xl opacity-70"></div>
          </div>
        </div>
      </div>

      {/* Recent Stories Section */}
      <div className="px-4 md:px-8 max-w-6xl mx-auto w-full mt-12 relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="text-yellow-400 w-6 h-6 fill-yellow-400" />
          <h2 className="text-2xl font-bold text-[#4a4a4a]">Cerita Terbaru</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story: any) => (
            <StoryCard key={story.id} {...story} />
          ))}
        </div>
      </div>
    </main>
  );
}
