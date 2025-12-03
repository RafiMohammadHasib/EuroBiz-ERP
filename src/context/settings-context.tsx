
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { companyDetails as initialCompanyDetails } from '@/lib/data';

type Currency = 'BDT' | 'USD';

type BusinessSettings = {
    name: string;
    address: string;
    email: string;
    phone: string;
    logoUrl: string;
    currency?: Currency;
};

interface SettingsContextType {
  currency: Currency;
  currencySymbol: string;
  setCurrency: (currency: Currency) => void;
  businessSettings: BusinessSettings;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('BDT');
  const firestore = useFirestore();
  const { user } = useUser(); // Get the user status

  const settingsDocRef = useMemoFirebase(() => {
    if (firestore && user) {
      return doc(firestore, 'settings', 'business');
    }
    return null;
  }, [firestore, user]);

  const { data: settingsData } = useDoc<BusinessSettings>(settingsDocRef);
  
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(initialCompanyDetails);

  useEffect(() => {
    if (settingsData) {
        setBusinessSettings(settingsData);
        if (settingsData.currency) {
            setCurrency(settingsData.currency);
        }
    }
  }, [settingsData]);

  const currencySymbol = currency === 'USD' ? '$' : '৳';

  const value = {
    currency,
    currencySymbol,
    setCurrency,
    businessSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
