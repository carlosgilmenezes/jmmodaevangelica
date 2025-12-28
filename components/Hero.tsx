import React from 'react';
import { Settings, Check, ChevronDown } from 'lucide-react';
import { TabType } from '../App';

interface HeroProps {
  onTabChange: (tab: TabType) => void;
  activeTab: TabType;
  onFollowClick: () => void;
  onProfileClick: () => void;
  clientCount: number;
  isRegistered: boolean;
  hasStories: boolean;
}

export const Hero: React.FC<HeroProps> = ({ 
  onTabChange, 
  activeTab, 
  onFollowClick, 
  onProfileClick,
  clientCount, 
  isRegistered,
  hasStories 
}) => {
  const formattedCount = clientCount >= 1000 
    ? (clientCount / 1000).toFixed(1) + ' mil' 
    : clientCount.toString();

  const whatsappNumber = "5571991192907";
  const whatsappMessage = encodeURIComponent("Quero saber mais informações sobre a JM Moda Evangélica");

  return (
    <div className="bg-white px-4 pt-4 pb-2 max-w-[600px] mx-auto w-full">
      <div className="flex items-center mb-6">
        <div className="relative cursor-pointer mr-7" onClick={onProfileClick}>
          {/* Exact IG Story Ring */}
          <div className={`w-[84px] h-[84px] rounded-full flex items-center justify-center ${hasStories ? 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]' : 'bg-[#DBDBDB]'}`}>
            <div className="bg-white w-[78px] h-[78px] rounded-full flex items-center justify-center">
              <img 
                src="https://picsum.photos/200/200?random=50" 
                alt="JM Moda" 
                className="w-[72px] h-[72px] rounded-full object-cover"
              />
            </div>
          </div>
          {hasStories && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#E91E63] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] border-2 border-white uppercase scale-90">
              LIVE
            </div>
          )}
        </div>
        
        <div className="flex-1 flex justify-around px-2 text-center">
          <div className="flex flex-col">
            <div className="font-bold text-[16px]">142</div>
            <div className="text-[13px] text-[#262626]">publicações</div>
          </div>
          <div className="flex flex-col">
            <div className="font-bold text-[16px]">{formattedCount}</div>
            <div className="text-[13px] text-[#262626]">clientes</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h1 className="font-bold text-[14px] text-[#262626]">JM Moda Evangélica</h1>
        <p className="text-[14px] text-[#8e8e8e]">Moda Feminina & Modesta</p>
        <p className="text-[14px] text-[#262626] leading-[18px]">
          Vista-se com <span className="italic font-medium">Elegância e Fé</span> ✨<br />
          👗 Cortes exclusivos e tecidos premium<br />
          📦 Enviamos para todo o Brasil<br />
          👇 Clique abaixo para ver as peças limitadas!
        </p>
        <p className="text-[14px] font-bold text-[#00376b] mt-0.5">linktr.ee/jmmodaevangelica</p>
      </div>

      <div className="flex space-x-1.5 mb-8">
        <button 
          onClick={isRegistered ? undefined : onFollowClick}
          className={`flex-1 h-[32px] font-bold rounded-[8px] text-[14px] transition-all flex items-center justify-center ${isRegistered ? 'bg-[#efefef] text-[#262626]' : 'bg-[#0095f6] text-white active:opacity-70'}`}
        >
          {isRegistered ? <><Check className="w-4 h-4 mr-1" strokeWidth={3} /> Cliente VIP</> : 'Seguir'}
        </button>
        <a 
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-[32px] bg-[#efefef] text-[#262626] font-bold rounded-[8px] text-[14px] flex items-center justify-center transition-all active:opacity-70"
        >
          Mensagem
        </a>
        <button className="bg-[#efefef] h-[32px] w-[32px] rounded-[8px] flex items-center justify-center active:opacity-70">
          <Settings className="w-4 h-4 text-[#262626]" />
        </button>
      </div>

      {/* Dynamic Action Button */}
      <div className="mb-8">
        <button
          onClick={() => onTabChange('grid')}
          className="w-full h-[36px] flex items-center justify-center text-[14px] font-bold rounded-[8px] text-white bg-gradient-to-r from-[#E91E63] to-[#880E4F] shadow-md active:scale-[0.98] transition-all"
        >
          🛒 VER COLEÇÃO - PEÇAS LIMITADAS
        </button>
      </div>

      {/* Highlights / Destaques */}
      <div className="flex space-x-5 overflow-x-auto no-scrollbar pb-4 border-b border-[#DBDBDB]/50">
        {[
          { name: 'Novidades', img: '101' },
          { name: 'Clientes', img: '102' },
          { name: 'Provador', img: '103' },
          { name: 'Looks', img: '104' },
          { name: 'Dúvidas', img: '105' }
        ].map((h, i) => (
          <div key={i} className="flex flex-col items-center flex-shrink-0 cursor-pointer group" onClick={() => onTabChange('reels')}>
            <div className="w-[64px] h-[64px] rounded-full border border-[#DBDBDB] p-[3px] mb-1 group-active:scale-95 transition-transform">
              <div className="w-full h-full rounded-full border border-[#DBDBDB]/50 overflow-hidden">
                <img src={`https://picsum.photos/100/100?random=${h.img}`} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-[12px] text-[#262626] truncate max-w-[64px]">{h.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};