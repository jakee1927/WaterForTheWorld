import { doc, getDoc, setDoc, updateDoc, Firestore } from 'firebase/firestore';
import { UserData } from './config';

export const getUserDoc = async (db: Firestore, userId: string) => {
  if (!db) return null;
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? (userSnap.data() as UserData) : null;
};

export const createUserDoc = async (db: Firestore, userId: string, data: Omit<UserData, 'uid'>) => {
  if (!db) return null;
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, { ...data, uid: userId });
  return { ...data, uid: userId } as UserData;
};

export const updateUserDoc = async (db: Firestore, userId: string, updates: Partial<UserData>) => {
  if (!db) return null;
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { ...updates, updatedAt: new Date() });
  return true;
};
