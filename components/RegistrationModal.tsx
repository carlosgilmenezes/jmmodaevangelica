import React, { useState } from 'react';
import { X, Heart, CheckCircle, MessageSquare } from 'lucide-react';

export interface ClientData {
  firstName: string;
  lastName: string;
  nickname?: string;
  whatsapp: string;
  date: string;
  password?: string;
}

interface RegistrationModalProps {
  onClose: () => void;
  onSubmit: (data: ClientData) => Promise<string | null>;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    whatsapp: ''
  });
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.whatsapp) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }
    
    setLoading(true);
    const password = await onSubmit({
      ...formData,
      date: new Date().toLocaleDateString('pt-BR')
    });
    setLoading(false);

    if (password) {
      setGeneratedPassword(password);
    }
  };

  const handleWhatsAppRedir = () => {
    const msg = encodeURIComponent(`Olá! Acabei de me cadastrar na JM Moda Evangélica. Minha senha VIP é: ${generatedPassword}`);
    window.open(`https://wa.me/5571991192907?text=${msg}`, '_blank');
  };

  if (generatedPassword) {
    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-[500px] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vinda, Cliente VIP!</h2>
          <p className="text-gray-500 mb-6 font-medium">Seu cadastro foi realizado com sucesso!</p>
          
          <div className="bg-gray-50 border-2 border-dashed border-brand-pink rounded-xl p-6 mb-6">
            <p className="text-xs uppercase font-bold text-gray-400 mb-2 tracking-widest">Sua Senha de Acesso</p>
            <p className="text-4xl font-black text-brand-pink tracking-[0.2em]">{generatedPassword}</p>
          </div>

          <button 
            onClick={handleWhatsAppRedir}
            className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition-all active:scale-95 mb-3"
          >
            <MessageSquare className="w-5 h-5" />
            <span>RECEBER NO WHATSAPP</span>
          </button>
          
          <button onClick={onClose} className="text-sm text-gray-400 font-medium hover:text-gray-600 mt-2">
            Fechar e continuar navegando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[500px] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#FAFAFA]">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-brand-pink fill-current" />
            <h2 className="font-bold text-gray-800">Seja uma Cliente VIP</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <p className="text-sm text-gray-500 mb-2">
            Cadastre-se para receber sua senha VIP e novidades exclusivas em primeira mão.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Nome *</label>
              <input 
                required
                disabled={loading}
                type="text" 
                placeholder="Ex: Maria"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all"
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Sobrenome *</label>
              <input 
                required
                disabled={loading}
                type="text" 
                placeholder="Ex: Silva"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all"
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Nickname (Opcional)</label>
            <input 
              disabled={loading}
              type="text" 
              placeholder="Ex: Mari_Silva"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all"
              value={formData.nickname}
              onChange={e => setFormData({...formData, nickname: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">WhatsApp *</label>
            <input 
              required
              disabled={loading}
              type="tel" 
              placeholder="(71) 99999-9999"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all"
              value={formData.whatsapp}
              onChange={e => setFormData({...formData, whatsapp: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-pink text-white font-bold py-3 rounded-xl shadow-lg hover:bg-pink-600 transition-all active:scale-95 uppercase tracking-wide text-sm flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Gerar Minha Senha VIP"
              )}
            </button>
            <p className="text-[10px] text-center text-gray-400 mt-4">
              Ao se cadastrar você concorda em receber comunicações via WhatsApp.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};