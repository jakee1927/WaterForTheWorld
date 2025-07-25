'use client';

import { useState, useEffect } from 'react';
import { Loader2, X, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AITutorProps {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

export function AITutor({ isOpen, onClose, question, userAnswer, correctAnswer }: AITutorProps) {
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchExplanation = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/explain-answer', {
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
        console.error('Error fetching explanation:', err);
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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-medium">SAT Tutor</span>
          </div>
          <button
            onClick={onClose}
            className="text-blue-100 hover:text-white focus:outline-none"
            aria-label="Close tutor"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="animate-spin h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm text-gray-600">Getting explanation...</span>
            </div>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-700">{explanation}</p>
              <div className="pt-2">
                <Button
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
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
      <div className="absolute -bottom-1 right-4 w-4 h-4 transform rotate-45 bg-white border-r border-b border-gray-200"></div>
    </div>
  );
}
