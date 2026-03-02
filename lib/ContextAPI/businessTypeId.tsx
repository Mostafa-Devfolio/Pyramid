'use client';
import { usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";


interface business {
    businessId: number | null,
    setBusinessId: (value: number | null) => void
}
export const businessContext = createContext<business|null>(null);

export function useBusiness() {
  const context = useContext(businessContext);
  if (!context) {
    throw new Error('useBusiness must be used within BusinessContextProvider');
  }
  return context;
}

export function BusinessContextProvider({ children }: {children: React.ReactNode}) {
    const [businessId, setBusinessId] = useState<number|null>(null);
    const pathName = usePathname();
    const segment = pathName.split("/").filter(Boolean);
    const mainPath = segment[0];


    useEffect(() => {
      function isOnPath() {
        if(mainPath == 'restaurants'){
          setBusinessId(1);
        }
        else if(mainPath == 'groceries'){
          setBusinessId(2);
        }
        else if(mainPath == 'pharmacies'){
          setBusinessId(3);
        }
        else if(mainPath == 'e-commerce'){
          setBusinessId(4);
        }
      }
      isOnPath();
    },[businessId, setBusinessId]);

    return <businessContext.Provider value={{ businessId, setBusinessId}}>
        {children}
    </businessContext.Provider>
}