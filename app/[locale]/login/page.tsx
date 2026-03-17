'use client';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { loginSchema } from '@/lib/Schema/schema';
import { getClass } from '@/services/ApiServices';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { loginTo } from './login';
import { baseURL2 } from '../page';
import Link from 'next/link';
import { LogIn, Mail, Lock, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface login {
  email: string;
  password: string;
}

export default function Login() {
  const t = useTranslations("PRISM");
  const { setAuth, setUserData, setToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });

  const cartItems = useSelector((state: any) => state.cart);

  async function loginUser(myData: login) {
    setIsLoading(true);
    setLoginError('');

    try {
      const loginRes = await getClass.login(myData);

      const items = {
        businessTypeId: cartItems.map((item: any) => item.businesstype),
        productId: cartItems.map((item: any) => item.id),
        quantity: cartItems.map((item: any) => item.quantity),
        variantId: null,
        selectedOptions: cartItems.map((item: any) => item.selectedOptions) ?? [],
      };

      if (loginRes.jwt) {
        loginTo(loginRes.jwt);
        setToken(loginRes.jwt);
        setAuth(true);
        await getClass.cartAdd(items, loginRes.jwt);
        router.push('/');
      } else {
        setAuth(false);
        setToken(null);
        setUserData(null);
        setLoginError('Invalid email or password.');
      }
    } catch (error) {
      setLoginError('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass =
    'w-full h-14 rounded-2xl border-transparent bg-slate-50 px-5 font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 font-sans selection:bg-blue-500 selection:text-white sm:px-6 lg:px-8">
      <div className="animate-in fade-in zoom-in-95 w-full max-w-md rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-2xl shadow-slate-200/50 duration-500 sm:p-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30">
            <LogIn size={32} className="ml-1" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">{t('welcome_back')}</h1>
          <p className="mt-3 text-sm font-medium text-slate-500">{t('signin_to')}</p>
        </div>

        {/* OAuth Providers */}
        <div className="mb-8 flex flex-col gap-3">
          <a href={`${baseURL2}connect/google`} className="w-full">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t('signin_google')}
            </button>
          </a>

          <a href={`${baseURL2}connect/github`} className="w-full">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                  fill="#24292e"
                />
              </svg>
              {t('signin_github')}
            </button>
          </a>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 font-bold tracking-widest text-slate-400 uppercase">
              {t('signin_email')}
            </span>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(loginUser)}>
          <div className="space-y-2">
            <label className="pl-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              {t('email')}
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="john@example.com"
                className={`${inputClass} pl-11`}
                {...register('email')}
              />
            </div>
            {errors.email?.message && (
              <p className="pl-1 text-[10px] font-bold text-red-500">{errors.email.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between pl-1">
              <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{t('password')}</label>
              <Link
                href="#"
                className="text-[10px] font-black tracking-widest text-blue-600 uppercase transition-colors hover:text-blue-700"
              >
                {t('forgot')}
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className={`${inputClass} pl-11`}
                {...register('password')}
              />
            </div>
            {errors.password?.message && (
              <p className="pl-1 text-[10px] font-bold text-red-500">{errors.password.message as string}</p>
            )}
          </div>

          <div className="space-y-4 pt-4">
            {loginError && (
              <div className="animate-in slide-in-from-bottom-2 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
                <AlertTriangle size={18} className="shrink-0" />
                <p>{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-5 text-lg font-black text-white shadow-xl shadow-slate-900/20 transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> {t('authenticating')}
                </>
              ) : (
                <>
                  {t('signin')} <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-slate-500">
            {t('dont_have_account')}{' '}
            <Link
              href="/register"
              className="font-black text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
              {t('signup')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
