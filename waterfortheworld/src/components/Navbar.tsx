'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Droplets, User, X, Edit, Image as ImageIcon, X as XIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser, userData, signOut, updateUserProfile } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (userData?.displayName) {
      setDisplayName(userData.displayName);
    }
    if (userData?.photoURL) {
      setPreviewUrl(userData.photoURL);
    }
  }, [userData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size should be less than 2MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    try {
      const updates: { displayName?: string; photoURL?: string } = {};
      
      if (displayName && displayName !== userData?.displayName) {
        updates.displayName = displayName;
      }

      if (selectedFile) {
        // In a real app, you would upload the file to a storage service here
        // For now, we'll just use a placeholder URL
        updates.photoURL = previewUrl || '';
      }

      if (Object.keys(updates).length > 0) {
        await updateUserProfile(updates);
        toast.success('Profile updated successfully');
      }
      
      setIsEditModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Don't show navbar on auth pages
  if (pathname.startsWith('/auth')) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex
          ">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Droplets className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">WaterForTheWorld</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`${
                  pathname === '/'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Home
              </Link>
              <Link
                href="/quizzes"
                className={`${
                  pathname.startsWith('/quizzes')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Quizzes
              </Link>
              <Link
                href="/donate"
                className={`${
                  pathname.startsWith('/donate')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Donate
              </Link>
              <Link
                href="/tutors"
                className={`${
                  pathname.startsWith('/tutors')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Free Tutor
              </Link>
              {currentUser && (
                <Link
                  href="/dashboard"
                  className={`${
                    pathname.startsWith('/dashboard')
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center hover:bg-gray-100 rounded-full p-1"
                >
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt={userData?.displayName || 'User'}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  <span className="ml-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                    {userData?.displayName || 'User'}
                  </span>
                </button>
                <div className="flex items-center border-l border-gray-200 pl-2">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-1 text-gray-500 hover:text-blue-600"
                    title="Edit profile"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="ml-2 p-1 text-gray-500 hover:text-blue-600"
                    title="Sign out"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`${
              pathname === '/'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/quizzes"
            className={`${
              pathname.startsWith('/quizzes')
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Quizzes
          </Link>
          <Link
            href="/donate"
            className={`${
              pathname.startsWith('/donate')
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Donate
          </Link>
          <Link
            href="/tutors"
            className={`${
              pathname.startsWith('/tutors')
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Free Tutor
          </Link>
          {currentUser ? (
            <>
              <Link
                href="/dashboard"
                className={`${
                  pathname.startsWith('/dashboard')
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="border-t border-gray-200 my-2"></div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsEditModalOpen(true);
                }}
                className="w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
              <button
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 flex items-center"
              >
                <XIcon className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </>
          ) : (
            <div className="mt-3 space-y-1">
              <Link
                href="/auth/signin"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {currentUser ? (
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-blue-100">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {userData?.displayName || 'User'}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {userData?.email}
                </div>
              </div>
              <button
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Sign out</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="mt-3 space-y-1">
              <Link
                href="/auth/signin"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedFile(null);
                  setPreviewUrl(userData?.photoURL || null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-full bg-gray-100 overflow-hidden">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-blue-100">
                        <User className="h-12 w-12 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors"
                    title="Change photo"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Click the icon to upload a new photo (max 2MB)</p>
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedFile(null);
                    setPreviewUrl(userData?.photoURL || null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={!displayName.trim()}
                  className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    !displayName.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
