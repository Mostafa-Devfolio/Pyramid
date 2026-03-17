'use client';

import { useTransition, useState, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Globe, ChevronDown, Check, Loader2 } from 'lucide-react';

export default function LanguageSwitcher() {
    const t = useTranslations('PRISM')
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: t('english'), short: t('en') },
    { code: 'ar', label: t('arabic'), short: t('ar') },
  ];

  const currentLang = languages.find((lang) => lang.code === locale) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (nextLocale: string) => {
    if (nextLocale === locale) {
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`flex dark:bg-black/60 dark:text-white h-10 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-bold transition-all outline-none active:scale-95 sm:h-12 sm:gap-2 sm:px-5 sm:text-sm ${isOpen ? 'bg-slate-200 text-slate-900' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-blue-600'} disabled:cursor-not-allowed disabled:opacity-70`}
      >
        {isPending ? (
          <Loader2 className="h-3 w-3 shrink-0 animate-spin text-blue-600 sm:h-4 sm:w-4" />
        ) : (
          <Globe className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        )}

        <span className="mt-0.5 leading-none">{currentLang.short}</span>

        <ChevronDown
          className={`h-3 w-3 shrink-0 transition-transform duration-200 sm:h-4 sm:w-4 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="dark:bg-black/60 animate-in fade-in zoom-in-95 absolute top-full right-0 z-6000 mt-2 w-36 origin-top-right rounded-2xl border border-slate-100 bg-white p-1.5 shadow-2xl shadow-slate-200/50 duration-200 sm:w-40 sm:p-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-colors sm:px-4 sm:py-3 sm:text-sm ${
                locale === lang.code
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-white hover:text-slate-900'
              }`}
            >
              {lang.label}
              {locale === lang.code && <Check size={16} strokeWidth={3} className="shrink-0 text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
