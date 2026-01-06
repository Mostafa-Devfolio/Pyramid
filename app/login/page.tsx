import React from 'react'

export default function Login() {
  return (
    <div className="container mx-auto my-5">
        <div className="border flex flex-col gap-3 rounded-2xl p-5 w-[70%] mx-auto items-center">
            <h1>Login</h1>
            <input type="email" className='w-[60%] border rounded-2xl p-4 mt-5' placeholder='Enter Your Email Address' name="" id="" />
            <input type="password" className='w-[60%] border rounded-2xl p-4' placeholder='Enter Your Password' name="" id="" />
            <button className="bg-black text-white p-2 rounded-2xl w-[60%] my-5">Login</button>
        </div>
    </div>
  )
}
