import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-20 hidden border-t border-slate-900 bg-slate-950 pt-20 pb-10 selection:bg-blue-500 selection:text-white sm:block">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand Section */}
          <div className="space-y-6 lg:col-span-4">
            <h2 className="text-3xl font-black tracking-tighter text-white">PRISM</h2>
            <p className="max-w-sm text-sm leading-relaxed font-medium text-slate-400">
              Shop what you want like Amazon, Talabat and Uber-Eats. Your ultimate all-in-one ecosystem.
            </p>
            <Link
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-500 transition-colors hover:text-blue-400"
              href={'/about'}
            >
              Read our story <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {/* Discover */}
            <div className="space-y-5">
              <h3 className="text-sm font-black tracking-widest text-white uppercase">Discover</h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href={'/'} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                    Buy & Sell
                  </Link>
                </li>
                <li>
                  <Link href={'/'} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                    Merchant
                  </Link>
                </li>
                <li>
                  <Link href={'/'} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                    Giving Back
                  </Link>
                </li>
                <li>
                  <Link href={'/'} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                    Help & Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* About */}
            <div className="space-y-5">
              <h3 className="text-sm font-black tracking-widest text-white uppercase">About</h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href={'/'} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                    Staff
                  </Link>
                </li>
                <li>
                  <Link href={'/'} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                    Team
                  </Link>
                </li>
                <li>
                  <Link href={'/'} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                    Career
                  </Link>
                </li>
                <li>
                  <Link href={'/'} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resource */}
            <div className="space-y-5">
              <h3 className="text-sm font-black tracking-widest text-white uppercase">Resource</h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href={'/'} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href={'/'} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                    Global
                  </Link>
                </li>
                <li>
                  <Link href={'/'} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                    Charts
                  </Link>
                </li>
                <li>
                  <Link href={'/'} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="space-y-5">
              <h3 className="text-sm font-black tracking-widest text-white uppercase">Social</h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    href={'https://github.com/Mostafa-Devfolio'}
                    className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                  >
                    Github
                  </Link>
                </li>
                <li>
                  <Link
                    href={'https://www.linkedin.com/in/mostafa-sheriif/'}
                    className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href={'https://www.fiverr.com/users/mostafasheriif'}
                    className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                  >
                    Fiverr
                  </Link>
                </li>
                <li>
                  <Link href={'/'} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                    Facebook
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 md:flex-row">
          <p className="text-xs font-medium text-slate-500">
            &copy; {new Date().getFullYear()} PRISM. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <Link href={'/'} className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link href={'/'} className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
