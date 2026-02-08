import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-5 hidden bg-black p-5 text-xl sm:block">
      <div className="container mx-auto grid grid-cols-2">
        <div className="space-y-4 text-white">
          <h2>PYRAMIDS</h2>
          <p className="break-all">
            Shop what you want like Amazon, <br /> Talabat and Uber-Eats.
          </p>
          <Link className="text-yellow-200" href={'/about'}>
            read more
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          <div className="space-y-5 border-l border-gray-900 text-white">
            <h2 className="ml-4 font-bold">Discover</h2>
            <ul>
              <li className="ml-4">
                <Link href={'/'}>Buy & Sell</Link>
              </li>
              <li className="ml-4">
                <Link href={'/'}>Merchant</Link>
              </li>
              <li className="ml-4">
                <Link href={'/'}>Giving Back</Link>
              </li>
              <li className="ml-4">
                <Link href={'/'}>Help & Support</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-5 border-l border-gray-900 text-white">
            <h2 className="ml-4 font-bold">About</h2>
            <ul>
              <li className="ml-4">
                <Link href={'/'}>Staff</Link>
              </li>
              <li className="ml-4">
                <Link href={'/'}>Team</Link>
              </li>
              <li className="ml-4">
                <Link href={'/'}>Career</Link>
              </li>
              <li className="ml-4">
                <Link href={'/'}>Blog</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-5 border-l border-gray-900 text-white">
            <h2 className="ml-4 font-bold">Resource</h2>
            <ul>
              <li className="ml-4">
                <Link href={'/'}>Security</Link>
              </li>
              <li className="ml-4">
                <Link href={'/'}>Global</Link>
              </li>
              <li className="ml-4">
                <Link href={'/'}>Charts</Link>
              </li>
              <li className="ml-4">
                <Link href={'/'}>Privacy</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-5 border-l border-gray-900 text-white">
            <h2 className="ml-4 font-bold">Social</h2>
            <ul>
              <li className="ml-4">
                <Link href={'/'}>Github</Link>
              </li>
              <li className="ml-4">
                <Link href={'/'}>LinkedIn</Link>
              </li>
              <li className="ml-4">
                <Link href={'/'}>Fiverr</Link>
              </li>
              <li className="ml-4">
                <Link href={'/'}>Facebook</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
