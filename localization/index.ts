
import { en } from './en';
import { fr } from './fr';
import { Translation } from './types';
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'fr';

interface LocalizationContextType {
  t: Translation;
  lang: Language;
  setLang: (lang: Language) => void;
}

const LocalizationContext = createContext<LocalizationContextType | null>(null);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('fr');

  const t = lang === 'fr' ? fr : en;

  return React.createElement(
    LocalizationContext.Provider,
    { value: { t, lang, setLang } },
    children
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within a LocalizationProvider");
  }
  return context;
};
