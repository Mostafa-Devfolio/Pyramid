'use client';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { registerSchema } from '@/lib/Schema/schema';
import { getClass } from '@/services/ApiServices';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      dateOfBirth: '',
      gender: '',
      phoneNumber: '',
    },
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function sendData(myData: any) {
    const userType = {
      username: myData.name,
      email: myData.email,
      password: myData.password,
      gender: myData.gender,
      phoneCountryIso2: 'EG',
      phoneNumber: myData.phoneNumber,
    };
    const register = await getClass.Register(userType, 'customer');
    console.log(register);

    if (register.message) {
      setIsRegistered(false);
      setError(register.message);
    } else {
      setIsRegistered(true);
      reset();
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  }

  return (
    <div className="container mx-auto">
      <div className="mx-auto my-5 flex flex-col items-center gap-3 rounded-2xl border p-5">
        <h1>Register</h1>
        <form className="flex w-[70%] flex-col gap-3" onSubmit={handleSubmit(sendData)}>
          <div>
            <Input type="text" placeholder="Enter your name" {...register('name')} />
            {errors.name?.message && <p className="text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <Input type="email" placeholder="Enter your email address" {...register('email')} />
            {errors.email?.message && <p className="text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <Input type="phone" placeholder="Enter your phone number" {...register('phoneNumber')} />
            {errors.phoneNumber?.message && <p className="text-red-600">{errors.phoneNumber.message}</p>}
          </div>
          <div>
            <Input type="password" placeholder="Enter your password" {...register('password')} />
            {errors.password?.message && <p className="text-red-600">{errors.password.message}</p>}
          </div>
          <div>
            <Input type="password" placeholder="Enter your password again" {...register('rePassword')} />
            {errors.rePassword?.message && <p className="text-red-600">{errors.rePassword.message}</p>}
          </div>
          <div>
            <Input type="date" placeholder="Enter your date of birth" {...register('dateOfBirth')} />
            {errors.dateOfBirth?.message && <p className="text-red-600">{errors.dateOfBirth.message}</p>}
          </div>
          {/* Gender (Controller REQUIRED) */}
          <div>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
          </div>
          <button type="submit" className="my-5 w-[60%] rounded-2xl bg-black p-2 text-white">
            Register
          </button>
        </form>
        <div className="flex items-center justify-center">
          {isRegistered ? (
            <p className="text-green-500">Account Registered Successfully</p>
          ) : (
            <p className="text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
