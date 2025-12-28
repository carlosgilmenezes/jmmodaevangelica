import React from 'react';
import { TESTIMONIALS } from '../constants';
import { Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Amada por Mulheres como Você
            </h2>
            <p className="mt-4 text-lg text-gray-500">
                Junte-se a centenas de mulheres que encontraram confiança em nossa coleção.
            </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-xl p-8 relative hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                  src={testimonial.avatarUrl}
                  alt={testimonial.name}
                />
                <div className="ml-4">
                  <div className="text-sm font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};