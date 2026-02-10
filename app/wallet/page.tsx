'use client';
import { authContext } from '@/lib/ContextAPI/authContext';
import React, { useContext, useEffect, useState } from 'react';
import { getLoginTo } from '../login/login';
import { getClass } from '@/services/ApiServices';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { Button } from '@/components/ui/button';

export default function Wallet() {
  const { userData } = useContext(authContext);
  const [wallet, setWallet] = useState([]);
  const [addWallet, setAddWallet] = useState(false);
  const [amount, setAmount] = useState(0);

  async function getWallet() {
    const token = await getLoginTo();
    const data = await getClass.getWalletHistory(token);
    setWallet(data.data);
  }

  async function addWalletTo() {
    const body = {
      amount: amount,
      type: 'credit',
      reason: 'Top Up Wallet',
    };
    const token = await getLoginTo();
    const data = await getClass.addToWallet(token, body);
    getWallet();
  }

  useEffect(() => {
    getWallet();
    console.log(userData);
  }, [userData]);

  return (
    <div className="container mx-auto">
      <h1 className="mt-3">Wallet</h1>
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
              {wallet.map((userWallet: any) => {
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
