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


  const updateUserProfile = async (updates: { displayName?: string }) => {
    if (!auth.currentUser) {
      console.error('No authenticated user');
      return;
    }

    try {
      console.log('Starting profile update with:', updates);
      const updatesToSave: { displayName?: string } = {};
      
      // Handle display name update
      if ('displayName' in updates) {
        updatesToSave.displayName = updates.displayName;
        console.log('Display name update prepared:', updatesToSave.displayName);
      }

      // Update Firebase Auth profile
      if (updatesToSave.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: updatesToSave.displayName
        });
        console.log('Firebase Auth profile updated');
      }
      
      // Update Firestore
      if (Object.keys(updatesToSave).length > 0) {
        const userUpdate = {
          ...updatesToSave,
          updatedAt: new Date()
        };
        console.log('Updating Firestore with:', userUpdate);
        await updateUserDoc(db, auth.currentUser.uid, userUpdate);
        console.log('Firestore updated');
      }
      
      // Update local state
      if (Object.keys(updatesToSave).length > 0 && userData) {
        const newUserData: UserData = {
          ...userData,
          ...updatesToSave,
          uid: userData.uid,
          email: userData.email,
          displayName: updatesToSave.displayName || userData.displayName,
          dropletCount: userData.dropletCount,
          createdAt: userData.createdAt,
          updatedAt: new Date()
        };
        console.log('Updating local state with:', newUserData);
        setUserData(newUserData);
        setCurrentUser({ ...auth.currentUser });
      }
      
      console.log('Profile update completed successfully');
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
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
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      
      if (user) {
        try {
          // Get user data from Firestore
          const userDoc = await getUserDoc(db, user.uid);
          
          if (userDoc) {
            // Ensure we have the latest photoURL from Auth
            if (user.photoURL && userDoc.photoURL !== user.photoURL) {
              // Update Firestore with the latest photoURL from Auth
              await updateUserDoc(db, user.uid, { 
                photoURL: user.photoURL,
                updatedAt: new Date()
              });
              
              if (isMounted) {
                setUserData({
                  ...userDoc,
                  photoURL: user.photoURL,
                  updatedAt: new Date()
                });
              }
            } else if (isMounted) {
              setUserData(userDoc);
            }
            
            // Ensure Auth has the latest photoURL from Firestore if it's more recent
            if (userDoc.photoURL && user.photoURL !== userDoc.photoURL) {
              await updateProfile(user, { photoURL: userDoc.photoURL });
              if (isMounted) {
                setCurrentUser({ ...user, photoURL: userDoc.photoURL });
              }
            }
          } else if (user.displayName || user.email) {
            // Create user document if it doesn't exist
            await createUserDocument(user, user.displayName || '');
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
        }
      } else if (isMounted) {
        setUserData(null);
      }
      
      if (isMounted) {
        setCurrentUser(user);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
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
