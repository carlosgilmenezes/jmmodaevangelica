import React, { useState, useEffect, useCallback } from 'react';
import { X, Send } from 'lucide-react';
import { StoryPost } from '../types';

interface StoryViewerProps {
  stories: StoryPost[];
  initialIndex?: number;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const STORY_DURATION = 5000;

  const nextStory = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const prevStory = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + (100 / (STORY_DURATION / 50));
      });
    }, 50);

    return () => clearInterval(timer);
  }, [currentIndex, nextStory]);

  const currentStory = stories[currentIndex];
  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
      <div className="relative w-full h-full max-w-[600px] bg-black overflow-hidden flex flex-col">
        {/* Progress Bars */}
        <div className="absolute top-3 left-0 right-0 z-50 flex px-2 space-x-1">
          {stories.map((_, index) => (
            <div key={index} className="h-[2px] flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-50 ease-linear"
                style={{ 
                  width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-6 left-3 right-3 z-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-[32px] h-[32px] rounded-full border border-white/40 p-[1px]">
              <img src="https://picsum.photos/100/100?random=50" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-[14px] font-bold">jm_moda_evangelica</span>
              <span className="text-white/70 text-[12px]">
                {Math.floor((Date.now() - currentStory.timestamp) / 3600000)}h
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white active:scale-90 transition-transform">
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 w-full flex items-center justify-center relative bg-black">
          {currentStory.type === 'image' ? (
            <img 
              src={currentStory.content} 
              className="w-full h-full object-cover"
              alt="Story content"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center p-10 text-center"
              style={{ backgroundColor: currentStory.backgroundColor || '#E91E63' }}
            >
              <h2 
                className="text-[24px] font-bold leading-tight"
                style={{ color: currentStory.textColor || '#FFFFFF' }}
              >
                {currentStory.content}
              </h2>
            </div>
          )}

          {/* Nav Areas */}
          <div className="absolute inset-0 flex">
            <div className="w-[20%] h-full cursor-pointer" onClick={prevStory}></div>
            <div className="w-[80%] h-full cursor-pointer" onClick={nextStory}></div>
          </div>
        </div>

        {/* Footer Interaction */}
        <div className="h-[80px] bg-black px-4 flex items-center space-x-4">
          <div className="flex-1 border border-white/50 rounded-full h-[44px] flex items-center px-4">
            <input 
              type="text" 
              placeholder="Enviar mensagem" 
              className="bg-transparent text-white text-[14px] outline-none w-full"
            />
          </div>
          <button className="text-white active:scale-90 transition-transform">
            <HeartIcon />
          </button>
          <button className="text-white active:scale-90 transition-transform">
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

const HeartIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);