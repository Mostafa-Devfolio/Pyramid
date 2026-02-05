"use client";
import { Button } from '@/components/ui/button';
import { getClass } from '@/services/ApiServices'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { showToast } from "nextjs-toast-notify";
import { authContext } from '@/lib/ContextAPI/authContext';
import { getLoginTo } from '../login/login';

export default function CheckoutPage() {
    const [address, setAddress] = useState([]);
    const [payment, setPayment] = useState("cod")
    const router = useRouter();
    const {auth, token} = useContext(authContext);

    async function checkout(){
        console.log(address[0].id);
        console.log(payment);
        
        const body = {
            addressId: address[0].id,
            paymentMethod: payment,
            businessTypeId: 1,
        };
        const data = await getClass.checkout(body, token);
        setTimeout(() => {
            showToast.success("The order is placed successfully!", {
                duration: 4000,
                progress: true,
                position: "top-right",
                transition: "bounceIn",
                icon: '',
                sound: true,
            });
            router.push('/orders')
        },200)
        console.log(data);
    }

    async function getAddress(){
        const tokens = await getLoginTo();
        const data = await getClass.getAddress(tokens);
        setAddress(data);
    }

    useEffect(() => {
        if(!auth){
            router.push('/login')
        }
        getAddress();
    },[auth, address])

    return (
        <div className="my-3">
            <h1>Checkout</h1>
            <div className="grid grid-cols-4 gap-3 mt-3">
                <div className="col-span-3 border stroke-1 p-5 rounded-2xl">
                    <h2>Address</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2'>
                        {address.map((add: any) => (add.isDefault) && <div className='border stroke-1 p-2 rounded-2xl' key={add.id}>
                            <h4 className='truncate'><span className='text-black'>Label:</span> {add.label}</h4>
                            <h4 className='truncate'><span className='text-black'>Floor:</span> {add.floor}</h4>
                            <h4 className='truncate'><span className='text-black'>Apartment:</span> {add.apartment}</h4>
                            <h4 className='truncate'><span className='text-black'>Building:</span> {add.building}</h4>
                            <h4 className='truncate'><span className='text-black'>City:</span> {add.city}</h4>
                        </div>)}
                        <div className="mt-3"></div>
                        {address.length == 0 && <Button variant={'outline'}><Link href={'/address'}>Add new address</Link></Button>}
                        {address.length > 0 && <Button variant={'outline'}><Link href={'/address'}>Select another address</Link></Button>}
                    </div>
                    <h2 className='mt-3'>Products</h2>
                    <h2 className='mt-3'>Payment Method</h2>
                    <div className="mt-2">
                        <select className='border p-1 stroke-1 rounded-xl' onChange={(e) => setPayment(e.target.value)} name="" id="">
                            <option value="cod">
                                Cash on delivery
                            </option>
                        </select>
                    </div>
                </div>
                <div className="col-span-1 text-center"></div>
                <Button className='cursor-pointer w-[150px] sm:w-[500px]' onClick={() => checkout()}>Place Order</Button>
            </div>
        </div>
    )
}
