import React from 'react';
import { FEATURES } from '../constants';
import { Shield, Gem, Heart, CheckCircle } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield className="w-8 h-8 text-white" />,
  gem: <Gem className="w-8 h-8 text-white" />,
  heart: <Heart className="w-8 h-8 text-white" />
};

export const Features: React.FC = () => {
  return (
    <section id="benefits" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-brand-pink font-semibold tracking-wide uppercase">Por que Nos Escolher</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
             Modéstia Encontra a Modernidade
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {FEATURES.map((feature) => (
              <div key={feature.id} className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-brand-pink text-white">
                  {iconMap[feature.icon]}
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Block */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden lg:grid lg:grid-cols-2">
            <div className="p-8 lg:p-12 bg-brand-black text-white flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">Lojas Comuns</h3>
                <ul className="space-y-4 opacity-70">
                    <li className="flex items-center"><span className="mr-3 text-red-400">×</span> Cortes comprometedores</li>
                    <li className="flex items-center"><span className="mr-3 text-red-400">×</span> Tecidos finos e transparentes</li>
                    <li className="flex items-center"><span className="mr-3 text-red-400">×</span> Tendências passageiras</li>
                </ul>
            </div>
            <div className="p-8 lg:p-12 bg-brand-pink text-white flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                <h3 className="text-2xl font-bold mb-4">JM Moda Evangélica</h3>
                <ul className="space-y-4">
                    <li className="flex items-center"><CheckCircle className="mr-3 w-5 h-5 text-white" /> Cortes dignos e elegantes</li>
                    <li className="flex items-center"><CheckCircle className="mr-3 w-5 h-5 text-white" /> Tecidos premium, sem transparência</li>
                    <li className="flex items-center"><CheckCircle className="mr-3 w-5 h-5 text-white" /> Estilo atemporal que dura</li>
                </ul>
            </div>
        </div>
      </div>
    </section>
  );
};