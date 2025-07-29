'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, X, Mic2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Helper function to parse markdown text
const parseMarkdown = (text: string): { __html: string } => {
  if (!text) return { __html: '' };
  
  // Replace **bold** with <strong> tags
  let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Replace *italic* with <em> tags
  parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  return { __html: parsed };
};

interface GameshowTutorProps {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

export function GameshowTutor({ isOpen, onClose, question, userAnswer, correctAnswer }: GameshowTutorProps) {
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Parse markdown explanation with memoization
  const parsedExplanation = useMemo(() => parseMarkdown(explanation), [explanation]);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchExplanation = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/gameshow-explain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question,
            userAnswer,
            correctAnswer,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get explanation');
        }

        const data = await response.json();
        setExplanation(data.explanation);
      } catch (err) {
        console.error('Error fetching gameshow explanation:', err);
        setError('Failed to load explanation. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExplanation();
  }, [isOpen, question, userAnswer, correctAnswer]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xs sm:max-w-sm md:max-w-md">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-xl overflow-hidden border-2 border-yellow-300">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-purple-700 to-pink-700">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center text-purple-900">
              <Mic2 className="h-4 w-4" />
            </div>
            <span className="text-yellow-200 font-bold text-sm uppercase tracking-wider">Game Show Host</span>
          </div>
          <button
            onClick={onClose}
            className="text-yellow-200 hover:text-white focus:outline-none"
            aria-label="Close tutor"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 bg-white/90">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="animate-spin h-6 w-6 text-purple-500 mr-2" />
              <span className="text-sm text-purple-800 font-medium">Preparing your feedback...</span>
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start">
                <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                <p 
                  className="text-sm text-gray-800" 
                  dangerouslySetInnerHTML={parsedExplanation} 
                />
              </div>
              <div className="pt-2">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-sm py-1.5"
                  onClick={onClose}
                >
                  Got it!
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Speech bubble pointer */}
      <div className="absolute -bottom-1 right-4 w-4 h-4 transform rotate-45 bg-white border-r-2 border-b-2 border-yellow-300"></div>
    </div>
  );
}
