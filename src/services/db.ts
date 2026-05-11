import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const dbService = {
  async get<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? (snapshot.data() as T) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${collectionName}/${id}`);
      return null;
    }
  },

  async list<T>(collectionName: string, constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const collRef = collection(db, collectionName);
      const q = query(collRef, ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, collectionName);
      return [];
    }
  },

  async set<T extends DocumentData>(collectionName: string, id: string, data: T): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, { ...data, updatedAt: Date.now() });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${id}`);
    }
  },

  async update(collectionName: string, id: string, data: Partial<DocumentData>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, { ...data, updatedAt: Date.now() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${id}`);
    }
  },

  subscribe<T>(collectionName: string, id: string, onUpdate: (data: T | null) => void) {
    const docRef = doc(db, collectionName, id);
    return onSnapshot(docRef, 
      (snapshot) => onUpdate(snapshot.exists() ? (snapshot.data() as T) : null),
      (error) => handleFirestoreError(error, OperationType.GET, `${collectionName}/${id}`)
    );
  },

  subscribeCollection<T>(collectionName: string, constraints: QueryConstraint[], onUpdate: (data: T[]) => void) {
    const collRef = collection(db, collectionName);
    const q = query(collRef, ...constraints);
    return onSnapshot(q,
      (snapshot) => onUpdate(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))),
      (error) => handleFirestoreError(error, OperationType.LIST, collectionName)
    );
  }
};
