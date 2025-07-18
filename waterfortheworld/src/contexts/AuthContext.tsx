'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase/init';
import { getUserDoc, createUserDoc, updateUserDoc } from '@/lib/firebase/utils';
import type { UserData } from '@/lib/firebase/config';

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;
  updateDropletCount: (newCount: number) => Promise<void>;
  updateQuizStats: (isCorrect: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Create or update user data in Firestore
  const createUserDocument = async (user: User, displayName: string) => {
    if (!auth.currentUser) return;
    
    let userData = await getUserDoc(db, user.uid);
    
    if (!userData) {
      userData = await createUserDoc(db, user.uid, {
        email: user.email || '',
        displayName: displayName || user.displayName || '',
        photoURL: user.photoURL || '',
        dropletCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    if (userData) {
      setUserData(userData);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    await createUserDocument(userCredential.user, displayName);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserData(null);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (updates: { displayName?: string; photoURL?: string }) => {
    if (!auth.currentUser) return;

    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, updates);
      
      // Update Firestore user document
      await updateUserDoc(db, auth.currentUser.uid, updates);
      
      // Update local state
      setUserData(prev => ({
        ...prev!,
        ...updates,
      }));
      
      // Refresh current user
      setCurrentUser({ ...auth.currentUser });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updateDropletCount = async (newCount: number) => {
    if (!auth.currentUser) return;
    
    await updateUserDoc(db, auth.currentUser.uid, {
      dropletCount: newCount,
    });
    
    setUserData(prev => ({
      ...prev!,
      dropletCount: newCount,
    }));
  };

  const updateQuizStats = async (isCorrect: boolean) => {
    if (!auth.currentUser) return;

    const currentStats = userData?.quizStats || {
      correctAnswers: 0,
      incorrectAnswers: 0,
      lastUpdated: new Date(),
    };

    const updatedStats = {
      correctAnswers: isCorrect 
        ? (currentStats.correctAnswers || 0) + 1 
        : (currentStats.correctAnswers || 0),
      incorrectAnswers: !isCorrect 
        ? (currentStats.incorrectAnswers || 0) + 1 
        : (currentStats.incorrectAnswers || 0),
      lastUpdated: new Date(),
    };

    await updateUserDoc(db, auth.currentUser.uid, {
      quizStats: updatedStats,
    });
    
    setUserData(prev => ({
      ...prev!,
      quizStats: updatedStats,
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Try to get user data
          const userData = await getUserDoc(db, user.uid);
          
          if (userData) {
            setUserData(userData);
          } else if (user.displayName || user.email) {
            // Create user document if it doesn't exist
            await createUserDocument(user, user.displayName || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUserProfile,
    updateDropletCount,
    updateQuizStats,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
