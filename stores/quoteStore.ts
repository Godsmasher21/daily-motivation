import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Quote {
  id: number;
  text: string;
  author: string;
  category: string;
  isFavorite: boolean;
}

interface QuoteStore {
  dailyQuote: Quote | null;
  favorites: Quote[];
  categories: string[];
  notificationTime: string;
  setNotificationTime: (time: string) => void;
  toggleFavorite: (id: number) => void;
  shareQuote: (quote: Quote) => void;
  loadDailyQuote: () => void;
  loadFavorites: () => void;
}

const initialQuotes = [
  {
    id: 1,
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'Success',
    isFavorite: false,
  },
  {
    id: 2,
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    category: 'Perseverance',
    isFavorite: false,
  },
  {
    id: 3,
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    category: 'Growth',
    isFavorite: false,
  },
  {
    id: 4,
    text: 'Leadership is not about being the best. Leadership is about making everyone else better.',
    author: 'Jack Welch',
    category: 'Leadership',
    isFavorite: false,
  },
  {
    id: 5,
    text: 'Happiness is not something ready made. It comes from your own actions.',
    author: 'Dalai Lama',
    category: 'Happiness',
    isFavorite: false,
  },
  {
    id: 6,
    text: 'The best way to predict the future is to create it.',
    author: 'Peter Drucker',
    category: 'Success',
    isFavorite: false,
  },
  {
    id: 7,
    text: 'What you get by achieving your goals is not as important as what you become by achieving your goals.',
    author: 'Zig Ziglar',
    category: 'Growth',
    isFavorite: false,
  },
  {
    id: 8,
    text: 'The mind is everything. What you think you become.',
    author: 'Buddha',
    category: 'Wisdom',
    isFavorite: false,
  },
];

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      dailyQuote: null,
      favorites: [],
      categories: [
        'Success',
        'Happiness',
        'Perseverance',
        'Leadership',
        'Wisdom',
        'Growth',
      ],
      notificationTime: '09:00',

      setNotificationTime: (time: string) => {
        set({ notificationTime: time });
      },

      toggleFavorite: (id: number) => {
        const { dailyQuote, favorites } = get();
        
        if (!dailyQuote) return;
        
        const isFavorite = !dailyQuote.isFavorite;
        
        set({
          dailyQuote: { ...dailyQuote, isFavorite },
          favorites: isFavorite
            ? [...favorites, { ...dailyQuote, isFavorite }]
            : favorites.filter(q => q.id !== id),
        });
      },

      shareQuote: async (quote: Quote) => {
        const text = `"${quote.text}" — ${quote.author}`;
        try {
          await navigator.share({ text });
        } catch (error) {
          console.log('Sharing failed', error);
        }
      },

      loadDailyQuote: () => {
        const remainingQuotes = initialQuotes.filter(quote => 
          !get().favorites.some(fav => fav.id === quote.id)
        );
        
        if (remainingQuotes.length === 0) {
          // Reset if all quotes have been seen
          set({ favorites: [] });
          set({ dailyQuote: initialQuotes[Math.floor(Math.random() * initialQuotes.length)] });
        } else {
          const randomQuote = remainingQuotes[Math.floor(Math.random() * remainingQuotes.length)];
          set({ dailyQuote: randomQuote });
        }
      },

      loadFavorites: () => {
        // Favorites are already persisted
      },
    }),
    {
      name: 'quote-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);