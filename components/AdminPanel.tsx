import React, { useState, useEffect, useRef } from 'react';
import { Package, Settings, Users, BarChart3, Trash2, Edit, Save, X, Heart, MessageSquare, Camera, Upload, Loader2, Play, Video } from 'lucide-react';
import { Product } from '../types';

interface AdminPanelProps {
  onClose: () => void;
  apiUrl: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, apiUrl }) => {
  const [view, setView] = useState<'products' | 'clients' | 'engagement'>('products');
  const [items, setItems] = useState<Product[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [engagement, setEngagement] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [uploading, setUploading] = useState<'image' | 'video' | null>(null);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadData(); }, [view]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (view === 'products') {
        const response = await fetch(`${apiUrl}?action=get_products`);
        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
      } else if (view === 'clients') {
        const response = await fetch(`${apiUrl}?action=get_all_clients`);
        const data = await response.json();
        setClients(Array.isArray(data) ? data : []);
      } else if (view === 'engagement') {
        const response = await fetch(`${apiUrl}?action=get_comments`);
        const data = await response.json();
        setEngagement(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Erro ao carregar dados admin:", e);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(type);
    const formData = new FormData();
    formData.append(type === 'image' ? 'image' : 'video', file);

    try {
      const action = type === 'image' ? 'upload_image' : 'upload_video';
      const response = await fetch(`${apiUrl}?action=${action}`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      if (data.url) {
        setEditing(prev => prev ? { 
          ...prev, 
          [type === 'image' ? 'imageUrl' : 'videoUrl']: data.url 
        } : null);
      } else {
        alert("Erro no upload: " + (data.error || "Desconhecido"));
      }
    } catch (err) {
      alert("Falha na conexão com o servidor.");
    } finally {
      setUploading(null);
    }
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.imageUrl) {
      alert("O look precisa de pelo menos uma imagem de capa.");
      return;
    }
    
    try {
      const response = await fetch(`${apiUrl}?action=save_product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing)
      });
      const data = await response.json();
      if (data.success) {
        setEditing(null);
        loadData();
      }
    } catch (e) {
      alert("Erro ao salvar.");
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Excluir look permanentemente?")) return;
    try {
      await fetch(`${apiUrl}?action=delete_product&id=${id}`, { method: 'DELETE' });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-gray-100 flex overflow-hidden font-sans">
      <div className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 font-bold border-b border-gray-800 tracking-tight">
          <Settings className="w-5 h-5 mr-3 text-brand-pink" /> JM MODA ADMIN
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setView('products')} className={`w-full flex items-center p-3 rounded-lg text-sm font-bold transition-all ${view === 'products' ? 'bg-brand-pink text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <Package className="w-5 h-5 mr-3" /> Catálogo & Reels
          </button>
          <button onClick={() => setView('clients')} className={`w-full flex items-center p-3 rounded-lg text-sm font-bold transition-all ${view === 'clients' ? 'bg-brand-pink text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <Users className="w-5 h-5 mr-3" /> Clientes VIP
          </button>
          <button onClick={() => setView('engagement')} className={`w-full flex items-center p-3 rounded-lg text-sm font-bold transition-all ${view === 'engagement' ? 'bg-brand-pink text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <BarChart3 className="w-5 h-5 mr-3" /> Interações
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
           <button onClick={onClose} className="w-full py-2 bg-gray-800 hover:bg-red-900 transition-colors rounded-lg text-xs font-bold uppercase tracking-widest">Sair do Painel</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between shadow-sm">
          <h1 className="font-black text-xl uppercase text-gray-800 tracking-tighter">
            {view === 'products' ? 'Gestão de Conteúdo' : view === 'clients' ? 'Membros VIP' : 'Métricas'}
          </h1>
          {view === 'products' && (
            <button onClick={() => setEditing({ name: '', price: 0, category: 'Vestidos', imageUrl: '', videoUrl: '' } as any)} className="bg-brand-pink text-white px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-md">
              + Adicionar Look
            </button>
          )}
        </header>

        <main className="flex-1 overflow-auto p-8 bg-gray-50">
          {loading ? (
            <div className="h-full flex items-center justify-center">
               <div className="w-10 h-10 border-4 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : view === 'products' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden group">
                  <div className="h-52 bg-gray-100 relative">
                    <img src={p.imageUrl} className="w-full h-full object-cover" />
                    {p.videoUrl && (
                      <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-full">
                        <Video className="w-4 h-4" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-black text-brand-pink shadow-sm uppercase">{p.category}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-gray-800 truncate">{p.name}</h3>
                    <p className="text-brand-pink font-black text-lg mb-4">R$ {Number(p.price).toFixed(2)}</p>
                    <div className="flex space-x-2">
                       <button onClick={() => setEditing(p)} className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">Editar</button>
                       <button onClick={() => deleteProduct(p.id)} className="w-10 flex items-center justify-center bg-gray-50 text-red-400 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : view === 'clients' ? (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr className="text-[10px] uppercase font-black text-gray-400">
                      <th className="p-6">Nome Completo</th>
                      <th className="p-6">WhatsApp</th>
                      <th className="p-6">PIN VIP</th>
                      <th className="p-6">Cadastro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {clients.map(c => (
                      <tr key={c.id}>
                        <td className="p-6 font-bold">{c.first_name} {c.last_name}</td>
                        <td className="p-6 text-xs">{c.whatsapp}</td>
                        <td className="p-6"><span className="bg-brand-pink/10 text-brand-pink px-2 py-1 rounded font-black">{c.password}</span></td>
                        <td className="p-6 text-[10px] text-gray-400 font-bold uppercase">{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
             <div className="bg-white rounded-2xl border shadow-sm p-6 max-w-2xl mx-auto">
                <h3 className="text-xs font-black uppercase mb-6 text-gray-400 tracking-[0.2em]">Feed de Comentários VIP</h3>
                <div className="space-y-4">
                  {engagement.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 text-sm italic">Nenhuma interação VIP registrada ainda.</p>
                  ) : (
                    engagement.map(e => (
                      <div key={e.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                         <div className="flex items-center space-x-4">
                            <img src={e.product_image} className="w-12 h-12 rounded-lg object-cover border" />
                            <div>
                              <p className="text-sm font-bold text-gray-800">@{e.first_name.toLowerCase()} em {e.product_name}</p>
                              <p className="text-xs italic text-gray-500 mt-0.5">"{e.text}"</p>
                            </div>
                         </div>
                         <span className="text-[10px] font-black text-gray-300 uppercase">{new Date(e.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    ))
                  )}
                </div>
             </div>
          )}
        </main>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[400] bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={saveProduct} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 my-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-lg uppercase text-gray-800">Editor de Look</h2>
              <button type="button" onClick={() => setEditing(null)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Upload de Foto */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Foto (Capa/Grade)</label>
                  <div 
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-pink transition-all overflow-hidden relative"
                  >
                    {editing.imageUrl ? (
                      <img src={editing.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        {uploading === 'image' ? (
                          <Loader2 className="w-8 h-8 text-brand-pink animate-spin" />
                        ) : (
                          <>
                            <Camera className="w-8 h-8 text-gray-300 mb-1" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Subir Foto</span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
                </div>

                {/* Upload de Vídeo */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Vídeo (Opcional - Reels)</label>
                  <div 
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-pink transition-all overflow-hidden relative"
                  >
                    {editing.videoUrl ? (
                      <div className="w-full h-full bg-brand-black flex items-center justify-center">
                        <Play className="text-white w-10 h-10" />
                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] text-white/50 font-bold uppercase">Vídeo Selecionado</span>
                      </div>
                    ) : (
                      <>
                        {uploading === 'video' ? (
                          <Loader2 className="w-8 h-8 text-brand-pink animate-spin" />
                        ) : (
                          <>
                            <Video className="w-8 h-8 text-gray-300 mb-1" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Subir Vídeo</span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nome da Peça</label>
                  <input required placeholder="Ex: Vestido Midi" className="w-full border p-3 rounded-xl mt-1 focus:ring-2 ring-brand-pink outline-none" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Preço (R$)</label>
                  <input required type="number" step="0.01" className="w-full border p-3 rounded-xl mt-1 focus:ring-2 ring-brand-pink outline-none" value={editing.price} onChange={e => setEditing({...editing, price: parseFloat(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Categoria</label>
                <select className="w-full border p-3 rounded-xl mt-1 focus:ring-2 ring-brand-pink outline-none bg-white" value={editing.category} onChange={e => setEditing({...editing, category: e.target.value})}>
                  <option>Vestidos</option>
                  <option>Saias</option>
                  <option>Conjuntos</option>
                  <option>Blusas</option>
                  <option>Casacos</option>
                  <option>Acessórios</option>
                </select>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={!!uploading}
              className="w-full bg-brand-pink text-white font-black py-4 rounded-xl shadow-xl uppercase mt-8 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {editing.id ? 'Atualizar Look' : 'Publicar Agora'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};