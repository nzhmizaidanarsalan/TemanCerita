import React, { useState, useEffect } from 'react';
import { Heart, Shield, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StoryCard({ id, initial, initialBg, name, time, tag, tagColor, title, excerpt, likes: initialLikes, supports: initialSupports, comments }: any) {
  const [likes, setLikes] = useState(initialLikes);
  const [supports, setSupports] = useState(initialSupports);
  const [isLiking, setIsLiking] = useState(false);
  const [isSupporting, setIsSupporting] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasSupported, setHasSupported] = useState(false);

  useEffect(() => {
    // Check local storage to see if user has already liked or supported this story
    const likedStories = JSON.parse(localStorage.getItem('likedStories') || '[]');
    const supportedStories = JSON.parse(localStorage.getItem('supportedStories') || '[]');
    
    if (likedStories.includes(id)) {
      setHasLiked(true);
    }
    if (supportedStories.includes(id)) {
      setHasSupported(true);
    }
  }, [id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page
    if (isLiking || hasLiked) return;
    
    setIsLiking(true);
    try {
      const res = await fetch(`/api/stories/${id}/like`, { method: 'POST' });
      const data = await res.json();
      setLikes(data.likes);
      setHasLiked(true);
      
      // Save to local storage
      const likedStories = JSON.parse(localStorage.getItem('likedStories') || '[]');
      if (!likedStories.includes(id)) {
        likedStories.push(id);
        localStorage.setItem('likedStories', JSON.stringify(likedStories));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSupport = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page
    if (isSupporting || hasSupported) return;
    
    setIsSupporting(true);
    try {
      const res = await fetch(`/api/stories/${id}/support`, { method: 'POST' });
      const data = await res.json();
      setSupports(data.supports);
      setHasSupported(true);
      
      // Save to local storage
      const supportedStories = JSON.parse(localStorage.getItem('supportedStories') || '[]');
      if (!supportedStories.includes(id)) {
        supportedStories.push(id);
        localStorage.setItem('supportedStories', JSON.stringify(supportedStories));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSupporting(false);
    }
  };

  return (
    <Link to={`/cerita/${id}`} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col gap-4 group cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${initialBg}`}>
            {initial}
          </div>
          <div>
            <h4 className="font-bold text-[#4a4a4a] text-sm">{name}</h4>
            <p className="text-xs text-gray-400">{time}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1 ${tagColor}`}>
          <Sparkles className="w-3 h-3" />
          {tag}
        </span>
      </div>
      
      <div>
        <h3 className="font-bold text-lg text-[#4a4a4a] mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-[#777777] leading-relaxed line-clamp-4">
          {excerpt}
        </p>
      </div>
      
      <div className="mt-auto pt-4 flex flex-col gap-4">
        <span className="text-primary text-sm font-medium group-hover:underline">Baca selengkapnya</span>
        
        <div className="flex items-center gap-4 border-t border-gray-50 pt-4">
          <button 
            onClick={handleLike}
            disabled={isLiking || hasLiked}
            className={`flex items-center gap-1.5 transition-colors ${hasLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} disabled:opacity-50`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500' : ''}`} />
            <span className="text-xs font-semibold">{likes}</span>
          </button>
          <button 
            onClick={handleSupport}
            disabled={isSupporting || hasSupported}
            className={`flex items-center gap-1.5 transition-colors ${hasSupported ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'} disabled:opacity-50`}
          >
            <Shield className={`w-4 h-4 ${hasSupported ? 'fill-blue-500' : ''}`} />
            <span className="text-xs font-semibold">{supports}</span>
          </button>
          <div className="flex items-center gap-1.5 text-gray-400 hover:text-green-500 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-semibold">{comments}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
