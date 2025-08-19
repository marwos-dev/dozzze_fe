'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import en from './en';
import es from './es';

export type Lang = 'en' | 'es';
const resources = { en, es } as const;

type Context = {
  lang: Lang;
  t: (key: string) => string;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<Context | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() =>
    (typeof window !== 'undefined' && (localStorage.getItem('lang') as Lang)) || 'es'
  );
  const t = (key: string): string => {
    const result = key
      .split('.')
      .reduce<unknown>((obj, k) => {
        if (typeof obj === 'object' && obj !== null) {
          return (obj as Record<string, unknown>)[k];
        }
        return undefined;
      }, resources[lang] as Record<string, unknown>);
    return typeof result === 'string' ? result : key;
  };
  const changeLang = (l: Lang) => {
    setLang(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', l);
    }
  };
  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
