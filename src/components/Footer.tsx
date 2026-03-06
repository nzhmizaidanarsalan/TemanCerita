import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 py-8 border-t border-gray-200/50 flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-8">
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-primary fill-primary" />
        <span className="font-bold text-[#4a4a4a]">TemanCerita</span>
      </div>
      <div className="text-sm text-gray-400">
        © 2026 TemanCerita. Kamu tidak sendirian.
      </div>
    </footer>
  );
}
