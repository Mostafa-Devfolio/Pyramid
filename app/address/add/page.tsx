'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button'
import { addressSchema } from '@/lib/Schema/schema';
import { getClass } from '@/services/ApiServices';

export default function AddAddress() {

    const { handleSubmit, register, formState: {errors}, reset} = useForm({
        defaultValues: {
            label: "",
            street: "",
            building: "",
            floor: "",
            apartment: "",
            city: "",
            isDefault: false,
            other: ""
        },
        mode: "onChange",
        resolver: zodResolver(addressSchema)
    });

    async function addAddress(myData: any) {
        console.log(myData);
        const data = await getClass.addAddress(myData);
        console.log(data);
    }
  return (
    <div className='mt-3'>
        <h1>Add New Address</h1>
        <form onSubmit={handleSubmit(addAddress)} className='grid grid-cols-2 gap-3 mt-3'>
            <div className='flex flex-col gap-2'>
                <label className='flex gap-1' htmlFor="label"><p className='text-red-600'>*</p> Label</label>
                <input required className='border p-2 rounded-xl' type="text" id="label" placeholder='Label' {...register('label')}/>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='flex gap-1' htmlFor="street"><p className='text-red-600'>*</p> Street</label>
                <input required className='border p-2 rounded-xl' type="text" id="street" placeholder='Street' {...register('street')}/>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='flex gap-1' htmlFor="building"><p className='text-red-600'>*</p> Building</label>
                <input required className='border p-2 rounded-xl' type="text" id="building" placeholder='Building' {...register('building')}/>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='flex gap-1' htmlFor="floor"><p className='text-red-600'>*</p> Floor</label>
                <input required className='border p-2 rounded-xl' type="text" id="floor" placeholder='Floor' {...register('floor')}/>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='flex gap-1' htmlFor="apartment"><p className='text-red-600'>*</p> Apartment</label>
                <input required className='border p-2 rounded-xl' type="text" id="apartment" placeholder='Apartment' {...register('apartment')}/>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='flex gap-1' htmlFor="city"><p className='text-red-600'>*</p> City</label>
                <input required className='border p-2 rounded-xl' type="text" id="city" placeholder='City' {...register('city')}/>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='flex gap-1' htmlFor="other">Other Details</label>
                <input className='border p-2 rounded-xl' type="text" id="other" placeholder='Other Details' {...register('other')}/>
            </div>
            <div className='flex flex-col gap-2 justify-center'>
                <label className='flex gap-1' htmlFor="isDefault">Is Default</label>
                <input className='border p-2 rounded-xl' type="checkbox" id="isDefault" placeholder='Is Default' {...register('isDefault')}/>
            </div>
            <Button type='submit'>Add</Button>
        </form>
    </div>
  )
}
