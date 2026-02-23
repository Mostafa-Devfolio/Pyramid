'use client';
import { IUser } from '@/app/interface/userData';
import { getLoginTo } from '@/app/login/login';
import { getClass } from '@/services/ApiServices';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContext {
  auth: boolean;
  userData: IUser | null;
  setAuth: (value: boolean) => void;
  setUserData: (value: IUser|null) => void;
  token: string|null;
  setToken: (value: string|null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const authContext = createContext<AuthContext | null>(null);

export function useAuth() {
  const context = useContext(authContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthContextProvider');
  }
  return context;
}

export default function AuthContextProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<IUser | null>(null);
  const [token, setToken] = useState<string|null>(null);
  const [auth, setAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loginOk() {
      const isOk = await getLoginTo();
      if (isOk) {
        setToken(isOk);
        setAuth(true);
        const user = await getClass.userProfile(isOk);
        setUserData(user);
        setIsLoading(false);
      } else {
        setAuth(false);
        setUserData(null);
        setIsLoading(true);
        setToken(null);
      }
    }
    loginOk();
  }, []);

  return (
    <authContext.Provider value={{ auth, userData, setAuth, setUserData, token, setToken, setIsLoading, isLoading }}>
      {children}
    </authContext.Provider>
  );
}
