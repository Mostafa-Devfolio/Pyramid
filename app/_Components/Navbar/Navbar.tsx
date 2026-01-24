"use client"
import { authContext } from '@/lib/ContextAPI/authContext';
import Link from 'next/link'
import { useContext, useState } from 'react';
import { useSelector } from 'react-redux'

export default function Navbar() {
    const cartItem = useSelector((state: any) => state.cart);
    const [hide, setHide] = useState(false);
    const {auth, setAuth, setToken} = useContext(authContext);

    function logout(){
        setAuth(false);
        localStorage.removeItem("user");
        setToken(null);
    }


  return (
    <div className="border-b-2 border-gray-300 pt-2">
        <div className="container mx-auto flex justify-between items-center m-4">
            <h1 className='cursor-default'>PYRAMIDS</h1>
            <ul className='flex gap-5 bg-black rounded-[40px] text-white p-5 '>
                <li>
                    <Link className='bg-white p-2 rounded-[40px] text-black' href={'/'}>Home</Link>
                </li>
                <li>
                    <Link href={'/about'}>About</Link>
                </li>
                <li>
                    <Link href={'/contact-us'}>Contact US</Link>
                </li>
            </ul>
            <div className='flex gap-7 items-center'>
                <Link href={'/cart'}>
                    <div className='flex gap-10 items-center'>
                        <div className='relative'>
                            <h2 className='counter'><i className="fa-solid fa-cart-shopping"></i></h2>
                            <div className="absolute bg-red-600 w-[22px] h-[22px] rounded-2xl top-[-5px] right-[-10px] text-white flex justify-center items-center">{cartItem.length}</div>
                        </div>
                    </div>
                </Link>
                <div className="relative">
                        <h2 onClick={() => setHide(!hide)}><i className="fa-solid fa-user"></i></h2>
                        {auth ? <div className={`flex flex-col gap-3 absolute z-1000 top-10 right-0 bg-gray-50 p-5 pr-15 rounded-2xl rounded-tl-none ${hide ? '' : 'hidden'}`}>
                            <Link href={'/settings'} onClick={() => setHide(false)}><h4 className='cursor-pointer'>Settings</h4></Link>
                            <h4 className='cursor-pointer' onClick={() => {setHide(false); logout()}}>Logout</h4>
                        </div> : <div className={`flex flex-col gap-3 absolute z-1000 top-10 right-0 bg-gray-50 p-5 pr-15 rounded-2xl rounded-tl-none ${hide ? '' : 'hidden'}`}>
                            <Link onClick={() => setHide(false)} className='hover:text-green-600' href={'/login'}><h4>Login</h4></Link>
                            <Link onClick={() => setHide(false)} className='hover:text-green-600' href={'/register'}><h4>Signup</h4></Link>
                        </div>}
                    </div>
            </div>
            {/* <Button onClick={() => dispatch(decreaseOne())}>-</Button>
            <Button onClick={() => dispatch(increase(20))}>+</Button>
            <Button onClick={() => dispatch(increaseOne())}>+</Button> */}
        </div>
    </div>
  )
}
