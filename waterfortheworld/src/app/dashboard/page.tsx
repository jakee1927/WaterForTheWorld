'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Droplets, User, LogOut, CheckCircle, XCircle, BarChart2 } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Head from 'next/head';

export default function DashboardPage() {
  const { userData, signOut } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set up all hooks at the top level
  useEffect(() => {
    setIsClient(true);
    setIsMounted(true);
    
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        .certificate-container, .certificate-container * {
          visibility: visible;
        }
        .certificate-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: white;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  // Calculate derived state
  const peopleHelped = userData ? Math.floor(userData.dropletCount / 100) : 0;
  const totalAnswers = userData 
    ? (userData.quizStats?.correctAnswers || 0) + (userData.quizStats?.incorrectAnswers || 0) 
    : 0;
  const correctPercentage = totalAnswers > 0 
    ? Math.round(((userData?.quizStats?.correctAnswers || 0) / totalAnswers) * 100)
    : 0;

  const handlePrint = () => {
    window.print();
  };

  // Show loading state if not mounted or no user data
  if (!isClient || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Your Dashboard - Water For The World</title>
      </Head>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>

          {/* User Info */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg leading-6 font-medium text-gray-900">{userData.displayName}</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{userData.email}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Droplet Counter */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <Droplets className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Your Droplets</h3>
                    <div className="mt-2">
                      <p className="text-3xl font-bold text-gray-900">{userData.dropletCount}</p>
                      <p className="text-sm text-gray-500">Each droplet represents your contribution to clean water initiatives</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Stats */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <BarChart2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Quiz Statistics</h3>
                    <div className="mt-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                          <span className="font-medium">{userData.quizStats?.correctAnswers || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <XCircle className="h-5 w-5 text-red-500 mr-1" />
                          <span className="font-medium">{userData.quizStats?.incorrectAnswers || 0}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {correctPercentage}% correct
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Keep learning to improve your score!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border-2 border-blue-200">
            <div className="px-4 py-8 sm:p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Certificate of Impact</h2>
              
              <div className="certificate-container max-w-lg mx-auto p-8 border-2 border-blue-100 rounded-lg bg-white">
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">This certifies that</p>
                  <h3 className="text-2xl font-bold text-blue-600 mb-6">{userData.displayName}</h3>
                  <p className="text-gray-600 mb-6">has provided clean water for</p>
                  <div className="text-5xl font-bold text-blue-600 mb-6">{peopleHelped} {peopleHelped === 1 ? 'person' : 'people'}</div>
                  <p className="text-gray-600">in need through their contributions.</p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-center space-x-8">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Droplet ID</p>
                      <p className="font-mono text-sm">{userData.uid.substring(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                </div>
                
                {/* Quiz Stats for Print Only */}
                <div className="mt-6 pt-6 border-t border-gray-200 print:block">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Quiz Performance</h4>
                  <div className="flex justify-center space-x-6">
                    <div>
                      <p className="text-sm text-gray-500">Correct Answers</p>
                      <p className="font-medium text-green-600">{userData.quizStats?.correctAnswers || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Accuracy</p>
                      <p className="font-medium">{correctPercentage}%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  onClick={handlePrint}
                  className="print:hidden inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Print Certificate
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Thank you for being a part of our mission to provide clean water to those in need.</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
