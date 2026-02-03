"use client";
import { Button } from '@/components/ui/button'
import { getClass } from '@/services/ApiServices'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IAddress } from '../interface/addressInterface'

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  
  async function getAddress(){
    const data = await getClass.getAddress();
    console.log(data);
    setAddresses(data);
  }

  async function updateAddress(addressId: any) {
    await Promise.all(
      addresses.map((address: any) =>
        address.isDefault
          ? getClass.updateAddress(address.id, { isDefault: false })
          : Promise.resolve()
      )
    );

    const updatedDefault = {
      isDefault: true,
    }
    const data = await getClass.updateAddress(addressId, updatedDefault);
    getAddress();
  }

  useEffect(() => {
    getAddress();
  },[])

  return (
    <div>
      <h1>Addresses</h1>
      <Button className='mt-3'><Link href={'/address/add'}>Add</Link></Button>

      <div className='grid grid-cols-3 gap-5 mt-5'>
        {addresses.map((address: any) => {
          return <div key={address.id} className='border stroke-1 rounded-2xl p-5 text-gray-500 truncate'>
            <h4 className='truncate'><span className='text-black'>Label:</span> {address.label}</h4>
            <h4 className='truncate'><span className='text-black'>Floor:</span> {address.floor}</h4>
            <h4 className='truncate'><span className='text-black'>Apartment:</span> {address.apartment}</h4>
            <h4 className='truncate'><span className='text-black'>Building:</span> {address.building}</h4>
            <h4 className='truncate'><span className='text-black'>City:</span> {address.city}</h4>
            <h4>Default: {address.isDefault ? 'Yes' : 'No'}</h4>
            {address.isDefault == false && <Button className='mt-2' onClick={() => updateAddress(address.id)}>Set Default</Button>}
          </div>
        })}
      </div>
    </div>
  )
}