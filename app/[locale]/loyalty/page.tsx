'use client';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { ILoyalty, ILoyaltyT } from '../interface/loyalty';
import { ChevronLeft, Coins, Wallet, Landmark, ArrowRightLeft, History } from 'lucide-react';

export default function Loyalty() {
  const { token } = useAuth();
  const [loyalty, setloyalty] = useState<ILoyaltyT | undefined>(undefined);
  const [loyaltyHistory, setLoyaltyHistory] = useState<ILoyalty[]>([]);
  const [loyaltyNum, setLoyaltyNum] = useState(0);
  const [loyaltyNum2, setLoyaltyNum2] = useState(0);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState<number | null>(null);
  const [holderName, setHolderName] = useState('');

  const router = useRouter();

  async function getLoyaltyPoints() {
    if (!token) return;
    const data = await getClass.getLoyalty(token);
    setloyalty(data.data);
  }

  async function getLoyaltyHistory() {
    if (!token) return;
    const data = await getClass.loyaltyHistory(token);
    setLoyaltyHistory(data.data);
  }

  async function convertPointsToWallet(myPoints: number) {
    if (!token) return;
    const body = { points: myPoints };
    await getClass.convertLoyaltyToWallet(token, body);
    getLoyaltyPoints();
    getLoyaltyHistory();
  }

  async function convertPointsToCash(myPoints: number) {
    if (!token) return;
    const body = {
      points: myPoints,
      bankDetails: {
        bankName: bankName,
        accountNumber: accountNumber,
        holderName: holderName,
      },
    };
    await getClass.withdrawalLoyaltyCash(token, body);
    getLoyaltyPoints();
    getLoyaltyHistory();
  }

  useEffect(() => {
    async function getLoyaltyPoint() {
      if (!token) return;
      const data = await getClass.getLoyalty(token);
      setloyalty(data.data);
    }
    getLoyaltyPoint();

    async function getLoyaltyHistories() {
      if (!token) return;
      const data = await getClass.loyaltyHistory(token);
      setLoyaltyHistory(data.data);
    }
    getLoyaltyHistories();
  }, [token]);

  return (
    <div className="animate-in fade-in container mx-auto max-w-6xl space-y-10 px-4 py-10 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/profile')}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:scale-105 hover:bg-gray-50 active:scale-95"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Loyalty Rewards</h1>
          <p className="text-sm font-medium text-gray-500">Manage your points, wallet balance, and withdrawals.</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Points Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-400 to-orange-500 p-8 text-white shadow-xl shadow-orange-500/20">
          <div className="absolute -top-6 -right-6 opacity-20">
            <Coins size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                <Coins size={20} />
              </div>
              <h2 className="text-sm font-black tracking-widest text-orange-100 uppercase">Available Points</h2>
            </div>
            <p className="text-5xl font-black tracking-tight">{loyalty?.loyaltyPoints || 0}</p>
          </div>
        </div>

        {/* Wallet Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-950 p-8 text-white shadow-xl shadow-slate-900/20">
          <div className="absolute -top-6 -right-6 opacity-10">
            <Wallet size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                <Wallet size={20} />
              </div>
              <h2 className="text-sm font-black tracking-widest text-slate-400 uppercase">Wallet Balance</h2>
            </div>
            <p className="text-5xl font-black tracking-tight">
              {loyalty?.walletBalance || 0} <span className="text-2xl font-bold text-slate-500">EGP</span>
            </p>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        {/* Convert to Wallet */}
        <div className="space-y-6 rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <ArrowRightLeft size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Convert to Wallet</h2>
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Turn points into credit</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700">How many points to convert?</label>
            <div className="relative">
              <input
                type="number"
                value={loyaltyNum || ''}
                onChange={(e) => setLoyaltyNum(Number(e.target.value))}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 pr-24 text-xl font-black transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                placeholder="0"
                min={0}
              />
              <button
                className="absolute top-2 right-2 bottom-2 rounded-xl bg-gray-200 px-4 text-xs font-black tracking-widest text-gray-700 uppercase transition-colors hover:bg-gray-300"
                onClick={() => setLoyaltyNum(Number(loyalty?.loyaltyPoints || 0))}
              >
                Max
              </button>
            </div>
            <button
              onClick={() => convertPointsToWallet(loyaltyNum)}
              className="w-full rounded-full bg-blue-600 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-95"
            >
              Convert to Wallet
            </button>
          </div>
        </div>

        {/* Withdraw as Cash */}
        <div className="space-y-6 rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Landmark size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Withdraw to Bank</h2>
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Cash out your points</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="pl-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Points to withdraw
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={loyaltyNum2 || ''}
                  onChange={(e) => setLoyaltyNum2(Number(e.target.value))}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 pr-24 text-xl font-black transition-all outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600"
                  placeholder="0"
                  min={0}
                />
                <button
                  className="absolute top-2 right-2 bottom-2 rounded-xl bg-gray-200 px-4 text-xs font-black tracking-widest text-gray-700 uppercase transition-colors hover:bg-gray-300"
                  onClick={() => setLoyaltyNum2(Number(loyalty?.loyaltyPoints || 0))}
                >
                  Max
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="pl-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">Bank Name</label>
                <input
                  type="text"
                  required
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. CIB"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div className="space-y-2">
                <label className="pl-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                  Account Number
                </label>
                <input
                  type="number"
                  required
                  onChange={(e) => setAccountNumber(Number(e.target.value))}
                  placeholder="xxxxxxxxxxx"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="pl-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  required
                  onChange={(e) => setHolderName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <button
              onClick={() => convertPointsToCash(loyaltyNum2)}
              className="w-full rounded-full bg-emerald-600 py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 active:scale-95"
            >
              Request Withdrawal
            </button>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <History className="text-gray-400" size={24} />
          <h2 className="text-2xl font-black text-gray-900">Transaction History</h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <Table
            aria-label="Loyalty points history table"
            className="w-full"
            shadow="none"
            classNames={{ wrapper: 'rounded-none shadow-none' }}
          >
            <TableHeader>
              <TableColumn className="bg-gray-50 text-xs font-black tracking-widest text-gray-500 uppercase">
                ID
              </TableColumn>
              <TableColumn className="bg-gray-50 text-xs font-black tracking-widest text-gray-500 uppercase">
                Description
              </TableColumn>
              <TableColumn className="bg-gray-50 text-xs font-black tracking-widest text-gray-500 uppercase">
                Points
              </TableColumn>
              <TableColumn className="bg-gray-50 text-xs font-black tracking-widest text-gray-500 uppercase">
                Type
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent={'No transaction history available.'}>
              {loyaltyHistory.map((loyalties: ILoyalty) => (
                <TableRow
                  key={loyalties.id}
                  className="border-b border-gray-50 transition-colors last:border-none hover:bg-gray-50/50"
                >
                  <TableCell className="font-medium text-gray-500">#{loyalties.id}</TableCell>
                  <TableCell className="font-bold text-gray-900">{loyalties.description}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${loyalties.type === 'earned' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {loyalties.type === 'earned' ? '+' : '-'}
                      {loyalties.points}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-gray-600 capitalize">{loyalties.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
