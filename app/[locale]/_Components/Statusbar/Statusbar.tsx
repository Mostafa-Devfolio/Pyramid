'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import Link from 'next/link';
import { useCartCount } from '@/lib/ContextAPI/cartCount';
import { Home, ShoppingBag, FileText, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Statusbar() {
  const t = useTranslations('PRISM');
  const pathName = usePathname();
  const [isSelected, setIsSelected] = useState(-1);
  const { countt } = useCartCount();

  useEffect(() => {
    function getReady() {
      if (pathName == '/') {
        setIsSelected(0);
      } else if (pathName == '/cart') {
        setIsSelected(1);
      } else if (pathName == '/orders') {
        setIsSelected(2);
      } else if (pathName == '/profile') {
        setIsSelected(3);
      }
    }
    getReady();
  }, [pathName]);

  const navItems = [
    { id: 0, label: t('home'), href: '/', icon: Home },
    { id: 1, label: t('cart'), href: '/cart', icon: ShoppingBag },
    { id: 2, label: t('orders'), href: '/orders', icon: FileText },
    { id: 3, label: t('profile'), href: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 dark:bg-black/60 left-0 z-5000 w-full border-t border-slate-100 bg-white/80 px-4 pt-3 pb-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isSelected === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsSelected(item.id)}
              className="group relative flex w-16 flex-col items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              {/* Icon Container */}
              <div
                className={`dark:text-white relative flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />

                {/* Cart Badge */}
                {item.id === 1 && countt > 0 && (
                  <div className="animate-in zoom-in absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-black text-white shadow-sm duration-300">
                    {countt}
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] dark:text-white font-bold transition-colors ${active ? 'text-blue-600' : 'text-slate-400'}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
