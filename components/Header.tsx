import React from 'react';
import { ChevronLeft, MoreHorizontal, Bell } from 'lucide-react';

interface HeaderProps {
  onHomeClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="sticky top-0 z-[60] bg-white border-b border-[#DBDBDB] h-[44px] flex items-center px-4 justify-between max-w-[600px] mx-auto w-full">
      <div className="flex items-center">
        <ChevronLeft 
          className="w-6 h-6 mr-6 cursor-pointer text-[#262626]" 
          strokeWidth={2.5} 
          onClick={onHomeClick}
        />
        <span 
          className="font-bold text-[16px] text-[#262626] tracking-tight cursor-pointer hover:opacity-70 transition-opacity"
          onClick={onHomeClick}
        >
          jm_moda_evangelica
        </span>
      </div>
      <div className="flex items-center space-x-5">
        <Bell className="w-[24px] h-[24px] text-[#262626]" strokeWidth={2} />
        <MoreHorizontal className="w-[24px] h-[24px] text-[#262626]" strokeWidth={2} />
      </div>
    </header>
  );
};