import React, { useEffect, useState } from 'react';
import { Sparkles, SearchX } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import StoryCard from '../components/StoryCard';

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    setIsLoading(true);
    const url = query ? `/api/stories?q=${encodeURIComponent(query)}` : '/api/stories';
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setStories(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [query]);

  return (
    <main className="flex-1 flex flex-col gap-12 px-4 md:px-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#4a4a4a] flex items-center gap-3">
          <Sparkles className="text-yellow-400 w-8 h-8 fill-yellow-400" />
          {query ? 'Hasil Pencarian' : 'Semua Cerita'}
        </h1>
        <p className="text-[#777777] text-lg">
          {query 
            ? `Menampilkan cerita yang mengandung kata "${query}"`
            : 'Baca dan berikan dukungan untuk cerita-cerita teman kita.'}
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : stories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story: any) => (
            <StoryCard key={story.id} {...story} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <SearchX className="w-16 h-16 text-gray-300" />
          <h3 className="text-xl font-bold text-[#4a4a4a]">Cerita tidak ditemukan</h3>
          <p className="text-gray-500">Coba gunakan kata kunci lain untuk mencari cerita.</p>
        </div>
      )}
    </main>
  );
}
