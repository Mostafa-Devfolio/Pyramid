'use client';
import { getLoginTo, getLogout, loginTo } from '@/app/login/login';
import { authContext } from '@/lib/ContextAPI/authContext';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { Spinner } from '@heroui/react';

export default function Callback() {
  const searchParams = useSearchParams();
  const jwt = searchParams.get('jwt');
  const { setToken, setAuth } = useContext(authContext);
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(true);

  useEffect(() => {
    const handleLogin = async () => {
      if (jwt) {
        await loginTo(jwt);
        const tokenn = await getLoginTo();
        setToken(tokenn);
        setAuth(true);
        setIsAuth(true);
        router.push('/');
      } else {
        getLogout();
        setIsAuth(false);
        setToken(null);
        setAuth(false);
        router.push('/');
      }
    };
    handleLogin();
  }, []);

  return (
    <div className="my-5 flex items-center justify-center text-center">
      {isAuth ? (
        <h1 className="flex items-center gap-3 text-green-700">
          Authenticating <Spinner classNames={{ label: 'text-foreground mt-4' }} variant="dots" />
        </h1>
      ) : (
        <h1 className="text-red-600">Failed to login</h1>
      )}
    </div>
  );
}
