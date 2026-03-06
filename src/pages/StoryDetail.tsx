import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Shield, MessageCircle, Sparkles, ArrowLeft, Send } from 'lucide-react';
import EmailRegistrationModal from '../components/EmailRegistrationModal';

export default function StoryDetail() {
  const { id } = useParams();
  const [story, setStory] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasSupported, setHasSupported] = useState(false);

  useEffect(() => {
    // Check local storage to see if user has already liked or supported this story
    if (id) {
      const likedStories = JSON.parse(localStorage.getItem('likedStories') || '[]');
      const supportedStories = JSON.parse(localStorage.getItem('supportedStories') || '[]');
      
      if (likedStories.includes(id)) {
        setHasLiked(true);
      }
      if (supportedStories.includes(id)) {
        setHasSupported(true);
      }
    }
  }, [id]);

  const fetchStoryData = () => {
    setIsLoading(true);
    Promise.all([
      fetch(`/api/stories/${id}`).then(res => res.json()),
      fetch(`/api/stories/${id}/comments`).then(res => res.json())
    ])
    .then(([storyData, commentsData]) => {
      if (!storyData.error) {
        setStory(storyData);
        setComments(commentsData);
      }
      setIsLoading(false);
    })
    .catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchStoryData();
  }, [id]);

  const handleLike = async () => {
    if (!story || hasLiked) return;
    try {
      const res = await fetch(`/api/stories/${id}/like`, { method: 'POST' });
      const data = await res.json();
      setStory({ ...story, likes: data.likes });
      setHasLiked(true);
      
      // Save to local storage
      const likedStories = JSON.parse(localStorage.getItem('likedStories') || '[]');
      if (!likedStories.includes(id)) {
        likedStories.push(id);
        localStorage.setItem('likedStories', JSON.stringify(likedStories));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSupport = async () => {
    if (!story || hasSupported) return;
    try {
      const res = await fetch(`/api/stories/${id}/support`, { method: 'POST' });
      const data = await res.json();
      setStory({ ...story, supports: data.supports });
      setHasSupported(true);
      
      // Save to local storage
      const supportedStories = JSON.parse(localStorage.getItem('supportedStories') || '[]');
      if (!supportedStories.includes(id)) {
        supportedStories.push(id);
        localStorage.setItem('supportedStories', JSON.stringify(supportedStories));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const registeredEmail = localStorage.getItem('registeredEmail');
    if (!registeredEmail) {
      setIsEmailModalOpen(true);
      return;
    }
    
    submitComment();
  };

  const submitComment = async () => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/stories/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: commentName.trim() || 'Anonim',
          content: newComment.trim()
        })
      });
      
      setNewComment('');
      setCommentName('');
      fetchStoryData(); // Refresh to get new comment and updated count
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-4">
        <h3 className="text-2xl font-bold text-[#4a4a4a]">Cerita tidak ditemukan</h3>
        <Link to="/cerita" className="text-primary hover:underline">Kembali ke daftar cerita</Link>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col gap-8 px-4 md:px-8 max-w-4xl mx-auto w-full">
      <Link to="/cerita" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Kembali</span>
      </Link>

      <article className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${story.initialBg}`}>
              {story.initial}
            </div>
            <div>
              <h4 className="font-bold text-[#4a4a4a] text-base">{story.name}</h4>
              <p className="text-sm text-gray-400">{new Date(story.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5 ${story.tagColor}`}>
            <Sparkles className="w-3.5 h-3.5" />
            {story.tag}
          </span>
        </div>
        
        <div>
          <h1 className="font-bold text-2xl md:text-3xl text-[#4a4a4a] mb-4 leading-tight">{story.title}</h1>
          <p className="text-base md:text-lg text-[#555555] leading-relaxed whitespace-pre-wrap">
            {story.excerpt}
          </p>
        </div>
        
        <div className="flex items-center gap-6 border-t border-gray-100 pt-6 mt-2">
          <button 
            onClick={handleLike}
            disabled={hasLiked}
            className={`flex items-center gap-2 transition-colors group ${hasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} disabled:opacity-70`}
          >
            <div className={`p-2 rounded-full transition-colors ${hasLiked ? 'bg-red-50' : 'group-hover:bg-red-50'}`}>
              <Heart className={`w-5 h-5 ${hasLiked ? 'fill-red-500' : 'group-hover:fill-red-500'}`} />
            </div>
            <span className="font-semibold">{story.likes} Suka</span>
          </button>
          
          <button 
            onClick={handleSupport}
            disabled={hasSupported}
            className={`flex items-center gap-2 transition-colors group ${hasSupported ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'} disabled:opacity-70`}
          >
            <div className={`p-2 rounded-full transition-colors ${hasSupported ? 'bg-blue-50' : 'group-hover:bg-blue-50'}`}>
              <Shield className={`w-5 h-5 ${hasSupported ? 'fill-blue-500' : 'group-hover:fill-blue-500'}`} />
            </div>
            <span className="font-semibold">{story.supports} Dukungan</span>
          </button>
          
          <div className="flex items-center gap-2 text-gray-500">
            <div className="p-2">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="font-semibold">{story.comments} Komentar</span>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col gap-8">
        <h3 className="font-bold text-xl text-[#4a4a4a] flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          Komentar ({comments.length})
        </h3>

        {/* Add Comment Form */}
        <form onSubmit={handleSubmitComment} className="flex flex-col gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Nama samaran (opsional)" 
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white text-sm"
            />
          </div>
          <div className="relative">
            <textarea 
              placeholder="Tulis dukungan atau komentarmu di sini..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white text-sm min-h-[100px] resize-y"
              required
            />
            <button 
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="absolute bottom-3 right-3 bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="flex flex-col gap-6">
          {comments.length === 0 ? (
            <p className="text-center text-gray-400 py-4">Belum ada komentar. Jadilah yang pertama memberikan dukungan!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ${comment.initialBg}`}>
                  {comment.initial}
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h5 className="font-bold text-[#4a4a4a] text-sm">{comment.name}</h5>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-[#555555] leading-relaxed bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <EmailRegistrationModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSuccess={submitComment}
        title="Daftar Email Dulu Yuk!"
        description="Untuk ikut berdiskusi dan memberikan dukungan, mohon daftarkan emailmu terlebih dahulu."
      />
    </main>
  );
}
