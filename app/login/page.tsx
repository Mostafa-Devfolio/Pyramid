'use client';
import { authContext } from '@/lib/ContextAPI/authContext';
import { loginSchema } from '@/lib/Schema/schema';
import { getClass } from '@/services/ApiServices';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { ICart } from '../interface/Cart/cart';
import { loginTo } from './login';

export default function Login() {
  const { auth, setAuth, userData, setUserData, setToken, token } = useContext(authContext);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });
  const cartItems = useSelector((state: any) => state.cart);

  async function login(myData: any) {
    const login = await getClass.login(myData);

    const items = {
      businessTypeId: cartItems.map((item: any) => item.businesstype),
      productId: cartItems.map((item: any) => item.id),
      quantity: cartItems.map((item: any) => item.quantity),
      variantId: null,
      selectedOptions: cartItems.map((item: any) => item.selectedOptions) ?? [],
    };

    if (login.jwt) {
      // localStorage.setItem('user', JSON.stringify(login.jwt));
      loginTo(login.jwt);
      setToken(login.jwt);
      setAuth(true);
      const cart = await getClass.cartAdd(items, token);
      console.log(cart);
      router.push('/');
      console.log('good');
    } else {
      setAuth(false);
      setToken(null);
      setUserData(null);
      console.log('I will not login');
    }
  }

  return (
    <div className="container mx-auto my-5">
      <form onSubmit={handleSubmit(login)}>
        <div className="mx-auto flex w-[70%] flex-col items-center gap-3 rounded-2xl border p-5">
          <h1>Login</h1>
          <input
            type="email"
            className="mt-5 w-[60%] rounded-2xl border p-4"
            placeholder="Enter Your Email Address"
            {...register('email')}
            id=""
          />
          <input
            type="password"
            className="w-[60%] rounded-2xl border p-4"
            placeholder="Enter Your Password"
            {...register('password')}
            id=""
          />
          <button type="submit" className="my-5 w-[60%] cursor-pointer rounded-2xl bg-black p-2 text-white">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
