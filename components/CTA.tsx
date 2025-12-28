import React from 'react';
import { ArrowRight } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <section className="bg-brand-black">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Transforme seu guarda-roupa hoje.</span>
          <span className="block text-brand-pink mt-2">Elegância e propósito esperam por você.</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-gray-300">
          Agora que você sabe por que a JM Moda Evangélica é a escolha perfeita, você está a apenas um clique de se sentir confiante e linda.
        </p>
        <div className="mt-8 flex justify-center">
            <a
            href="#collection"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-md text-white bg-brand-pink hover:bg-pink-600 md:text-xl transition-all hover:shadow-lg hover:scale-105"
            >
            Ver a Coleção <ArrowRight className="ml-2 w-5 h-5"/>
            </a>
        </div>
        <p className="mt-4 text-sm text-gray-500">
            Frete grátis em pedidos acima de R$ 300 • Devolução Fácil em 30 Dias
        </p>
      </div>
    </section>
  );
};