'use client';
import { Button } from '@/components/ui/button';
import { getClass } from '@/services/ApiServices';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { showToast } from 'nextjs-toast-notify';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { useCartCount } from '@/lib/ContextAPI/cartCount';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import Image from 'next/image';
import { DatePicker } from '@heroui/react';
import { now, getLocalTimeZone, DateValue } from '@internationalized/date';
import { Item } from '../interface/Cart/cartItems';
import { IAddress } from '../interface/addressInterface';
import { useBusiness } from '@/lib/ContextAPI/businessTypeId';
import {
  MapPin,
  Clock,
  UserPlus,
  Coins,
  Repeat,
  PenLine,
  ShoppingBag,
  Banknote,
  Wallet,
  AlertTriangle,
} from 'lucide-react';

export default function CheckoutPage() {
  const [address, setAddress] = useState<IAddress[]>([]);
  const [payment, setPayment] = useState('cod');
  const router = useRouter();
  const { auth, token, userData } = useAuth();
  const { countt, setCountt } = useCartCount();
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [isCustom, setIsCustom] = useState(false);
  const [tipValue, setTipValue] = useState(0);
  const [isSelected, setIsSelected] = useState(-1);
  const [notes, setNotes] = useState('');
  const [isSelectedDeliver, setIsSelectedDeliver] = useState(0);
  const [isSelectedSchedule, setIsSelectedSchedule] = useState(0);
  const [isSelectedSubscribtion, setIsSelectedSubscribtion] = useState(0);
  const [deliverTo, setDeliverTo] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState<number | null>(null);
  const [scheduleTime, setScheduleTime] = useState('');
  const [selectedDataTime, setSelectedDataTime] = useState<DateValue | null>(now(getLocalTimeZone()));
  const [deductWallet, setDeductWallet] = useState(false);
  const [isError, setIsError] = useState(false);
  const [recurrence, setRecurrence] = useState('');
  const [subscribtionDateDaily, setSubscribtionDateDaily] = useState<string | null>(null);
  const [subscribtionDateWeekly, setSubscribtionDateWeekly] = useState<number | null>(null);
  const [subscribtionDateMonthly, setSubscribtionDateMonthly] = useState<number | null>(null);
  const { businessId } = useBusiness();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function checkout() {
    if (!token) return;
    setIsSubmitting(true);
    let dateTimeISO = null;

    if (selectedDataTime) {
      const jsDate = selectedDataTime.toDate(getLocalTimeZone());
      dateTimeISO = jsDate.toISOString();
    }

    const body = {
      addressId: address[0]?.id,
      paymentMethod: payment,
      businessTypeId: 1,
      tipAmount: tipValue,
      customerNote: notes,
      deliverTo: deliverTo,
      recipientName: recipientName,
      recipientPhone: recipientPhone,
      deliveryTimingType: scheduleTime,
      deliveryScheduledAt: dateTimeISO,
      useWallet: deductWallet,
      recurrence: recurrence,
      subscriptionTimeOfDay: subscribtionDateDaily,
      subscriptionDayOfWeek: subscribtionDateWeekly,
      subscriptionDayOfMonth: subscribtionDateMonthly,
    };

    const data = await getClass.checkout(body, token);

    if (data.error) {
      setIsError(true);
      setIsSubmitting(false);
    } else {
      setTimeout(() => {
        showToast.success('The order is placed successfully!', {
          duration: 4000,
          progress: true,
          position: 'top-right',
          transition: 'bounceIn',
          icon: '',
          sound: true,
        });
        setCountt(0);
      }, 200);
      setIsError(false);
      router.push('/orders');
    }
  }

  useEffect(() => {
    async function getAddress() {
      if (!token) return;
      const data = await getClass.getAddress(token);
      setAddress(data);
    }
    if (!token) {
      router.push('/login');
    }
    getAddress();

    async function getCartItems() {
      if (!token) return;
      if (businessId === null) return;
      const data = await getClass.getCartItems(businessId, token);
      setCartItems(data.items);
    }
    getCartItems();
  }, [token, businessId, router]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Checkout</h1>
          <p className="mt-2 font-medium text-slate-500">Complete your delivery details and finalize your order.</p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Column: Form Details */}
          <div className="space-y-8 lg:col-span-8">
            {/* Address Section */}
            <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 text-xl font-black text-slate-900">
                <MapPin className="text-blue-500" /> Delivery Address
              </h2>

              <div className="space-y-4">
                {address.map(
                  (add: IAddress) =>
                    add.isDefault && (
                      <div
                        className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-blue-100 bg-blue-50/30 p-6 sm:flex-row sm:items-center"
                        key={add.id}
                      >
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <span className="rounded bg-black px-2 py-0.5 text-[10px] font-black tracking-widest text-white uppercase">
                              {add.label || 'Address'}
                            </span>
                            <h4 className="font-bold text-slate-900">{add.city}</h4>
                          </div>
                          <p className="text-sm font-medium text-slate-600">
                            {add.street}, Bldg {add.building}, Fl {add.floor}, Apt {add.apartment}
                          </p>
                        </div>
                        <Link href={'/address'}>
                          <button className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-black hover:text-black">
                            Change
                          </button>
                        </Link>
                      </div>
                    )
                )}

                {address.length === 0 && (
                  <Button
                    variant={'outline'}
                    className="w-full rounded-2xl border-dashed py-6"
                    onClick={() => router.push('/address/add')}
                  >
                    + Add new address
                  </Button>
                )}
                {address.length > 0 && !address.some((a) => a.isDefault) && (
                  <Button
                    variant={'outline'}
                    className="w-full rounded-2xl border-dashed py-6"
                    onClick={() => router.push('/address')}
                  >
                    Select an address
                  </Button>
                )}
              </div>
            </section>

            {/* Schedule Section */}
            <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 text-xl font-black text-slate-900">
                <Clock className="text-emerald-500" /> Schedule Delivery
              </h2>
              <div className="mb-4 flex flex-wrap gap-3">
                <button
                  className={`rounded-full px-8 py-3 text-sm font-bold transition-all ${isSelectedSchedule === 0 ? 'bg-black text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  onClick={() => {
                    setIsSelectedSchedule(0);
                    setScheduleTime('now');
                  }}
                >
                  Now
                </button>
                <button
                  className={`rounded-full px-8 py-3 text-sm font-bold transition-all ${isSelectedSchedule === 1 ? 'bg-black text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  onClick={() => {
                    setIsSelectedSchedule(1);
                    setScheduleTime('scheduled_at');
                  }}
                >
                  Choose Time
                </button>
              </div>

              {isSelectedSchedule === 1 && (
                <div className="animate-in fade-in slide-in-from-top-2 mt-4 max-w-sm duration-300">
                  <DatePicker
                    hideTimeZone
                    showMonthAndYearPickers
                    label="Delivery Date"
                    variant="bordered"
                    value={selectedDataTime}
                    onChange={setSelectedDataTime}
                    className="bg-white"
                  />
                </div>
              )}
            </section>

            {/* Receiver Details Section */}
            <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 text-xl font-black text-slate-900">
                <UserPlus className="text-amber-500" /> Deliver To
              </h2>
              <div className="mb-6 flex flex-wrap gap-3">
                <button
                  className={`rounded-full px-8 py-3 text-sm font-bold transition-all ${isSelectedDeliver === 0 ? 'bg-black text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  onClick={() => {
                    setDeliverTo('self');
                    setIsSelectedDeliver(0);
                  }}
                >
                  Me
                </button>
                <button
                  className={`rounded-full px-8 py-3 text-sm font-bold transition-all ${isSelectedDeliver === 1 ? 'bg-black text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  onClick={() => {
                    setDeliverTo('other');
                    setIsSelectedDeliver(1);
                  }}
                >
                  Someone Else
                </button>
              </div>

              {isSelectedDeliver === 1 && (
                <div className="animate-in fade-in slide-in-from-top-2 grid grid-cols-1 gap-4 duration-300 sm:grid-cols-2">
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Recipient's Name"
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                  <input
                    type="number"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Recipient's Phone"
                    onChange={(e) => setRecipientPhone(Number(e.target.value))}
                  />
                </div>
              )}
            </section>

            {/* Driver Tip Section */}
            <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 text-xl font-black text-slate-900">
                <Coins className="text-yellow-500" /> Driver Tip
              </h2>
              <div className="mb-4 flex flex-wrap gap-3">
                {[
                  { val: 5, label: '5 EGP', id: 0 },
                  { val: 10, label: '10 EGP', id: 1 },
                  { val: 15, label: '15 EGP', id: 2 },
                ].map((tip) => (
                  <button
                    key={tip.id}
                    className={`rounded-full px-6 py-3 text-sm font-bold transition-all ${isSelected === tip.id ? 'bg-black text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    onClick={() => {
                      setIsCustom(false);
                      setTipValue(tip.val);
                      setIsSelected(tip.id);
                    }}
                  >
                    {tip.label}
                  </button>
                ))}
                <button
                  className={`rounded-full px-6 py-3 text-sm font-bold transition-all ${isSelected === 3 ? 'bg-black text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  onClick={() => {
                    setIsCustom(true);
                    setIsSelected(3);
                  }}
                >
                  Custom
                </button>
              </div>

              {isCustom && (
                <div className="animate-in fade-in slide-in-from-top-2 max-w-xs duration-300">
                  <input
                    type="number"
                    onChange={(e) => setTipValue(Number(e.target.value))}
                    placeholder="Enter amount (EGP)"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </section>

            {/* Order Subscription Section */}
            <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-2 flex items-center gap-3 text-xl font-black text-slate-900">
                <Repeat className="text-purple-500" /> Order Subscription
              </h2>
              <p className="mb-6 border-b border-slate-100 pb-4 text-sm font-medium text-slate-500">
                Automate this order to arrive regularly.
              </p>

              <div className="mb-6 flex flex-wrap gap-3">
                {[
                  { val: 'once', label: 'One Time', id: 0 },
                  { val: 'daily', label: 'Daily', id: 1 },
                  { val: 'weekly', label: 'Weekly', id: 2 },
                  { val: 'monthly', label: 'Monthly', id: 3 },
                ].map((sub) => (
                  <button
                    key={sub.id}
                    className={`rounded-full px-6 py-3 text-sm font-bold transition-all ${isSelectedSubscribtion === sub.id ? 'bg-black text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    onClick={() => {
                      setRecurrence(sub.val);
                      setIsSelectedSubscribtion(sub.id);
                    }}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                {isSelectedSubscribtion === 1 && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      className="w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold transition-all outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Time (e.g. 12:30)"
                      onChange={(e) => setSubscribtionDateDaily(e.target.value)}
                    />
                    <p className="px-2 text-xs font-bold text-purple-600">
                      Enter the time you want to receive this daily.
                    </p>
                  </div>
                )}
                {isSelectedSubscribtion === 2 && (
                  <div className="space-y-2">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <input
                        type="number"
                        placeholder="Day of Week (0-6)"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold transition-all outline-none focus:ring-2 focus:ring-purple-500 sm:w-1/2"
                        onChange={(e) => setSubscribtionDateWeekly(Number(e.target.value))}
                      />
                      <input
                        type="text"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold transition-all outline-none focus:ring-2 focus:ring-purple-500 sm:w-1/2"
                        placeholder="Time (e.g. 12:30)"
                        onChange={(e) => setSubscribtionDateDaily(e.target.value)}
                      />
                    </div>
                    <p className="px-2 text-xs font-bold text-purple-600">
                      0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat.
                    </p>
                  </div>
                )}
                {isSelectedSubscribtion === 3 && (
                  <div className="space-y-2">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <input
                        type="number"
                        placeholder="Day of Month (1-31)"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold transition-all outline-none focus:ring-2 focus:ring-purple-500 sm:w-1/2"
                        onChange={(e) => setSubscribtionDateMonthly(Number(e.target.value))}
                      />
                      <input
                        type="text"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold transition-all outline-none focus:ring-2 focus:ring-purple-500 sm:w-1/2"
                        placeholder="Time (e.g. 12:30)"
                        onChange={(e) => setSubscribtionDateDaily(e.target.value)}
                      />
                    </div>
                    <p className="px-2 text-xs font-bold text-purple-600">
                      Choose a day (1-31) to receive this monthly.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Notes Section */}
            <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 text-xl font-black text-slate-900">
                <PenLine className="text-gray-400" /> Delivery Notes
              </h2>
              <textarea
                rows={3}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-6 font-medium transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Any special instructions for the driver?"
              ></textarea>
            </section>
          </div>

          {/* Right Column: Order Summary & Payment (Sticky) */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
            {/* Products Review */}
            <section className="space-y-4 rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 border-b border-slate-100 pb-4 text-lg font-black text-slate-900">
                <ShoppingBag className="text-blue-500" size={20} /> Order Items
              </h2>
              <div className="flex max-h-[300px] flex-col gap-4 overflow-y-auto pr-2">
                {cartItems.map((item: Item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white">
                      <Image
                        src={
                          item.product?.images?.[0]?.url
                            ? `https://prism.devfolio.net/${item.product?.images?.[0]?.url}`
                            : IMAGE_PLACEHOLDER
                        }
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="line-clamp-1 text-sm font-bold text-slate-900">{item.product.title}</h3>
                      {item.variant != null && (
                        <p className="mt-0.5 text-[10px] font-black text-slate-400 uppercase">
                          {item.variant.displayName}
                        </p>
                      )}
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Qty: {item.quantity}</span>
                        <span className="text-sm font-black text-slate-900">
                          {item.variant == null &&
                            item.product.baseSalePrice == null &&
                            item.product.basePrice * item.quantity}
                          {item.variant == null &&
                            item.product.baseSalePrice != null &&
                            item.product.baseSalePrice * item.quantity}
                          {item.variant != null && item.variant.salePrice == null && item.variant.price * item.quantity}
                          {item.variant != null &&
                            item.variant.salePrice != null &&
                            item.variant.salePrice * item.quantity}{' '}
                          EGP
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Method & Submit */}
            <section className="space-y-6 rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20">
              <h2 className="flex items-center gap-2 border-b border-slate-800 pb-4 text-lg font-black text-white">
                <Banknote className="text-emerald-400" size={20} /> Payment Method
              </h2>

              <div className="relative">
                <select
                  onChange={(e) => setPayment(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-700 bg-slate-800 px-5 py-4 text-sm font-bold text-white transition-all outline-none focus:border-blue-500"
                >
                  <option value="cod">Cash on delivery</option>
                  <option value="wallet">Pay via Wallet</option>
                </select>
                <div className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-slate-400">▼</div>
              </div>

              {payment === 'wallet' && (userData?.walletBalance ?? 0) > 0 && (
                <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-blue-800/50 bg-blue-900/40 p-4">
                  <input
                    type="checkbox"
                    onClick={() => setDeductWallet(!deductWallet)}
                    className="h-5 w-5 rounded border-slate-600 bg-slate-800 accent-blue-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-blue-100">Use Wallet Balance</span>
                    <span className="text-xs font-medium text-blue-300">Available: {userData?.walletBalance} EGP</span>
                  </div>
                </label>
              )}

              <div className="mt-4 border-t border-slate-800 pt-6">
                <button
                  disabled={isSubmitting}
                  onClick={checkout}
                  className="w-full rounded-full bg-blue-600 py-5 text-lg font-black text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-95 disabled:bg-slate-700 disabled:text-slate-400"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Order'}
                </button>

                {isError && (
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-center text-xs font-bold text-red-400">
                    <AlertTriangle size={14} /> Insufficient wallet balance.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
