import React, { useState, useEffect, useMemo } from 'react';
import { ViewState, Product } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { RegistrationModal, ClientData } from './components/RegistrationModal';
import { StoryViewer } from './components/StoryViewer';
import { STORIES, PRODUCTS as FALLBACK_PRODUCTS } from './constants';

// Importando Supabase via ESM para compatibilidade total com Hostgator/Static
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// CONFIGURAÇÃO SUPABASE - Substitua pelas suas credenciais antes de subir para a Hostgator
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anon-aqui';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type TabType = 'grid' | 'reels' | 'tagged' | 'search';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LANDING);
  const [activeTab, setActiveTab] = useState<TabType>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // Auth & Stats
  const [clientId, setClientId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Inicializado com 537 (conforme solicitado) + contagem do banco
  const [clientsCount, setClientsCount] = useState<number>(537);
  const [viewingStory, setViewingStory] = useState(false);

  useEffect(() => {
    fetchProducts();
    checkLocalAuth();
    fetchInitialClientCount();
  }, []);

  const fetchInitialClientCount = async () => {
    try {
      const { count, error } = await supabase
        .from('jm_clients')
        .select('*', { count: 'exact', head: true });
      
      if (!error && count !== null) {
        setClientsCount(537 + count);
      }
    } catch (e) {
      console.warn("Sincronizando contador base...");
    }
  };

  const checkLocalAuth = async () => {
    const savedPhone = localStorage.getItem('jm_whatsapp');
    if (savedPhone) {
      const { data } = await supabase
        .from('jm_clients')
        .select('id, first_name')
        .eq('whatsapp', savedPhone)
        .single();
      
      if (data) {
        setClientId(data.id);
        setCurrentUserName(data.first_name);
        setIsRegistered(true);
      }
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('jm_products')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data && data.length > 0) {
        setProducts(data);
      }
    } catch (e) {
      console.warn("Utilizando catálogo de fallback local.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleRegisterClient = async (newClient: ClientData): Promise<string | null> => {
    try {
      const { data: existing } = await supabase
        .from('jm_clients')
        .select('id, password, first_name')
        .eq('whatsapp', newClient.whatsapp)
        .single();

      if (existing) {
        setClientId(existing.id);
        setCurrentUserName(existing.first_name);
        setIsRegistered(true);
        localStorage.setItem('jm_whatsapp', newClient.whatsapp);
        return existing.password;
      }

      const generatedPassword = Math.floor(100000 + Math.random() * 900000).toString();
      const { data: inserted, error } = await supabase
        .from('jm_clients')
        .insert([{ 
          first_name: newClient.firstName,
          last_name: newClient.lastName,
          nickname: newClient.nickname,
          whatsapp: newClient.whatsapp,
          password: generatedPassword
        }])
        .select()
        .single();

      if (error) throw error;
      
      setClientId(inserted.id);
      setCurrentUserName(inserted.first_name);
      setIsRegistered(true);
      localStorage.setItem('jm_whatsapp', newClient.whatsapp);
      setClientsCount(prev => prev + 1);
      
      return generatedPassword; 
    } catch (error) {
      console.error("Erro no cadastro VIP:", error);
      return null;
    }
  };

  const activeStories = useMemo(() => {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    return STORIES.filter(s => s.timestamp > twentyFourHoursAgo).slice(0, 10);
  }, []);

  const handleHomeClick = () => {
    setViewState(ViewState.LANDING);
    setActiveTab('grid');
    document.getElementById('root')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = () => {
    const p = prompt("Área Restrita - Digite a senha administrativa:");
    if (p === "admin") {
      setViewState(ViewState.ADMIN);
    } else if (p !== null) {
      alert("Acesso negado.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      {viewState === ViewState.ADMIN ? (
        <AdminPanel 
          onClose={() => { setViewState(ViewState.LANDING); fetchProducts(); }} 
          supabase={supabase}
        />
      ) : (
        <div className="max-w-[600px] mx-auto bg-white shadow-2xl min-h-screen relative border-x border-brand-pink/10 flex flex-col">
          <Header onHomeClick={handleHomeClick} />
          
          <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
            {(activeTab !== 'reels' && activeTab !== 'search') && (
              <Hero 
                onTabChange={setActiveTab} 
                activeTab={activeTab} 
                onFollowClick={() => setIsModalOpen(true)}
                onProfileClick={() => activeStories.length > 0 && setViewingStory(true)}
                clientCount={clientsCount}
                isRegistered={isRegistered}
                hasStories={activeStories.length > 0}
              />
            )}
            
            <ProductGrid 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              isRegistered={isRegistered}
              clientId={clientId}
              registeredUserName={currentUserName}
              onCommentAttempt={() => { if(!isRegistered) setIsModalOpen(true); return isRegistered; }}
              onHomeClick={handleHomeClick}
              onFollowClick={() => setIsModalOpen(true)}
              products={products}
              isLoading={loadingProducts}
              supabase={supabase}
            />
            
            {(activeTab !== 'reels' && activeTab !== 'search') && (
              <Footer onAdminClick={handleAdminLogin} />
            )}
          </div>

          <BottomNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            onAdminClick={handleAdminLogin} 
          />
          
          {isModalOpen && (
            <RegistrationModal 
              onClose={() => setIsModalOpen(false)} 
              onSubmit={handleRegisterClient}
            />
          )}

          {viewingStory && (
            <StoryViewer 
              stories={activeStories} 
              onClose={() => setViewingStory(false)} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;