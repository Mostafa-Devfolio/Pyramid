'use client';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Locked() {
  const t = useTranslations('PRISM');
  const router = useRouter();
  return (
    <div className="text-center">
      <h1 className="my-5">{t('please_login')}</h1>
      <Button className="cursor-pointer" onClick={() => router.push('/login')}>
        {t('login')}
      </Button>
    </div>
  );
}
