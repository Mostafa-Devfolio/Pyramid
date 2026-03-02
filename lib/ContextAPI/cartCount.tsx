import { getLoginTo } from '@/app/login/login';
import { getClass } from '@/services/ApiServices';
import { createContext, useContext, useEffect, useState } from 'react';
import { useBusiness } from './businessTypeId';

interface cart {
  countt: number;
  setCountt: (value: number) => void;
}

export function useCartCount() {
  const context = useContext(cartCount);
  if (!context) {
    throw new Error('useCartCount must be used inside CartCountProvider');
  }
  return context;
}

export const cartCount = createContext<cart | null>(null);

export default function CartCountProvider({ children }: { children: React.ReactNode }) {
  const [countt, setCountt] = useState(0);
  const { businessId } = useBusiness();

  useEffect(() => {
    async function getCartCount() {
      if(businessId===null) return;
      const tokens = await getLoginTo();
      const data = await getClass.getCartItems(businessId, tokens);
      setCountt(data.items.length);
    }
    getCartCount();
  }, [countt, setCountt,businessId]);

  return <cartCount.Provider value={{ countt, setCountt }}>{children}</cartCount.Provider>;
}
