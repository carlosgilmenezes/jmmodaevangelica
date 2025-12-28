import React from 'react';
import { Lock } from 'lucide-react';

interface FooterProps {
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-white pt-8 pb-20 border-t border-gray-100 px-4 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">
          JM Moda Evangélica
        </p>
        <div className="flex space-x-3 text-[10px] text-gray-500 font-medium">
          <a href="#">Sobre</a>
          <a href="#">Ajuda</a>
          <a href="#">Privacidade</a>
          <a href="#">Termos</a>
        </div>
        <p className="text-[10px] text-gray-300">
          &copy; {new Date().getFullYear()} JM Moda. Todos os direitos reservados.
        </p>
        <button 
          onClick={onAdminClick}
          className="flex items-center text-[10px] text-gray-200 hover:text-gray-400 transition-colors"
        >
          <Lock className="w-3 h-3 mr-1" /> Login Admin
        </button>
      </div>
    </footer>
  );
};