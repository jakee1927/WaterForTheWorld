'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Droplets, User, LogOut } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  const { userData, signOut } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (!isClient || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const peopleHelped = Math.floor(userData.dropletCount / 100);

  return (
    <ProtectedRoute>
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

          {/* Droplet Counter */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
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

          {/* Certificate */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border-2 border-blue-200">
            <div className="px-4 py-8 sm:p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Certificate of Impact</h2>
              
              <div className="max-w-lg mx-auto p-8 border-2 border-blue-100 rounded-lg">
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
              </div>
              
              <div className="mt-8">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
