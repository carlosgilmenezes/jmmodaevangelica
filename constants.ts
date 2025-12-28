import { Product, Testimonial, Feature, StoryPost } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Vestido Midi Floral Grace",
    price: 189.90,
    description: "Tecido chiffon leve com estampa floral modesta, perfeito para o culto de domingo.",
    category: "Vestidos",
    imageUrl: "https://picsum.photos/400/600?random=1",
    sizes: ["P", "M", "G", "GG"]
  },
  {
    id: 2,
    name: "Blazer Clássico Elegante",
    price: 229.90,
    description: "Blazer de alfaiataria em crepe premium. Adiciona sofisticação a qualquer look.",
    category: "Casacos",
    imageUrl: "https://picsum.photos/400/600?random=2",
    sizes: ["M", "G", "GG"]
  },
  {
    id: 3,
    name: "Saia Plissada Serenity",
    price: 139.90,
    description: "Uma saia plissada atemporal com caimento perfeito. Comprimento modesto e cós confortável.",
    category: "Saias",
    imageUrl: "https://picsum.photos/400/600?random=3",
    sizes: ["P", "M", "G"]
  },
  {
    id: 4,
    name: "Blusa de Seda Modesta",
    price: 119.90,
    description: "Blusa de seda com gola alta e brilho suave. Perfeita para sobreposições.",
    category: "Blusas",
    imageUrl: "https://picsum.photos/400/600?random=4",
    sizes: ["P", "M", "G", "GG", "XG"]
  }
];

export const STORIES: StoryPost[] = [
  {
    id: 's1',
    type: 'image',
    content: 'https://picsum.photos/1080/1920?random=1001',
    timestamp: Date.now() - 3600000 // 1h ago
  },
  {
    id: 's2',
    type: 'text',
    content: 'Bom dia princesas do Senhor! ✨ Que tal um café e um look novo para começar o dia?',
    timestamp: Date.now() - 7200000, // 2h ago
    backgroundColor: '#E91E63',
    textColor: '#FFFFFF'
  },
  {
    id: 's3',
    type: 'image',
    content: 'https://picsum.photos/1080/1920?random=1002',
    timestamp: Date.now() - 10800000 // 3h ago
  },
  {
    id: 's4',
    type: 'text',
    content: 'Atenção! Reposição do Vestido Midi Floral em 1 hora. Ativem as notificações! 🔔',
    timestamp: Date.now() - 14400000,
    backgroundColor: '#000000',
    textColor: '#FFFFFF'
  },
  {
    id: 's5',
    type: 'image',
    content: 'https://picsum.photos/1080/1920?random=1003',
    timestamp: Date.now() - 18000000
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sara M.",
    role: "Professora",
    content: "Finalmente uma marca que entende que modéstia não significa sacrificar o estilo. A qualidade do tecido é incrível!",
    rating: 5,
    avatarUrl: "https://picsum.photos/100/100?random=10"
  },
  {
    id: 2,
    name: "Rebeca L.",
    role: "Líder de Louvor",
    content: "Sinto-me tão confiante e elegante no Vestido Grace. O caimento é perfeito e cobre lindamente.",
    rating: 5,
    avatarUrl: "https://picsum.photos/100/100?random=11"
  },
  {
    id: 3,
    name: "Ana P.",
    role: "Empresária",
    content: "Profissional, elegante e modesta. O blazer é minha escolha certa para reuniões.",
    rating: 4,
    avatarUrl: "https://picsum.photos/100/100?random=12"
  }
];

export const FEATURES: Feature[] = [
  {
    id: 1,
    title: "Modéstia em Primeiro Lugar",
    description: "Cortes cuidadosamente desenhados que oferecem cobertura sem comprometer a estética moderna.",
    icon: "shield"
  },
  {
    id: 2,
    title: "Tecidos Premium",
    description: "Tecidos respiráveis, duráveis e não transparentes, escolhidos para conforto e dignidade.",
    icon: "gem"
  },
  {
    id: 3,
    title: "Produção Ética",
    description: "Feito com respeito por quem produz e pelo meio ambiente.",
    icon: "heart"
  }
];