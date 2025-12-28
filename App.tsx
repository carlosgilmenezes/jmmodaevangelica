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

export type TabType = 'grid' | 'reels' | 'tagged' | 'search';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LANDING);
  const [activeTab, setActiveTab] = useState<TabType>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  const [clientId, setClientId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState(false);
  
  const [clientsCount, setClientsCount] = useState<number>(537);
  const [viewingStory, setViewingStory] = useState(false);

  // Caminho da API no seu servidor Hostgator
  const API_URL = './api.php';

  useEffect(() => {
    fetchProducts();
    checkLocalAuth();
    fetchInitialClientCount();
  }, []);

  const fetchInitialClientCount = async () => {
    try {
      const response = await fetch(`${API_URL}?action=get_client_count`);
      const data = await response.json();
      if (data.total !== undefined) {
        setClientsCount(537 + data.total);
      }
    } catch (e) {
      console.warn("Usando contador base padrão.");
    }
  };

  const checkLocalAuth = async () => {
    const savedPhone = localStorage.getItem('jm_whatsapp');
    if (savedPhone) {
      // Tenta re-identificar o cliente via API se necessário, 
      // ou apenas usa o nome salvo se preferir simplificar.
      // Aqui vamos manter o estado baseado no que foi salvo no registro.
      const savedName = localStorage.getItem('jm_client_name');
      const savedId = localStorage.getItem('jm_client_id');
      if (savedName && savedId) {
        setClientId(savedId);
        setCurrentUserName(savedName);
        setIsRegistered(true);
      }
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch(`${API_URL}?action=get_products`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      }
    } catch (e) {
      console.warn("Erro ao carregar produtos do MySQL. Usando locais.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleRegisterClient = async (newClient: ClientData): Promise<string | null> => {
    try {
      const response = await fetch(`${API_URL}?action=register_client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Fix: Changed 'json.stringify' to 'JSON.stringify'
        body: JSON.stringify({
          first_name: newClient.firstName,
          last_name: newClient.lastName,
          nickname: newClient.nickname,
          whatsapp: newClient.whatsapp
        })
      });
      const data = await response.json();
      
      if (data.id) {
        setClientId(data.id);
        setCurrentUserName(data.first_name);
        setIsRegistered(true);
        localStorage.setItem('jm_whatsapp', data.whatsapp);
        localStorage.setItem('jm_client_name', data.first_name);
        localStorage.setItem('jm_client_id', data.id);
        
        // Atualiza contador visual
        fetchInitialClientCount();
        
        return data.password;
      }
      return null;
    } catch (error) {
      console.error("Erro no cadastro:", error);
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
    const container = document.getElementById('root');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = () => {
    const p = prompt("Acesso Administrativo - Digite sua senha:");
    if (p === "admin") {
      setViewState(ViewState.ADMIN);
    } else if (p !== null) {
      alert("Senha inválida.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent font-sans">
      {viewState === ViewState.ADMIN ? (
        <AdminPanel 
          onClose={() => { setViewState(ViewState.LANDING); fetchProducts(); }} 
          apiUrl={API_URL}
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
              apiUrl={API_URL}
              onRefreshProducts={fetchProducts}
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