'use client';
import { useAuth } from '@/lib/ContextAPI/authContext';
import React from 'react';
import { Mail, Phone, User, ShieldCheck } from 'lucide-react';

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-6">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default function UserInfo() {
  const { userData } = useAuth();

  return (
    <div className="animate-in fade-in space-y-8 p-6 duration-500 sm:p-10">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Personal Details</h2>
        <p className="text-sm font-medium text-gray-500">Your account information at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {userData && (
          <>
            <InfoCard icon={<User size={20} />} label="Username" value={userData.username} />
            <InfoCard icon={<Phone size={20} />} label="Phone" value={userData.phone || 'Not provided'} />
            <InfoCard icon={<Mail size={20} />} label="Email Address" value={userData.email} />
            <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">Account Status</p>
                <p className="text-lg font-bold text-emerald-700">
                  {userData.confirmed ? 'Verified community member' : 'Verification pending'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
