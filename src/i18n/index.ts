import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import en from './en.json';
import ar from './ar.json';

// ── Types ─────────────────────────────────────────────────────────────────────
export type Lang = 'en' | 'ar';
type Translations = typeof en;

const translations: Record<Lang, Translations> = { en, ar };

// ── Apply RTL / LTR to document ───────────────────────────────────────────────
function applyDir(lang: Lang) {
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
}

// ── Zustand store (persisted) ─────────────────────────────────────────────────
interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (lang) => {
        applyDir(lang);
        set({ lang });
      },
    }),
    { name: 'car4u_lang' }
  )
);

// Apply direction immediately on module load (before first render)
applyDir(
  (() => {
    try {
      const raw = localStorage.getItem('car4u_lang');
      if (raw) return (JSON.parse(raw)?.state?.lang as Lang) ?? 'en';
    } catch {}
    return 'en';
  })()
);

// ── Translation function ──────────────────────────────────────────────────────
export function getLang(): Lang {
  try {
    const raw = localStorage.getItem('car4u_lang');
    if (raw) return (JSON.parse(raw)?.state?.lang as Lang) ?? 'en';
  } catch {}
  return 'en';
}

export function t(key: keyof Translations): string {
  const lang = getLang();
  return (translations[lang] as any)[key] ?? (translations.en as any)[key] ?? key;
}

// ── Hook: re-renders component when language changes ──────────────────────────
export function useT() {
  const { lang } = useLangStore();
  return (key: keyof Translations): string =>
    (translations[lang] as any)[key] ?? (translations.en as any)[key] ?? key;
}
