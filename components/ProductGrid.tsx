import React, { useState, useMemo, useEffect } from 'react';
import { Grid, User, PlaySquare, Heart, MessageCircle, Send, MoreVertical, ShoppingCart, X, Search as SearchIcon, Clock, ChevronRight, Volume2 } from 'lucide-react';
import { TabType } from '../App';
import { Product } from '../types';

interface Comment {
  id: string;
  text: string;
  client_name: string;
  created_at: string;
  product_id: number;
  product_name?: string;
  product_image?: string;
}

interface ProductGridProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isRegistered: boolean;
  clientId: string | null;
  registeredUserName?: string;
  onCommentAttempt: () => boolean;
  onHomeClick?: () => void;
  onFollowClick?: () => void;
  products: Product[];
  isLoading: boolean;
  apiUrl: string;
  onRefreshProducts: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  activeTab, 
  onTabChange, 
  isRegistered, 
  clientId,
  registeredUserName, 
  onCommentAttempt,
  onHomeClick,
  onFollowClick,
  products,
  isLoading,
  apiUrl,
  onRefreshProducts
}) => {
  const [localLikes, setLocalLikes] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>({});
  const [recentComments, setRecentComments] = useState<Comment[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [activeCommentReel, setActiveCommentReel] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      loadInteractions();
    }
  }, [products]);

  useEffect(() => {
    if (activeTab === 'tagged') {
      loadRecentComments();
    }
  }, [activeTab]);

  const loadRecentComments = async () => {
    setLoadingRecent(true);
    try {
      const response = await fetch(`${apiUrl}?action=get_comments`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const formatted = data.map((c: any) => ({
          id: c.id,
          text: c.text,
          client_name: c.first_name || "Membro VIP",
          created_at: c.created_at,
          product_id: c.product_id,
          product_name: c.product_name,
          product_image: c.product_image
        }));
        setRecentComments(formatted.slice(0, 10));
      }
    } catch (e) {
      console.error("Erro ao buscar feed de comentários:", e);
    } finally {
      setLoadingRecent(false);
    }
  };

  const loadInteractions = async () => {
    const counts: Record<number, number> = {};
    products.forEach(p => {
      // @ts-ignore
      counts[p.id] = parseInt(p.likes_count || 0);
    });
    setLikeCounts(counts);

    try {
      const response = await fetch(`${apiUrl}?action=get_comments`);
      const commentsData = await response.json();

      const cMap: Record<number, Comment[]> = {};
      commentsData?.forEach((c: any) => {
        const formatted = {
          id: c.id,
          text: c.text,
          client_name: c.first_name || "Anônimo",
          created_at: c.created_at,
          product_id: c.product_id
        };
        if (!cMap[c.product_id]) cMap[c.product_id] = [];
        cMap[c.product_id].push(formatted);
      });
      setCommentsMap(cMap);
    } catch (e) {
      console.error("Erro ao carregar banco de dados:", e);
    }
  };

  const handleLike = async (productId: number) => {
    const isCurrentlyLiked = localLikes[productId];
    const currentCount = likeCounts[productId] || 0;
    const newCount = isCurrentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1;

    setLocalLikes(prev => ({ ...prev, [productId]: !isCurrentlyLiked }));
    setLikeCounts(prev => ({ ...prev, [productId]: newCount }));

    try {
      await fetch(`${apiUrl}?action=update_likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, count: newCount })
      });
    } catch (e) {
      console.error("Erro ao processar clique público.");
    }
  };

  const submitComment = async (e: React.FormEvent, productId: number) => {
    e.preventDefault();
    if (!onCommentAttempt() || !newComment.trim()) return;

    try {
      const response = await fetch(`${apiUrl}?action=post_comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          product_id: productId,
          text: newComment
        })
      });
      const data = await response.json();

      if (data && data.id) {
        const formatted = {
          id: data.id,
          text: data.text,
          client_name: data.first_name,
          created_at: data.created_at,
          product_id: data.product_id
        };
        setCommentsMap(prev => ({
          ...prev,
          [productId]: [...(prev[productId] || []), formatted]
        }));
        setNewComment("");
      }
    } catch (e) {
      alert("Erro ao enviar comentário VIP.");
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [searchQuery, products]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white h-screen">
        <div className="w-8 h-8 border-4 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] font-black text-brand-pink uppercase tracking-widest">JM Moda Evangélica</p>
      </div>
    );
  }

  return (
    <section className={`bg-white max-w-[600px] mx-auto w-full ${activeTab === 'reels' ? 'h-[calc(100vh-96px)]' : ''}`}>
      {activeTab !== 'search' && (
        <div className="flex border-t border-[#DBDBDB]/50 sticky top-[44px] bg-white z-40">
          <button onClick={() => onTabChange('grid')} className={`flex-1 flex justify-center py-3.5 transition-colors ${activeTab === 'grid' ? 'border-t-[1.5px] border-black mt-[-1.5px] text-black' : 'text-[#8e8e8e]'}`}>
            <Grid className="w-[22px] h-[22px]" />
          </button>
          <button onClick={() => onTabChange('reels')} className={`flex-1 flex justify-center py-3.5 transition-colors ${activeTab === 'reels' ? 'border-t-[1.5px] border-black mt-[-1.5px] text-black' : 'text-[#8e8e8e]'}`}>
            <PlaySquare className="w-[22px] h-[22px]" />
          </button>
          <button onClick={() => onTabChange('tagged')} className={`flex-1 flex justify-center py-3.5 transition-colors ${activeTab === 'tagged' ? 'border-t-[1.5px] border-black mt-[-1.5px] text-black' : 'text-[#8e8e8e]'}`}>
            <User className="w-[22px] h-[22px]" />
          </button>
        </div>
      )}

      {activeTab === 'grid' && (
        <div className="grid grid-cols-3 gap-[1px] bg-[#DBDBDB]">
          {filteredProducts.map(p => (
            <div key={p.id} className="aspect-square bg-white cursor-pointer relative group" onClick={() => onTabChange('reels')}>
              <img src={p.imageUrl} className="w-full h-full object-cover" loading="lazy" />
              {p.videoUrl && (
                <div className="absolute top-1.5 right-1.5 text-white drop-shadow-md">
                   <PlaySquare className="w-4 h-4" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Heart className="w-6 h-6 text-white fill-white/50" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="flex flex-col bg-black h-full overflow-y-auto snap-y snap-mandatory no-scrollbar relative">
          {products.map(product => {
            const isLiked = localLikes[product.id];
            const currentLikes = likeCounts[product.id] || 0;
            const currentComments = commentsMap[product.id] || [];

            return (
              <div key={product.id} className="relative w-full h-full flex-shrink-0 snap-start bg-black flex flex-col justify-center overflow-hidden">
                {product.videoUrl ? (
                  <video 
                    src={product.videoUrl} 
                    className="w-full h-full object-cover" 
                    autoPlay 
                    loop 
                    muted={isMuted} 
                    playsInline 
                    onClick={() => setIsMuted(!isMuted)}
                  />
                ) : (
                  <img src={product.imageUrl} className="w-full h-full object-contain" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

                <div className="absolute right-3 bottom-24 flex flex-col items-center space-y-6 text-white z-20">
                  <div className="flex flex-col items-center cursor-pointer group" onClick={() => handleLike(product.id)}>
                    <div className="transition-transform active:scale-125 duration-200">
                      <Heart className={`w-[28px] h-[28px] ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} strokeWidth={2.5} />
                    </div>
                    <span className="text-[12px] font-bold mt-1 drop-shadow-md">{currentLikes}</span>
                  </div>
                  <div className="flex flex-col items-center cursor-pointer group" onClick={() => setActiveCommentReel(product.id)}>
                    <MessageCircle className="w-[28px] h-[28px] group-active:scale-110 transition-transform" strokeWidth={2.5} />
                    <span className="text-[12px] font-bold mt-1 drop-shadow-md">{currentComments.length}</span>
                  </div>
                  <Send className="w-[26px] h-[26px]" />
                  <MoreVertical className="w-6 h-6" />
                </div>

                {product.videoUrl && (
                  <div className="absolute top-4 right-4 z-20 text-white/50" onClick={() => setIsMuted(!isMuted)}>
                     <Volume2 className={`w-5 h-5 ${isMuted ? 'opacity-30' : 'opacity-100'}`} />
                  </div>
                )}

                <div className="absolute left-4 bottom-10 text-white w-[80%] z-20">
                  <div className="flex items-center mb-4">
                    <img src="https://picsum.photos/50/50?random=50" className="w-[32px] h-[32px] rounded-full border border-white/50 mr-3" />
                    <span className="font-bold text-[14px]">jm_moda_evangelica</span>
                  </div>
                  <h3 className="text-[14px] font-semibold mb-2 drop-shadow-sm">{product.name}</h3>
                  <p className="text-white/80 text-xs mb-4">R$ {Number(product.price).toFixed(2)} - Peça Premium</p>
                  <a href={`https://wa.me/5571991192907?text=Quero comprar o ${product.name}`} target="_blank" className="w-full h-[40px] flex items-center justify-center bg-white text-black rounded-[8px] text-[14px] font-bold no-underline active:scale-95 transition-all shadow-lg hover:bg-gray-100">
                    <ShoppingCart className="w-4 h-4 mr-2" /> Comprar Agora
                  </a>
                </div>

                {activeCommentReel === product.id && (
                  <div className="absolute inset-0 z-50 bg-black/40 flex flex-col justify-end">
                    <div className="bg-white rounded-t-xl h-[60%] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
                      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                        <span className="font-bold text-sm text-gray-800">Comentários VIP</span>
                        <button onClick={() => setActiveCommentReel(null)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                        {currentComments.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center opacity-30">
                             <MessageCircle className="w-12 h-12 mb-2" />
                             <p className="text-xs font-bold uppercase tracking-widest text-center">Seja a primeira a comentar este look!</p>
                          </div>
                        ) : (
                          currentComments.map(c => (
                            <div key={c.id} className="flex space-x-3 items-start animate-in fade-in duration-500">
                              <div className="w-8 h-8 rounded-full bg-brand-pink/10 flex items-center justify-center text-[8px] font-black text-brand-pink shrink-0 border border-brand-pink/20 uppercase tracking-tighter">VIP</div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-[11px] font-black text-gray-900">@{c.client_name.toLowerCase().replace(/\s/g, '_')}</p>
                                  <p className="text-[9px] text-gray-400 font-bold">{new Date(c.created_at).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <p className="text-[13px] text-gray-700 mt-0.5 leading-relaxed">{c.text}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <form onSubmit={(e) => submitComment(e, product.id)} className="p-4 border-t flex space-x-3 bg-white">
                        <input 
                          type="text" 
                          placeholder={isRegistered ? "Escreva algo..." : "Cadastre-se para comentar..."}
                          className="flex-1 text-sm outline-none bg-gray-50 border border-gray-100 rounded-full px-4 py-2 focus:border-brand-pink transition-all"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit" className="text-brand-pink font-bold text-sm disabled:opacity-30 transition-all uppercase tracking-tighter" disabled={!newComment.trim()}>Enviar</button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'tagged' && (
        <div className="min-h-screen bg-gray-50 flex flex-col animate-in fade-in duration-500 pb-24">
          <div className="bg-white p-5 border-b flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div className="flex items-center">
               <User className="w-5 h-5 text-brand-pink mr-3" />
               <h2 className="font-black text-xs uppercase tracking-[0.1em] text-gray-800">Feedback das Clientes</h2>
            </div>
            <button onClick={loadRecentComments} className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-90">
              <Clock className={`w-4 h-4 text-brand-pink ${loadingRecent ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 no-scrollbar">
            {loadingRecent ? (
               <div className="flex flex-col items-center justify-center h-40 opacity-40">
                  <div className="w-6 h-6 border-2 border-brand-pink border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Sincronizando...</p>
               </div>
            ) : recentComments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-60 text-gray-400 text-center px-10">
                <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm font-medium">Os últimos 10 comentários VIP aparecerão aqui em breve.</p>
              </div>
            ) : (
              recentComments.map(c => (
                <div key={c.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-bottom-2 duration-300">
                   <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-pink to-brand-deepPink flex items-center justify-center text-[10px] font-black text-white shadow-sm shrink-0 uppercase">VIP</div>
                      <div className="ml-3 flex-1 overflow-hidden">
                         <div className="flex items-center justify-between">
                            <p className="font-black text-[13px] text-gray-900 truncate">@{c.client_name.toLowerCase().replace(/\s/g, '_')}</p>
                            <span className="text-[9px] text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded-full">{new Date(c.created_at).toLocaleDateString('pt-BR')}</span>
                         </div>
                         <p className="text-[10px] text-gray-400 font-medium">Comentou em {c.product_name}</p>
                      </div>
                   </div>
                   <div className="bg-brand-igBg p-4 rounded-xl border border-gray-100 flex space-x-4 items-center group cursor-pointer active:opacity-70 transition-all" onClick={() => onTabChange('reels')}>
                      <div className="flex-1 relative">
                         <p className="text-[14px] text-gray-700 leading-relaxed italic">"{c.text}"</p>
                         <div className="absolute -left-2 top-0 text-brand-pink/20 text-3xl font-serif">“</div>
                      </div>
                      {c.product_image && (
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 border-white shadow-md">
                           <img src={c.product_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-pink" />
                   </div>
                </div>
              ))
            )}
            <div className="py-8 text-center">
              <p className="text-[10px] text-gray-300 uppercase font-black tracking-[0.3em]">Exibindo 10 amostras recentes</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'search' && (
        <div className="min-h-screen bg-white">
          <div className="p-4 border-b sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Procurar no catálogo VIP..." className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 ring-brand-pink transition-all" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-[1px] bg-gray-100">
            {filteredProducts.map(p => (
              <div key={p.id} className="bg-white p-3 cursor-pointer group" onClick={() => onTabChange('reels')}>
                <div className="overflow-hidden rounded-lg mb-2 aspect-[3/4]">
                   <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h4 className="font-bold text-xs truncate text-gray-800">{p.name}</h4>
                <div className="flex items-center justify-between mt-1">
                   <p className="text-brand-pink font-black text-sm">R$ {Number(p.price).toFixed(2)}</p>
                   <div className="flex items-center text-[10px] text-gray-400">
                      <Heart className="w-3 h-3 mr-0.5 fill-gray-200 text-gray-200" />
                      {/* @ts-ignore */}
                      {p.likes_count || 0}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};