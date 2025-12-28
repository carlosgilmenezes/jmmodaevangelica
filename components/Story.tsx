import React from 'react';

export const Story: React.FC = () => {
  return (
    <section id="story" className="py-16 bg-brand-gray/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-pink/20 rounded-full z-0"></div>
            <img
              src="https://picsum.photos/600/800?random=200"
              alt="Fundadora da marca ou foto lifestyle"
              className="relative z-10 rounded-lg shadow-xl w-full object-cover h-[500px]"
            />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-brand-black/10 rounded-full z-0"></div>
          </div>
          <div className="mt-10 lg:mt-0">
            <h2 className="text-base text-brand-pink font-semibold tracking-wide uppercase">Nossa Essência</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Beleza na Modéstia, Poder na Graça
            </p>
            <div className="mt-4 text-lg text-gray-500 space-y-6">
              <p>
                A JM Moda Evangélica nasceu do desejo de unir valores de fé e moda contemporânea. Percebemos que muitas mulheres lutavam para encontrar roupas que fossem ao mesmo tempo respeitosas e estilosas.
              </p>
              <p>
                Acreditamos que o que você veste é uma extensão do seu espírito. Nossas peças são criadas para empoderar você, permitindo que sua beleza interior brilhe através de silhuetas elegantes e designs dignos.
              </p>
              <blockquote className="border-l-4 border-brand-pink pl-4 italic text-gray-700 bg-white p-4 rounded-r-lg shadow-sm">
                "Modéstia não é sobre se esconder; é sobre revelar sua dignidade."
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};