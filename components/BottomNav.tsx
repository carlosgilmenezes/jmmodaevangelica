import React from 'react';
import { Home, Search, PlusSquare, PlaySquare, User } from 'lucide-react';
import { TabType } from '../App';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onAdminClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onAdminClick }) => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-white border-t border-[#DBDBDB] h-[48px] flex items-center justify-around z-[100] max-w-[600px] mx-auto w-full px-2">
      <button onClick={() => onTabChange('grid')} className="p-2 flex-1 flex justify-center">
        <Home className={`w-[26px] h-[26px] ${activeTab === 'grid' ? 'text-black fill-current' : 'text-[#262626]'}`} strokeWidth={activeTab === 'grid' ? 2.5 : 2} />
      </button>
      
      <button onClick={() => onTabChange('search')} className="p-2 flex-1 flex justify-center">
        <Search className={`w-[26px] h-[26px] ${activeTab === 'search' ? 'text-black font-bold' : 'text-[#262626]'}`} strokeWidth={activeTab === 'search' ? 3 : 2} />
      </button>
      
      {/* Botão de Admin (+) */}
      <button 
        onClick={onAdminClick}
        className="p-2 flex-1 flex justify-center group"
      >
        <PlusSquare className="w-[26px] h-[26px] text-[#262626] group-active:scale-90 transition-transform" strokeWidth={2} />
      </button>

      <button onClick={() => onTabChange('reels')} className="p-2 flex-1 flex justify-center">
        <PlaySquare className={`w-[26px] h-[26px] ${activeTab === 'reels' ? 'text-black fill-current' : 'text-[#262626]'}`} strokeWidth={activeTab === 'reels' ? 2.5 : 2} />
      </button>
      
      {/* Ícone de Boneco (Tagged) - Feed de Comentários */}
      <button onClick={() => onTabChange('tagged')} className="p-2 flex-1 flex justify-center">
        <User className={`w-[26px] h-[26px] ${activeTab === 'tagged' ? 'text-brand-pink fill-brand-pink/10' : 'text-[#262626]'}`} strokeWidth={activeTab === 'tagged' ? 2.5 : 2} />
      </button>
    </nav>
  );
};