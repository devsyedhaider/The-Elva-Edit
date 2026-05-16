import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

interface HeroContent {
  seasonText: string;
  accentTitle: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  buttonText: string;
}

interface HeroStore {
  hero: HeroContent;
  isLoading: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  fetchHero: () => Promise<void>;
  updateHero: (content: Partial<HeroContent>) => Promise<void>;
}

const defaultHero: HeroContent = {
  seasonText: 'New Arrivals 2026',
  accentTitle: 'REDEFINED.',
  title: 'ELEGANCE',
  subtitle: 'Handcrafted jewelry from Pakistan — where timeless artistry meets modern luxury. Discover exclusive collections designed for elegance.',
  backgroundImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=100&w=2560&auto=format&fit=crop',
  buttonText: 'SHOP COLLECTION',
};

export const useHeroStore = create<HeroStore>()(
  persist(
    (set) => ({
      hero: defaultHero,
      isLoading: false,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      fetchHero: async () => {
        if (!supabase) return;
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('hero_settings')
            .select('*')
            .single();

          if (error && error.code !== 'PGRST116') throw error;
          
          if (data) {
            const mappedHero = {
              ...data,
              backgroundImage: data.background_image,
              buttonText: data.button_text,
              accentTitle: data.accent_title,
              seasonText: data.season_text,
            };
            set({ hero: mappedHero });
          }
        } catch (error) {
          console.warn('📡 Fetching hero data skipped or failed. Using defaults.');
        } finally {
          set({ isLoading: false });
        }
      },

      updateHero: async (content) => {
        // Update local state immediately for a fast feel
        set((state) => ({
          hero: { ...state.hero, ...content },
        }));

        try {
          if (supabase) {
            const dbUpdate: any = { ...content };
            if (content.backgroundImage) { dbUpdate.background_image = content.backgroundImage; delete dbUpdate.backgroundImage; }
            if (content.buttonText) { dbUpdate.button_text = content.buttonText; delete dbUpdate.buttonText; }
            if (content.accentTitle) { dbUpdate.accent_title = content.accentTitle; delete dbUpdate.accentTitle; }
            if (content.seasonText) { dbUpdate.season_text = content.seasonText; delete dbUpdate.seasonText; }

            const { error } = await supabase
              .from('hero_settings')
              .upsert({ id: 1, ...dbUpdate });
            
            if (error) throw error;
          }
        } catch (error) {
          console.warn('📡 Cloud sync for hero failed. Changes saved locally only.');
        }
      },
    }),
    {
      name: 'hero-storage',
      version: 4, // Bump version to force refresh
      storage: createJSONStorage(() => indexedDBStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
