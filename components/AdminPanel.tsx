import React, { useState, useEffect } from 'react';
import { Package, PlusCircle, Settings, Users, MessageSquare, Trash2, Key, X, Edit, Save, BarChart3, Heart } from 'lucide-react';
import { Product } from '../types';

interface AdminPanelProps {
  onClose: () => void;
  supabase: any;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, supabase }) => {
  const [view, setView] = useState<'products' | 'clients' | 'engagement'>('products');
  const [items, setItems] = useState<Product[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [engagement, setEngagement] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  useEffect(() => { loadData(); }, [view]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (view === 'products') {
        const { data } = await supabase.from('jm_products').select('*').order('id', { ascending: false });
        setItems(data || []);
      } else if (view === 'clients') {
        const { data } = await supabase.from('jm_clients').select('*').order('created_at', { ascending: false });
        setClients(data || []);
      } else if (view === 'engagement') {
        // Busca comentários e mostra relação
        const { data: comments } = await supabase
          .from('jm_comments')
          .select('*, jm_products(name), jm_clients(first_name)');
        setEngagement(comments || []);
      }
    } catch (e) {
      console.error("Erro ao carregar dados admin:", e);
    }
    setLoading(false);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing?.id) {
        await supabase.from('jm_products').update(editing).eq('id', editing.id);
      } else {
        await supabase.from('jm_products').insert([{ ...editing, likes_count: 0 }]);
      }
      setEditing(null);
      loadData();
    } catch (e) {
      alert("Erro ao salvar produto.");
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    await supabase.from('jm_products').delete().eq('id', id);
    loadData();
  };

  return (
    <div className="fixed inset-0 z-[300] bg-gray-100 flex overflow-hidden">
      <div className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 font-bold border-b border-gray-800 tracking-tight">
          <Settings className="w-5 h-5 mr-3 text-brand-pink" /> JM MODA ADMIN
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setView('products')} className={`w-full flex items-center p-3 rounded-lg text-sm font-bold transition-all ${view === 'products' ? 'bg-brand-pink text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <Package className="w-5 h-5 mr-3" /> Catálogo
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
            {view === 'products' ? 'Gestão de Looks' : view === 'clients' ? 'Membros VIP' : 'Métricas de Engajamento'}
          </h1>
          {view === 'products' && (
            <button onClick={() => setEditing({ name: '', price: 0, category: 'Vestidos', imageUrl: '', likes_count: 0 } as any)} className="bg-brand-pink text-white px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-md hover:scale-105 transition-transform active:scale-95">
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
                <div key={p.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="h-48 relative overflow-hidden">
                    <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1 shadow-sm border border-gray-100">
                       <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                       {/* @ts-ignore */}
                       <span className="text-[10px] font-black text-gray-800">{p.likes_count || 0}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-gray-800 truncate mb-1">{p.name}</h3>
                    <p className="text-brand-pink font-black text-lg mb-4">R$ {p.price.toFixed(2)}</p>
                    <div className="flex space-x-2">
                       <button onClick={() => setEditing(p)} className="flex-1 flex items-center justify-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-bold transition-colors"><Edit className="w-3.5 h-3.5 mr-1.5" /> Editar</button>
                       <button onClick={() => deleteProduct(p.id)} className="w-10 flex items-center justify-center bg-gray-50 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : view === 'clients' ? (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                    <th className="p-6">Nome Completo</th>
                    <th className="p-6">WhatsApp / Contato</th>
                    <th className="p-6">PIN de Acesso</th>
                    <th className="p-6">Data de Cadastro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {clients.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-6 font-bold text-gray-800">{c.first_name} {c.last_name}</td>
                      <td className="p-6 font-mono text-xs text-brand-igBlue">{c.whatsapp}</td>
                      <td className="p-6"><span className="bg-brand-pink/10 text-brand-pink px-2.5 py-1 rounded font-black tracking-[0.2em] text-sm border border-brand-pink/20">{c.password}</span></td>
                      <td className="p-6 text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
                   <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Engajamento Total</p><p className="text-3xl font-black text-gray-800">{engagement.length + items.reduce((acc, p) => acc + ((p as any).likes_count || 0), 0)}</p></div>
                   <BarChart3 className="text-brand-pink w-10 h-10 opacity-20" />
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
                   <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Comentários</p><p className="text-3xl font-black text-gray-800">{engagement.length}</p></div>
                   <MessageSquare className="text-brand-igBlue w-10 h-10 opacity-20" />
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
                   <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total de Membros VIP</p><p className="text-3xl font-black text-gray-800">{clients.length}</p></div>
                   <Users className="text-green-500 w-10 h-10 opacity-20" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/30"><h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Últimos Comentários</h3></div>
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b">
                    <tr className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                      <th className="p-4">Membro</th>
                      <th className="p-4">Produto Alvo</th>
                      <th className="p-4">Comentário</th>
                      <th className="p-4 text-right">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {engagement.map((e, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/30">
                        <td className="p-4 font-bold text-xs">@{e.jm_clients?.first_name.toLowerCase()}</td>
                        <td className="p-4 text-xs text-gray-500">{e.jm_products?.name}</td>
                        <td className="p-4 text-xs italic">"{e.text}"</td>
                        <td className="p-4 text-[10px] text-gray-400 text-right">{new Date(e.created_at).toLocaleDateString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <form onSubmit={saveProduct} className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
               <h2 className="font-black text-gray-800 uppercase tracking-tight">Editar Produto</h2>
               <button type="button" onClick={() => setEditing(null)}><X className="w-6 h-6 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nome da Peça</label>
                <input required className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-brand-pink" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Preço (R$)</label>
                  <input required className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-brand-pink" type="number" step="0.01" value={editing.price} onChange={e => setEditing({...editing, price: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Cliques Iniciais</label>
                  {/* @ts-ignore */}
                  <input className="w-full border border-gray-200 p-3 rounded-xl outline-none bg-gray-50" type="number" value={editing.likes_count || 0} onChange={e => setEditing({...editing, likes_count: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">URL da Imagem</label>
                <input required className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-brand-pink" value={editing.imageUrl} onChange={e => setEditing({...editing, imageUrl: e.target.value})} />
              </div>
              <button className="w-full bg-brand-pink text-white font-black py-4 rounded-2xl shadow-xl hover:bg-pink-600 transition-all active:scale-95 flex items-center justify-center uppercase tracking-widest text-sm">
                <Save className="w-4 h-4 mr-2" /> Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};