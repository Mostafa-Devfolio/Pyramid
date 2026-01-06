"use client"
import Link from 'next/link'
import { useSelector } from 'react-redux'

export default function Navbar() {
    const cartItem = useSelector((state: any) => state.cart);
    
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
            <Link href={'/cart'}>
                <div className='relative'>
                    <h2 className='counter'><i className="fa-solid fa-cart-shopping"></i></h2>
                    <div className="absolute bg-red-600 w-[22px] h-[22px] rounded-2xl top-[-5px] right-[-10px] text-white flex justify-center items-center">{cartItem.length}</div>
                </div>
            </Link>
            {/* <Button onClick={() => dispatch(decreaseOne())}>-</Button>
            <Button onClick={() => dispatch(increase(20))}>+</Button>
            <Button onClick={() => dispatch(increaseOne())}>+</Button> */}
        </div>
    </div>
  )
}
