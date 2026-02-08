'use client';

export default function Icon({ className = '' }: { className?: string }) {
  return <i className={`fa-solid fa-star ${className}`}></i>;
}
