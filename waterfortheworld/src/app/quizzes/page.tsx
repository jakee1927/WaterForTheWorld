'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, Droplets, CheckCircle, XCircle } from "lucide-react"; // Removed Brain, Added CheckCircle, XCircle
import Link from "next/link";

const quizQuestions = [
  {
    id: "q1",
    question: "What percentage of the Earth's water is fresh water?",
    options: [
      { id: "q1o1", label: "Approximately 3%" },
      { id: "q1o2", label: "Approximately 10%" },
      { id: "q1o3", label: "Approximately 25%" },
      { id: "q1o4", label: "Approximately 50%" },
    ],
    answer: "q1o1",
  },
  {
    id: "q2",
    question: "Which of these is a major consequence of water scarcity?",
    options: [
      { id: "q2o1", label: "Increased biodiversity" },
      { id: "q2o2", label: "Improved agricultural output" },
      { id: "q2o3", label: "Food shortages and malnutrition" },
      { id: "q2o4", label: "Lower global temperatures" },
    ],
    answer: "q2o3",
  },
  {
    id: "q3",
    question: "What is the primary goal of WaterForTheWorld?",
    options: [
      { id: "q3o1", label: "To sell bottled water" },
      { id: "q3o2", label: "To fundraise for water purification projects" },
      { id: "q3o3", label: "To build swimming pools" },
      { id: "q3o4", label: "To promote water sports" },
    ],
    answer: "q3o2",
  },
  {
    id: "q4",
    question: "Which mathematical concept is often used in water resource management?",
    options: [
      { id: "q4o1", label: "Quantum Physics" },
      { id: "q4o2", label: "String Theory" },
      { id: "q4o3", label: "Statistics and Probability" },
      { id: "q4o4", label: "Abstract Algebra" },
    ],
    answer: "q4o3",
  },
];

export default function QuizzesPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleOptionChange = (value: string) => {
    setSelectedOptionId(value);
    if (showFeedback) { // If feedback is already shown, selecting a new option should prepare for next check
        setShowFeedback(false);
        setIsCorrect(null);
    }
  };

  const handleSubmitAndNext = () => {
    if (!selectedOptionId) {
      // Consider a more user-friendly notification if needed
      return;
    }

    const correctAnswer = currentQuestion.answer === selectedOptionId;
    setIsCorrect(correctAnswer);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOptionId(null);
      setIsCorrect(null);
      setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % quizQuestions.length);
    }, 2000); // 2-second delay to show feedback
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center space-x-2">
          <Droplets className="h-8 w-8 text-blue-600" />
          <span className="hidden md:inline text-xl font-bold text-gray-900">WaterForTheWorld</span>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link href="/#videos" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Videos
          </Link>
          <Link href="/quizzes" className="text-sm font-medium text-blue-600 transition-colors">
            Quizzes
          </Link>
          <Link href="/#impact" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Impact
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

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-800 mb-6">{currentQuestion.question}</p>
                <RadioGroup
                  value={selectedOptionId || ""}
                  onValueChange={handleOptionChange}
                  disabled={showFeedback}
                >
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-3 mb-3 p-3 border rounded-md transition-colors cursor-pointer ${showFeedback ? 'cursor-not-allowed' : 'hover:bg-blue-50'}
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
                    {isCorrect ? <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0" /> : <XCircle className="mr-2 h-5 w-5 flex-shrink-0" />}
                    <span>
                      {isCorrect ? "Correct!" : 
                        `Incorrect. The correct answer was: ${currentQuestion.options.find(opt => opt.id === currentQuestion.answer)?.label}`}
                    </span>
                  </div>
                )}

                <div className="mt-6 text-right">
                  <Button
                    onClick={handleSubmitAndNext}
                    disabled={showFeedback || !selectedOptionId}
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]"
                  >
                    {showFeedback ? "Please wait..." : "Check Answer"}
                    {!showFeedback && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

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
            <p>&copy; 2024 WaterForTheWorld. All revenue donated to fight water scarcity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
