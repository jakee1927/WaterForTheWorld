'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, Droplets, CheckCircle, XCircle, Award, Globe, Zap, Loader2 } from "lucide-react";
import Link from "next/link";

type QuizTopic = 'water' | 'sat' | 'pop' | 'general';

interface Question {
  id: string;
  question: string;
  options: { id: string; label: string }[];
  answer: string;
}

interface QuizData {
  questions: Question[];
}

const TOPICS = [
  {
    id: 'general',
    name: 'General Trivia',
    description: 'A mix of questions from various categories',
    icon: Globe,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100',
    comingSoon: false
  },
  {
    id: 'pop',
    name: 'Pop Culture',
    description: 'Questions about movies, music, and celebrity news',
    icon: Zap,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    hoverColor: 'hover:bg-pink-100',
    comingSoon: false
  },
  {
    id: 'water',
    name: 'Water Scarcity',
    description: 'Test your knowledge about global water issues and conservation',
    icon: Droplets,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
    comingSoon: true
  },
  {
    id: 'sat',
    name: 'SAT Prep',
    description: 'Practice questions to help with your SAT preparation',
    icon: Award,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100',
    comingSoon: true
  }
];

export default function QuizzesPage() {
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const [questionsCompleted, setQuestionsCompleted] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { userData, updateDropletCount, updateQuizStats } = useAuth();
  const [shouldBounce, setShouldBounce] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [localDropletCount, setLocalDropletCount] = useState(0);

  // Sync local droplet count with user data
  useEffect(() => {
    if (userData) {
      setLocalDropletCount(userData.dropletCount || 0);
    }
  }, [userData]);

  // Trigger milestone popup every 100 drops
  useEffect(() => {
    if (localDropletCount > 0 && localDropletCount % 100 === 0) {
      setShowMilestone(true);
    }
  }, [localDropletCount]);

  // Load quiz data when topic is selected
  useEffect(() => {
    const loadQuizData = async () => {
      if (!selectedTopic) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/quizzes/${selectedTopic}.json`);
        if (!response.ok) {
          throw new Error('Failed to load quiz data');
        }
        const data = await response.json();
        setQuizData(data);
        
        // Initialize question order as a random permutation of question indices
        const indices = Array.from({ length: data.questions.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        setQuestionOrder(indices);
        setCurrentQuestionIndex(0);
        setQuestionsCompleted(0);
        setSelectedOptionId(null);
        setShowFeedback(false);
      } catch (error) {
        console.error('Error loading quiz data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizData();
  }, [selectedTopic]);

  const currentQuestion = quizData?.questions?.[questionOrder[currentQuestionIndex]];

  const handleOptionChange = (value: string) => {
    setSelectedOptionId(value);
    if (showFeedback) { // If feedback is already shown, selecting a new option should prepare for next check
        setShowFeedback(false);
        setIsCorrect(null);
    }
  };

  const handleSubmitAndNext = async () => {
    if (!selectedOptionId || !quizData) {
      // Consider a more user-friendly notification if needed
      return;
    }

    const correctAnswer = currentQuestion?.answer === selectedOptionId;
    setIsCorrect(correctAnswer);
    setShowFeedback(true);
    
    // Update quiz stats and add water drops for correct answers
    try {
      await updateQuizStats(correctAnswer);
      
      if (correctAnswer) {
        const newDrops = (userData?.dropletCount || 0) + 10;
        setLocalDropletCount(newDrops);
        setShouldBounce(true);
        // Update in Firestore
        try {
          await updateDropletCount(newDrops);
        } catch (error) {
          console.error('Failed to update droplet count:', error);
          // Revert local state on error
          setLocalDropletCount(userData?.dropletCount || 0);
        }
        // Reset bounce after animation completes
        setTimeout(() => setShouldBounce(false), 1000);
      }
    } catch (error) {
      console.error('Error updating quiz stats:', error);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOptionId(null);
      setIsCorrect(null);
      // Move to next question, reshuffle if we've shown all questions
      setQuestionsCompleted(prev => prev + 1);
      setCurrentQuestionIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        
        // If we've shown all questions, reshuffle for a new round
        if (nextIndex >= quizData.questions.length) {
          // Create a new random order for the next round
          const indices = Array.from({ length: quizData.questions.length }, (_, i) => i);
          for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
          }
          setQuestionOrder(indices);
          return 0;
        }
        
        return nextIndex;
      });
    }, 2000); // 2-second delay to show feedback
  };

  // Topic selection screen
  if (!selectedTopic) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
        
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 w-full">
          <div className="w-full max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Select a Quiz Topic</h1>
            <p className="text-lg text-gray-600 mb-8">Choose a category to start your quiz journey</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {TOPICS.map((topic) => {
                const Icon = topic.icon;
                return (
                  <div key={topic.id} className="relative">
                    <button
                      onClick={() => !topic.comingSoon && setSelectedTopic(topic.id as QuizTopic)}
                      disabled={topic.comingSoon}
                      className={`${topic.bgColor} ${topic.hoverColor} p-6 rounded-xl transition-all duration-200 transform ${
                        topic.comingSoon ? 'opacity-60' : 'hover:scale-105 hover:shadow-md'
                      } flex flex-col items-center text-center border border-transparent ${
                        !topic.comingSoon && `hover:border-${topic.color.split('-')[1]}-200`
                      } w-full h-full`}
                    >
                      <div className={`${topic.color} mb-4 p-3 rounded-full ${topic.comingSoon ? 'bg-gray-100' : 'bg-white'}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {topic.name}
                        {topic.comingSoon}
                      </h3>
                      <p className="text-gray-600 text-sm">{topic.description}</p>
                    </button>
                    {topic.comingSoon && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-70 text-white text-sm font-medium px-3 py-1 rounded-full">
                          Coming Soon
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Floating Water Drop Counter - Positioned below the navbar */}
      <div className="fixed top-16 right-4 z-50">
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-blue-100 rounded-full shadow-lg px-4 py-2 transition-all duration-300 hover:shadow-xl hover:scale-105">
          <Droplets className="h-5 w-5 text-blue-500" />
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 font-medium">Water Drops</span>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {localDropletCount}
            </span>
          </div>
          <div className="h-8 w-0.5 bg-blue-100 mx-1"></div>
          <div className="w-16 h-2 bg-blue-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000"
              style={{ width: `${localDropletCount % 100}%` }}
            />
          </div>
        </div>
      </div>

      {showMilestone && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <style jsx>{`
            @keyframes pop-in {
              0% {
                opacity: 0;
                transform: scale(0.5);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-pop-in {
              animation: pop-in 0.3s ease-out forwards;
            }
          `}</style>
          <div className="bg-white rounded-2xl shadow-xl text-center w-full max-w-md p-8 relative animate-pop-in">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-500 rounded-full p-4 border-4 border-white">
              <Award className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mt-8 mb-2">Milestone Reached!</h2>
            <p className="text-5xl font-bold text-blue-600 my-4">{localDropletCount}</p>
            <p className="text-lg text-gray-600 mb-6">You&apos;re making a real difference, drop by drop!</p>
            <Button onClick={() => setShowMilestone(false)} className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-full transition-transform hover:scale-105">
              Keep Going!
            </Button>
          </div>
        </div>
      )}



      <main className="flex-1 flex flex-col items-center w-full">
        <div className="flex w-full justify-center px-4">

          {/* Quiz Content */}
          <div className="w-full lg:w-4/6 max-w-4xl py-8 md:py-12">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                Test Your Knowledge
              </h1>
              <p className="mt-3 text-gray-700 md:text-lg">
                Answer the questions to learn more and contribute to our cause.
              </p>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                <p className="text-gray-600">Loading your quiz...</p>
              </div>
            ) : !currentQuestion ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No questions available</h2>
                <p className="text-gray-600 mb-4">We couldn&apos;t load any questions for this topic.</p>
                <Button onClick={() => setSelectedTopic(null)} variant="outline">
                  Back to Topics
                </Button>
              </div>
            ) : (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-700">
                    Question {questionsCompleted + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-800 mb-6">{currentQuestion.question}</p>
                  <RadioGroup value={selectedOptionId || ''} onValueChange={handleOptionChange} className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <Label
                        key={option.id}
                        htmlFor={option.id}
                        className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 ease-in-out
                          ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
                          ${selectedOptionId === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                          ${showFeedback && option.id === currentQuestion.answer ? 'border-green-500 bg-green-50' : ''}
                          ${showFeedback && selectedOptionId === option.id && option.id !== currentQuestion.answer ? 'border-red-500 bg-red-50' : ''}
                        `}
                      >
                        <RadioGroupItem value={option.id} id={option.id} disabled={showFeedback} />
                        <span className="text-md text-gray-700 flex-1">
                          {option.label}
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>

                  {showFeedback && (
                    <div className={`mt-4 p-3 rounded-md flex items-center text-sm font-medium
                      ${isCorrect ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}
                    >
                      {isCorrect ? (
                        <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                      ) : (
                        <XCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                      )}
                      <span>
                        {isCorrect 
                          ? <span>Correct! <span className="font-bold text-green-600">+10 drops!</span> 💧</span>
                          : `Incorrect. The correct answer was: ${currentQuestion.options.find(opt => opt.id === currentQuestion.answer)?.label}`
                        }
                      </span>
                    </div>
                  )}

                  <div className="mt-6 text-right">
                    <Button
                      onClick={handleSubmitAndNext}
                      disabled={showFeedback || !selectedOptionId}
                      className={`bg-blue-600 hover:bg-blue-700 text-white min-w-[150px] ${shouldBounce ? 'animate-bounce' : ''}`}
                    >
                      {showFeedback ? 'Please wait...' : (
                        <>
                          <span>Check Answer</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-gray-900 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Droplets className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold">WaterForTheWorld</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/#about" className="text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/#privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/#contact" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 WaterForTheWorld. All revenue donated to fight water scarcity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
