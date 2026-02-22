'use client';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import React, { useContext, useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from '@heroui/react';
import { useRouter } from 'next/navigation';

export default function Loyalty() {
  const { token } = useAuth();
  const [loyalty, setloyalty] = useState();
  const [loyaltyHistory, setLoyaltyHistory] = useState();
  const [loyaltyNum, setLoyaltyNum] = useState(0);
  const [loyaltyNum2, setLoyaltyNum2] = useState(0);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState<number | null>(null);
  const [holderName, setHolderName] = useState('');

  async function getLoyaltyPoints() {
    const data = await getClass.getLoyalty(token);
    setloyalty(data.data);
  }

  async function getLoyaltyHistory() {
    const data = await getClass.loyaltyHistory(token);
    setLoyaltyHistory(data.data);
  }

  async function convertPointsToWallet(myPoints: number) {
    const body = {
      points: myPoints,
    };
    const data = await getClass.convertLoyaltyToWallet(token, body);
    getLoyaltyPoints();
    getLoyaltyHistory();
  }

  async function convertPointsToCash(myPoints: number) {
    const body = {
      points: myPoints,
      bankDetails: {
        bankName: bankName,
        accountNumber: accountNumber,
        holderName: holderName,
      },
    };
    const data = await getClass.withdrawalLoyaltyCash(token, body);
    getLoyaltyPoints();
    getLoyaltyHistory();
  }
  const router = useRouter();

  useEffect(() => {
    getLoyaltyPoints();
    getLoyaltyHistory();
  }, [token]);

  return (
    <div className="container mx-auto my-5">
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
        <h1 className="mb-3">Loyalty Points</h1>
      </div>
      <h3>Loyalty points: {loyalty?.loyaltyPoints}</h3>
      <h3>Wallet Balance: {loyalty?.walletBalance}</h3>
      <div className="my-4">
        <Table isStriped aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Earned from</TableColumn>
            <TableColumn>Points</TableColumn>
            <TableColumn>Type</TableColumn>
          </TableHeader>
          <TableBody>
            {loyaltyHistory?.map((loyalties: any) => {
              return (
                <TableRow key={loyalties.id}>
                  <TableCell>{loyalties.id}</TableCell>
                  <TableCell>{loyalties.description}</TableCell>
                  <TableCell>{loyalties.points}</TableCell>
                  <TableCell>{loyalties.type}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="">
          <h2>Convert loyalty points to your wallet</h2>
          <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-2">
            <label htmlFor="loyal">How many points to convert to wallet?</label>
            <div className="relative">
              <input
                type="number"
                value={loyaltyNum}
                id="loyal"
                className="rounded-2xl border stroke-1 p-2"
                placeholder="EX: 100"
                min={0}
                onChange={(e) => setLoyaltyNum(e.target.value)}
              />
              <Button
                className="absolute top-0 right-0 bottom-0 rounded-2xl"
                onClick={() => setLoyaltyNum(loyalty?.loyaltyPoints)}
              >
                Max
              </Button>
            </div>
          </div>
          <Button className="my-3" onClick={() => convertPointsToWallet(loyaltyNum)}>
            Convert
          </Button>
        </div>
        <div className="">
          <h2>Withdraw loyalty points as a cash</h2>
          <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-2">
            <label htmlFor="loyal">How many points to convert to cash?</label>
            <div className="grid grid-cols-1">
              <div className="relative">
                <input
                  type="number"
                  value={loyaltyNum2}
                  id="loyal"
                  className="rounded-2xl border stroke-1 p-2"
                  placeholder="EX: 100"
                  min={0}
                  onChange={(e) => setLoyaltyNum2(e.target.value)}
                />
                <Button
                  className="absolute top-0 right-0 rounded-2xl"
                  onClick={() => setLoyaltyNum2(loyalty?.loyaltyPoints)}
                >
                  Max
                </Button>
              </div>
            </div>
          </div>
          <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <label htmlFor="bankName">Bank Name</label>
              <input
                type="text"
                id="bankName"
                required
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Bank Name (ex: CIB):"
                className="rounded-2xl border stroke-1 p-2"
              />
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="accNumber">Account Number</label>
              <input
                type="number"
                id="accNumber"
                required
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Account Number (ex: xxxxxxxxxxx):"
                className="rounded-2xl border stroke-1 p-2"
              />
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="holder">Holder Name</label>
              <input
                type="text"
                id="holder"
                required
                onChange={(e) => setHolderName(e.target.value)}
                placeholder="Holder Name (ex: Mostafa):"
                className="rounded-2xl border stroke-1 p-2"
              />
            </div>
          </div>
          <Button onClick={() => convertPointsToCash(loyaltyNum2)}>Withdrawal</Button>
        </div>
      </div>
    </div>
  );
}
