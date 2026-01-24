"use client"
import { authContext } from '@/lib/ContextAPI/authContext';
import { loginSchema } from '@/lib/Schema/schema'
import { getClass } from '@/services/ApiServices'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { ICart } from '../interface/Cart/cart';

export default function Login() {
  const {auth, setAuth, userData, setUserData, token, setToken} = useContext(authContext);
  const router = useRouter();
  

  const {handleSubmit, register, formState:{errors}, reset} = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });
  const cartItems = useSelector((state: any) => state.cart);

  async function login(myData: any){
    const login = await getClass.login(myData);
    console.log('login::: ',login);
    
    const items = {
      "businessTypeId": cartItems.map((item:any) => item.businesstype),
      "productId": cartItems.map((item:any) => item.id),
      "quantity": cartItems.map((item:any) => item.quantity),
      "variantId": null,
      "selectedOptions": cartItems.map((item:any) => item.selectedOptions) ?? [],
    }
    
    if(login.jwt){
      localStorage.setItem('user', JSON.stringify(login.jwt));
      setToken(login.jwt);
      setAuth(true);
      const cart = await getClass.cartAdd(items);
      console.log(cart);
      router.push('/');
    } else {
      setAuth(false);
      setToken(null);
      setUserData(null);
    }
    
  }

  return (
    <div className="container mx-auto my-5">
        <form onSubmit={handleSubmit(login)}>
          <div className="border flex flex-col gap-3 rounded-2xl p-5 w-[70%] mx-auto items-center">
              <h1>Login</h1>
              <input type="email" className='w-[60%] border rounded-2xl p-4 mt-5' placeholder='Enter Your Email Address' {...register("email")} id="" />
              <input type="password" className='w-[60%] border rounded-2xl p-4' placeholder='Enter Your Password' {...register("password")} id="" />
              <button type="submit" className="bg-black text-white p-2 rounded-2xl w-[60%] my-5">Login</button>
          </div>
        </form>
    </div>
  )
}
