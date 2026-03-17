'use client';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface business {
  businessId: number | null;
  setBusinessId: (value: number | null) => void;
  businessSlug: string | null;
  setBusinessSlug: (value: string | null) => void;
}
export const businessContext = createContext<business | null>(null);

export function useBusiness() {
  const context = useContext(businessContext);
  if (!context) {
    throw new Error('useBusiness must be used within BusinessContextProvider');
  }
  return context;
}

export function BusinessContextProvider({ children }: { children: React.ReactNode }) {
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [businessSlug, setBusinessSlug] = useState<string | null>(null);
  const pathName = usePathname();
  const segment = pathName.split('/').filter(Boolean);
  const mainPath = segment[1];

  useEffect(() => {
    console.log('Main Path',mainPath)
    function isOnPath() {
      if (mainPath == 'restaurants') {
        setBusinessId(1);
        setBusinessSlug('restaurants');
      } else if (mainPath == 'groceries') {
        setBusinessId(2);
        setBusinessSlug('groceries');
      } else if (mainPath == 'pharmacies') {
        setBusinessId(3);
        setBusinessSlug('pharmacies');
      } else if (mainPath == 'e-commerce') {
        setBusinessId(4);
        setBusinessSlug('e-commerce');
      }
    }
    isOnPath();
  }, [businessId, setBusinessId, businessSlug, setBusinessSlug]);

  return <businessContext.Provider value={{ businessId, setBusinessId, businessSlug, setBusinessSlug }}>{children}</businessContext.Provider>;
}
