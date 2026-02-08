import { getLoginTo } from '@/app/login/login';
import { getClass } from '@/services/ApiServices';
import { createContext, useEffect, useState } from 'react';

interface cart {
  countt: number;
  setCountt: (value: number) => void;
}

export const cartCount = createContext<cart | null>(null);

export default function CartCountProvider({ children }: { children: React.ReactNode }) {
  const [countt, setCountt] = useState(0);

  async function getCartCount() {
    const tokens = await getLoginTo();
    const data = await getClass.getCartItems(1, tokens);
    setCountt(data.items.length);
  }

  useEffect(() => {
    getCartCount();
  }, [countt, setCountt]);

  return <cartCount.Provider value={{ countt, setCountt }}>{children}</cartCount.Provider>;
}
