'use client';

import { createContext, useContext, useEffect, useState, useRef, useCallback, ReactNode } from 'react';
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
        photoURL: user.photoURL || null,
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

  const updateUserProfile = async (updates: { displayName?: string; photoURL?: string | File | null }) => {
    if (!auth.currentUser) return;

    try {
      // Create a copy of updates to avoid mutation
      const updatesToSave: { displayName?: string; photoURL?: string | null } = {};
      
      // Copy displayName if provided
      if ('displayName' in updates) {
        updatesToSave.displayName = updates.displayName;
      }
      
      // Handle profile picture update if provided
      if ('photoURL' in updates) {
        if (updates.photoURL === null) {
          // Handle photo removal
          updatesToSave.photoURL = null;
        } else if (updates.photoURL instanceof File) {
          // If it's a File object, upload it to Firebase Storage
          try {
            // Import storage functions only when needed
            const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
            const storage = getStorage();
            
            // Create a reference to the file in Firebase Storage
            const fileRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
            
            // Upload the file
            await uploadBytes(fileRef, updates.photoURL);
            
            // Get the download URL
            const downloadURL = await getDownloadURL(fileRef);
            
            // Update the photoURL with the download URL
            updatesToSave.photoURL = downloadURL;
          } catch (error) {
            console.error('Error uploading profile picture:', error);
            throw new Error('Failed to upload profile picture');
          }
        } else if (typeof updates.photoURL === 'string') {
          if (updates.photoURL.startsWith('http') || updates.photoURL === '') {
            // If it's already a URL or empty string, use it as is
            updatesToSave.photoURL = updates.photoURL || null;
          } else {
            // If it's a base64 string or data URL, log a warning
            console.warn('Base64 or data URL detected. Consider using file upload for better performance.');
            updatesToSave.photoURL = updates.photoURL;
          }
        }
      }

      // Update Firebase Auth profile with the processed updates
      await updateProfile(auth.currentUser, {
        displayName: updatesToSave.displayName || null,
        photoURL: updatesToSave.photoURL || null
      });
      
      // Update Firestore user document with the processed updates
      if (Object.keys(updatesToSave).length > 0) {
        await updateUserDoc(db, auth.currentUser.uid, updatesToSave);
      }
      
      // Update local state with the processed updates
      setUserData(prev => ({
        ...prev!,
        ...updatesToSave,
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

  // Use a ref to track pending stats updates
  const pendingStatsUpdates = useRef<{correct: number, incorrect: number}>({correct: 0, incorrect: 0});
  const lastUpdateTime = useRef<number>(0);
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);

  // Function to flush pending stats to Firestore
  const flushQuizStats = useCallback(async () => {
    if (!auth.currentUser || (pendingStatsUpdates.current.correct === 0 && pendingStatsUpdates.current.incorrect === 0)) {
      return;
    }

    const updates = {...pendingStatsUpdates.current};
    pendingStatsUpdates.current = {correct: 0, incorrect: 0};
    lastUpdateTime.current = Date.now();

    // Get current stats
    const currentStats = userData?.quizStats || {
      correctAnswers: 0,
      incorrectAnswers: 0,
      lastUpdated: new Date(),
    };

    // Calculate new stats
    const updatedStats = {
      correctAnswers: (currentStats.correctAnswers || 0) + updates.correct,
      incorrectAnswers: (currentStats.incorrectAnswers || 0) + updates.incorrect,
      lastUpdated: new Date(),
    };

    // Update Firestore
    try {
      await updateUserDoc(db, auth.currentUser.uid, {
        quizStats: updatedStats,
      });
      
      // Update local state
      setUserData(prev => ({
        ...prev!,
        quizStats: updatedStats,
      }));
    } catch (error) {
      // If update fails, add the updates back to the queue
      console.error('Failed to update quiz stats:', error);
      pendingStatsUpdates.current.correct += updates.correct;
      pendingStatsUpdates.current.incorrect += updates.incorrect;
    }
  }, [userData]);

  // Schedule periodic flushes
  useEffect(() => {
    const flushInterval = setInterval(flushQuizStats, 30000); // Flush every 30 seconds
    return () => clearInterval(flushInterval);
  }, [flushQuizStats]);

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
      flushQuizStats();
    };
  }, [flushQuizStats]);

  const updateQuizStats = useCallback(async (isCorrect: boolean) => {
    if (!auth.currentUser) return;

    // Update local refs immediately for responsive UI
    if (isCorrect) {
      pendingStatsUpdates.current.correct++;
    } else {
      pendingStatsUpdates.current.incorrect++;
    }

    // Update local state for immediate UI feedback
    setUserData(prev => {
      if (!prev) return prev;
      const currentStats = prev.quizStats || { correctAnswers: 0, incorrectAnswers: 0 };
      return {
        ...prev,
        quizStats: {
          ...currentStats,
          correctAnswers: isCorrect 
            ? (currentStats.correctAnswers || 0) + 1 
            : (currentStats.correctAnswers || 0),
          incorrectAnswers: !isCorrect 
            ? (currentStats.incorrectAnswers || 0) + 1 
            : (currentStats.incorrectAnswers || 0),
          lastUpdated: new Date(),
        }
      };
    });

    // Schedule a delayed flush if not already scheduled
    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }

    // Flush if we've reached a threshold or after 5 seconds of inactivity
    const shouldFlushNow = 
      pendingStatsUpdates.current.correct + pendingStatsUpdates.current.incorrect >= 10 ||
      Date.now() - lastUpdateTime.current > 5000;

    if (shouldFlushNow) {
      flushQuizStats();
    } else {
      updateTimeout.current = setTimeout(flushQuizStats, 5000);
    }
  }, [flushQuizStats, userData]);

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
