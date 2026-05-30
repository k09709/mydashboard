import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Card } from '../types';
import { auth, db, storage } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import type { User } from 'firebase/auth';

interface DeckContextType {
  cards: Card[];
  addCard: (card: Omit<Card, 'id'> & { id?: string }, rawImageBase64?: string) => Promise<void>;
  updateCard: (id: string, card: Partial<Card>) => Promise<void>;
  deleteCard: (id: string, imageUrl?: string) => Promise<void>;
  clearDeck: () => void;
  importCards: (cards: Card[]) => void;
  loading: boolean;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTagFilter: string | null;
  setActiveTagFilter: (tag: string | null) => void;
  hoveredTag: string | null;
  setHoveredTag: (tag: string | null) => void;
  currentUser: User | null;
}

const DeckContext = createContext<DeckContextType | undefined>(undefined);

export const DeckProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) {
        setCards([]);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Listen to Firestore cards for the current user
  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    const cardsRef = collection(db, 'users', currentUser.uid, 'cards');
    const q = query(cardsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Card[];
      setCards(fetched);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const addCard = async (card: Omit<Card, 'id'> & { id?: string }, rawImageBase64?: string) => {
    if (!currentUser) return;

    let imageUrl: string | undefined = undefined;

    if (rawImageBase64) {
      const imageRef = ref(storage, `users/${currentUser.uid}/images/${crypto.randomUUID()}`);
      await uploadString(imageRef, rawImageBase64, 'data_url');
      imageUrl = await getDownloadURL(imageRef);
    }

    const cardsRef = collection(db, 'users', currentUser.uid, 'cards');
    const { id: _id, ...cardData } = card as Card & { id?: string };
    await addDoc(cardsRef, {
      ...cardData,
      ...(imageUrl ? { imageUrl } : {}),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updateCard = async (id: string, updatedFields: Partial<Card>) => {
    if (!currentUser) return;
    const cardRef = doc(db, 'users', currentUser.uid, 'cards', id);
    await updateDoc(cardRef, { ...updatedFields, updatedAt: serverTimestamp() });
  };

  const deleteCard = async (id: string, imageUrl?: string) => {
    if (!currentUser) return;
    if (imageUrl) {
      try {
        const imgRef = ref(storage, imageUrl);
        await deleteObject(imgRef);
      } catch (_) {
        // Ignore if image doesn't exist
      }
    }
    const cardRef = doc(db, 'users', currentUser.uid, 'cards', id);
    await deleteDoc(cardRef);
  };

  const clearDeck = () => {
    // Not used in cloud mode, kept for compatibility
  };

  const importCards = (_cards: Card[]) => {
    // Not used in cloud mode
  };

  return (
    <DeckContext.Provider value={{
      cards, addCard, updateCard, deleteCard, clearDeck, importCards, loading,
      searchQuery, setSearchQuery,
      activeTagFilter, setActiveTagFilter,
      hoveredTag, setHoveredTag,
      currentUser,
    }}>
      {children}
    </DeckContext.Provider>
  );
};

export const useDeck = () => {
  const context = useContext(DeckContext);
  if (context === undefined) {
    throw new Error('useDeck must be used within a DeckProvider');
  }
  return context;
};
