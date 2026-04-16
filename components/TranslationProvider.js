'use client';

import { createContext, useContext } from 'react';

const TranslationContext = createContext({});

export default function TranslationProvider({ dict, children }) {
  return (
    <TranslationContext.Provider value={dict}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
