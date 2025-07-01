'use client';

import { useState, useEffect } from 'react';
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
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [waterDrops, setWaterDrops] = useState(0);
  const [shouldBounce, setShouldBounce] = useState(false);

  // Load water drops from localStorage on component mount
  useEffect(() => {
    const savedDrops = localStorage.getItem('waterDrops');
    if (savedDrops) {
      setWaterDrops(parseInt(savedDrops, 10));
    }
  }, []);

  // Save water drops to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('waterDrops', waterDrops.toString());
  }, [waterDrops]);

  // Load quiz data when topic is selected
  useEffect(() => {
    const loadQuizData = async () => {
      if (!selectedTopic) return;
      
      setIsLoading(true);
      try {
        // Move the quiz data to the public directory for static serving
        const response = await fetch(`/quizzes/${selectedTopic}.json`);
        if (!response.ok) {
          throw new Error('Failed to load quiz data');
        }
        const data = await response.json();
        setQuizData(data);
        setCurrentQuestionIndex(0);
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

  const currentQuestion = quizData?.questions?.[currentQuestionIndex];

  const handleOptionChange = (value: string) => {
    setSelectedOptionId(value);
    if (showFeedback) { // If feedback is already shown, selecting a new option should prepare for next check
        setShowFeedback(false);
        setIsCorrect(null);
    }
  };

  const handleSubmitAndNext = () => {
    if (!selectedOptionId || !quizData) {
      // Consider a more user-friendly notification if needed
      return;
    }

    const correctAnswer = currentQuestion?.answer === selectedOptionId;
    setIsCorrect(correctAnswer);
    setShowFeedback(true);
    
    // Add water drops for correct answers
    if (correctAnswer) {
      const newDrops = waterDrops + 10;
      setWaterDrops(newDrops);
      setShouldBounce(true);
      // Reset bounce after animation completes
      setTimeout(() => setShouldBounce(false), 1000);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOptionId(null);
      setIsCorrect(null);
      // Move to next question, loop back to 0 if at the end
      setCurrentQuestionIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= quizData.questions.length ? 0 : nextIndex;
      });
    }, 2000); // 2-second delay to show feedback
  };

  // Topic selection screen
  if (!selectedTopic) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <Link href="/" className="flex items-center space-x-2">
            <Droplets className="h-8 w-8 text-blue-600" />
            <span className="hidden md:inline text-xl font-bold text-gray-900">WaterForTheWorld</span>
          </Link>
          <nav className="ml-auto flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/quizzes" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Quizzes
            </Link>
            <Link href="/donate" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Donate
            </Link>
          </nav>
        </header>
        
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
      {/* Floating Water Drop Counter */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-blue-100 rounded-full shadow-lg px-4 py-2 transition-all duration-300 hover:shadow-xl hover:scale-105">
          <Droplets className="h-5 w-5 text-blue-500" />
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 font-medium">Water Drops</span>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {waterDrops}
            </span>
          </div>
          <div className="h-8 w-0.5 bg-blue-100 mx-1"></div>
          <div className="w-16 h-2 bg-blue-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000"
              style={{ width: `${Math.min(100, (waterDrops % 1000) / 10)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <Link href="/" className="flex items-center space-x-2">
          <Droplets className="h-8 w-8 text-blue-600" />
          <span className="hidden md:inline text-xl font-bold text-gray-900">WaterForTheWorld</span>
        </Link>
        <div className="ml-4">
          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
            {TOPICS.find(t => t.id === selectedTopic)?.name}
          </span>
        </div>
        <nav className="ml-auto flex gap-6">
          <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/quizzes" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Quizzes
          </Link>
          <Link href="/donate" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Donate
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center w-full">
        {/* Top Ad Placeholder */}
        <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 my-4 p-4 h-24 bg-gray-200/50 border border-gray-300 flex items-center justify-center text-gray-500">
          Top Google Ad Placeholder (e.g., 728x90)
        </div>

        <div className="flex w-full justify-center px-4">
          {/* Left Ad Placeholder */}
          <div className="hidden lg:flex w-1/6 p-4 h-auto sticky top-20 self-start">
            <div className="w-full h-[600px] bg-gray-200/50 border border-gray-300 flex items-center justify-center text-gray-500">
              Left Ad (e.g., 160x600)
            </div>
          </div>

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
                    Question {currentQuestionIndex + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-800 mb-6">{currentQuestion.question}</p>
                  <RadioGroup
                    value={selectedOptionId || ""}
                    onValueChange={handleOptionChange}
                    disabled={showFeedback}
                    className="space-y-4"
                  >
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center space-x-3 p-3 border rounded-md transition-colors cursor-pointer ${showFeedback ? 'cursor-not-allowed' : 'hover:bg-blue-50'}
                          ${showFeedback && option.id === currentQuestion.answer ? 'bg-green-100 border-green-400 ring-2 ring-green-300' : ''}
                          ${showFeedback && option.id === selectedOptionId && !isCorrect ? 'bg-red-100 border-red-400 ring-2 ring-red-300' : ''}
                          ${showFeedback && option.id !== selectedOptionId && option.id !== currentQuestion.answer ? 'opacity-70' : ''}
                        `}
                      >
                        <RadioGroupItem value={option.id} id={option.id} disabled={showFeedback} />
                        <Label htmlFor={option.id} className={`text-md text-gray-700 flex-1 ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                          {option.label}
                        </Label>
                      </div>
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

          {/* Right Ad Placeholder */}
          <div className="hidden lg:flex w-1/6 p-4 h-auto sticky top-20 self-start">
            <div className="w-full h-[600px] bg-gray-200/50 border border-gray-300 flex items-center justify-center text-gray-500">
              Right Ad (e.g., 160x600)
            </div>
          </div>
        </div>

        {/* Bottom Ad Placeholder */}
        <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 my-4 p-4 h-24 bg-gray-200/50 border border-gray-300 flex items-center justify-center text-gray-500">
          Bottom Google Ad Placeholder (e.g., 728x90)
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
