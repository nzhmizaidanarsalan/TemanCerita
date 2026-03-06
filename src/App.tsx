import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Stories from './pages/Stories';
import WriteStory from './pages/WriteStory';
import Admin from './pages/Admin';
import StoryDetail from './pages/StoryDetail';

export default function App() {
  return (
    <Router>
      <div className="text-[#5a5a5a] font-display min-h-screen flex flex-col overflow-x-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl"></div>
          <div className="absolute top-[20%] right-[-5%] w-[30%] h-[50%] bg-pink-100/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] bg-orange-50/50 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 py-6 flex flex-col gap-16 min-h-screen">
          <Header />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cerita" element={<Stories />} />
            <Route path="/cerita/:id" element={<StoryDetail />} />
            <Route path="/tulis" element={<WriteStory />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          
          <Footer />
        </div>
      </div>
    </Router>
  );
}

