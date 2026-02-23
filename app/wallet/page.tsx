'use client';
import { authContext, useAuth } from '@/lib/ContextAPI/authContext';
import React, { useContext, useEffect, useState } from 'react';
import { getLoginTo } from '../login/login';
import { getClass } from '@/services/ApiServices';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { IWallet } from '../interface/wallet';

export default function Wallet() {
  const { token, userData } = useAuth();
  const [wallet, setWallet] = useState<IWallet[]>([]);
  const [addWallet, setAddWallet] = useState(false);
  const [amount, setAmount] = useState(0);
  const router = useRouter();

  // async function refreshWallet() {
  //   if (!token) return;
  //   const data = await getClass.getWalletHistory(token);
  //   setWallet(data.data);
  //   console.log(wallet);
  // }

  // async function addWalletTo() {
  //   if (!token) return;
  //   const body = {
  //     amount: amount,
  //     type: 'credit',
  //     reason: 'Top Up Wallet',
  //   };
  //   const data = await getClass.addToWallet(token, body);
  //   refreshWallet();
  // }

  useEffect(() => {
    if (!token) return;
    async function getWallet() {
      if (!token) return;
      const data = await getClass.getWalletHistory(token);
      setWallet(data.data);
    }
    getWallet();
  }, [token]);

  return (
    <div className="container mx-auto">
      <div className="flex items-center gap-1">
        <h2 onClick={() => router.push('/profile')} className="counter cursor-pointer">
          <svg width="2em" height="2em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 12H8M8 12L12 8M8 12L12 16"
              stroke="black"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </h2>
        <h1 className="mt-3">Wallet</h1>
      </div>
      <div className="my-3">
        <h3>Your Balance: {userData?.walletBalance}</h3>
        <div className="my-4">
          <Table isStriped aria-label="Example static collection table">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Balance Before</TableColumn>
              <TableColumn>Balance After</TableColumn>
              <TableColumn>Reason</TableColumn>
            </TableHeader>
            <TableBody>
              {wallet.map((userWallet: IWallet) => {
                return (
                  <TableRow key={userWallet.id}>
                    <TableCell>{userWallet.id}</TableCell>
                    <TableCell>{userWallet.amount}</TableCell>
                    <TableCell>{userWallet.balanceAfter}</TableCell>
                    <TableCell>{userWallet.reason}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {/* <div className="">
          <Button onClick={() => setAddWallet(!addWallet)}>TOP UP Wallet</Button>
          {addWallet && (
            <div className="my-4 flex items-center gap-3">
              <label htmlFor="wallet">Enter amount:</label>
              <input
                type="number"
                min={0}
                placeholder="Enter amount you want to add..."
                className="rounded-2xl border stroke-1 p-2"
                id="wallet"
                required
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button
                onClick={() => {
                  setAddWallet(false);
                  addWalletTo();
                }}
              >
                Add
              </Button>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}
