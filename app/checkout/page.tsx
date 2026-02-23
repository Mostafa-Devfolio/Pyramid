'use client';
import { Button } from '@/components/ui/button';
import { getClass } from '@/services/ApiServices';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { showToast } from 'nextjs-toast-notify';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { getLoginTo } from '../login/login';
import { cartCount } from '@/lib/ContextAPI/cartCount';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import Image from 'next/image';
import { DatePicker } from '@heroui/react';
import { now, getLocalTimeZone, DateValue } from '@internationalized/date';
import { ICartItems, Item } from '../interface/Cart/cartItems';
import { IAddress } from '../interface/addressInterface';

export default function CheckoutPage() {
  const [address, setAddress] = useState<IAddress[]>([]);
  const [payment, setPayment] = useState('cod');
  const router = useRouter();
  const { auth, token, userData } = useAuth();
  const { countt, setCountt } = useContext(cartCount);
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

  async function checkout() {
    if (!token) return;
    let dateTimeISO = null;

    if (selectedDataTime) {
      const jsDate = selectedDataTime.toDate(getLocalTimeZone());
      dateTimeISO = jsDate.toISOString();
    }

    const body = {
      addressId: address[0].id,
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
    if (!auth) {
      router.push('/login');
    }
    getAddress();
    async function getCartItems() {
      if (!token) return;
      const data = await getClass.getCartItems(1, token);
      setCartItems(data.items);
    }
    getCartItems();
  }, [auth]);

  return (
    <div className="container mx-auto my-3">
      <h1>Checkout</h1>
      <div className="mt-3 grid grid-cols-4 gap-3">
        <div className="col-span-4 rounded-2xl border stroke-1 p-5">
          <h2>Address</h2>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {address.map(
              (add: IAddress) =>
                add.isDefault && (
                  <div className="rounded-2xl border stroke-1 p-2" key={add.id}>
                    <h4 className="truncate">
                      <span className="text-black">Label:</span> {add.label}
                    </h4>
                    <h4 className="truncate">
                      <span className="text-black">Floor:</span> {add.floor}
                    </h4>
                    <h4 className="truncate">
                      <span className="text-black">Apartment:</span> {add.apartment}
                    </h4>
                    <h4 className="truncate">
                      <span className="text-black">Building:</span> {add.building}
                    </h4>
                    <h4 className="truncate">
                      <span className="text-black">City:</span> {add.city}
                    </h4>
                  </div>
                )
            )}
            <div className="mt-3"></div>
            {address.length == 0 && (
              <Button variant={'outline'}>
                <Link href={'/address'}>Add new address</Link>
              </Button>
            )}
            {address.length > 0 && (
              <Button variant={'outline'}>
                <Link href={'/address'}>Select another address</Link>
              </Button>
            )}
          </div>
          <div className="">
            <h2 className="my-3">Schedule your order</h2>
            <div className="mb-3 flex gap-3">
              <ul className="mb-3 flex gap-3">
                <li
                  className={`rounded-2xl border stroke-1 p-2 hover:bg-black hover:text-white ${isSelectedSchedule == 0 ? 'bg-black text-white' : ''}`}
                  onClick={() => {
                    setIsSelectedSchedule(0);
                    setScheduleTime('now');
                  }}
                >
                  Now
                </li>
                <li
                  className={`rounded-2xl border stroke-1 p-2 hover:bg-black hover:text-white ${isSelectedSchedule == 1 ? 'bg-black text-white' : ''}`}
                  onClick={() => {
                    setIsSelectedSchedule(1);
                    setScheduleTime('scheduled_at');
                  }}
                >
                  Choose another time
                </li>
              </ul>
              {isSelectedSchedule == 1 && (
                <div className="flex w-full max-w-xl flex-row gap-4">
                  <DatePicker
                    hideTimeZone
                    showMonthAndYearPickers
                    label="Event Date"
                    variant="bordered"
                    value={selectedDataTime}
                    onChange={setSelectedDataTime}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="">
            <h2 className="my-3">Driver Tip</h2>
            <ul className="mb-3 flex gap-3">
              <li
                className={`rounded-2xl border stroke-1 p-2 hover:bg-black hover:text-white ${isSelected == 0 ? 'bg-black text-white' : ''}`}
                onClick={() => {
                  setIsCustom(false);
                  setTipValue(5);
                  setIsSelected(0);
                }}
              >
                5 EGP
              </li>
              <li
                className={`rounded-2xl border stroke-1 p-2 hover:bg-black hover:text-white ${isSelected == 1 ? 'bg-black text-white' : ''}`}
                onClick={() => {
                  setIsCustom(false);
                  setTipValue(10);
                  setIsSelected(1);
                }}
              >
                10 EGP
              </li>
              <li
                className={`rounded-2xl border stroke-1 p-2 hover:bg-black hover:text-white ${isSelected == 2 ? 'bg-black text-white' : ''}`}
                onClick={() => {
                  setIsCustom(false);
                  setTipValue(15);
                  setIsSelected(2);
                }}
              >
                15 EGP
              </li>
              <li
                className={`rounded-2xl border stroke-1 p-2 hover:bg-black hover:text-white ${isSelected == 3 ? 'bg-black text-white' : ''}`}
                onClick={() => {
                  setIsCustom(true);
                  setIsSelected(3);
                }}
              >
                Custom
              </li>
            </ul>
            {isCustom && (
              <input
                type="number"
                onChange={(e) => setTipValue(Number(e.target.value))}
                placeholder="Enter driver tip"
                className="rounded-2xl border stroke-1 p-2"
              />
            )}
          </div>
          <div className="flex flex-col gap-3">
            <h2>Deliver To</h2>
            <ul className="flex gap-3">
              <li
                className={`rounded-2xl border stroke-1 p-2 hover:bg-black hover:text-white ${isSelectedDeliver == 0 ? 'bg-black text-white' : ''}`}
                onClick={() => {
                  setDeliverTo('self');
                  setIsSelectedDeliver(0);
                }}
              >
                Me
              </li>
              <li
                className={`rounded-2xl border stroke-1 p-2 hover:bg-black hover:text-white ${isSelectedDeliver == 1 ? 'bg-black text-white' : ''}`}
                onClick={() => {
                  setDeliverTo('other');
                  setIsSelectedDeliver(1);
                }}
              >
                Other
              </li>
            </ul>
            {isSelectedDeliver == 1 && (
              <div className="flex gap-3">
                <input
                  type="text"
                  className="rounded-2xl border stroke-1 p-2"
                  placeholder="Enter recipient name:"
                  onChange={(e) => setRecipientName(e.target.value)}
                />
                <input
                  type="number"
                  className="rounded-2xl border stroke-1 p-2"
                  placeholder="Enter recipient phone:"
                  onChange={(e) => setRecipientPhone(Number(e.target.value))}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <h2>Note</h2>
            <textarea
              rows={4}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl border stroke-1 p-2"
              placeholder="Enter your notes here"
            ></textarea>
          </div>
          <div className="mt-3">
            <h2>Order Subscription</h2>
            <p>* Get this order daily, weekly or monthly as you want.</p>
            <ul className="mt-4 flex gap-5">
              <li
                className={`rounded-2xl border stroke-1 p-2 hover:bg-black hover:text-white ${isSelectedSubscribtion == 0 ? 'bg-black text-white' : ''}`}
                onClick={() => {
                  setRecurrence('once');
                  setIsSelectedSubscribtion(0);
                }}
              >
                One Time
              </li>
              <li
                className={`rounded-2xl border stroke-1 p-2 hover:bg-black hover:text-white ${isSelectedSubscribtion == 1 ? 'bg-black text-white' : ''}`}
                onClick={() => {
                  setRecurrence('daily');
                  setIsSelectedSubscribtion(1);
                }}
              >
                Daily
              </li>
              <li
                className={`rounded-2xl border stroke-1 p-2 hover:bg-black hover:text-white ${isSelectedSubscribtion == 2 ? 'bg-black text-white' : ''}`}
                onClick={() => {
                  setRecurrence('weekly');
                  setIsSelectedSubscribtion(2);
                }}
              >
                Weekly
              </li>
              <li
                className={`rounded-2xl border stroke-1 p-2 hover:bg-black hover:text-white ${isSelectedSubscribtion == 3 ? 'bg-black text-white' : ''}`}
                onClick={() => {
                  setRecurrence('monthly');
                  setIsSelectedSubscribtion(3);
                }}
              >
                Monthly
              </li>
            </ul>
            {isSelectedSubscribtion == 1 && (
              <>
                <input
                  type="text"
                  className="border-warning mt-4 rounded-2xl border stroke-1 p-2"
                  placeholder="(Time) EX: 12:30"
                  onChange={(e) => setSubscribtionDateDaily(e.target.value)}
                />
                <p className="text-warning mt-2">* Enter the time you want to get the order within daily.</p>
              </>
            )}
            {isSelectedSubscribtion == 2 && (
              <>
                <div className="sm:flex sm:gap-4">
                  <input
                    type="number"
                    placeholder="(Day in week) EX: 5"
                    className="border-warning mt-4 rounded-2xl border stroke-1 p-2"
                    onChange={(e) => setSubscribtionDateWeekly(Number(e.target.value))}
                  />
                  <input
                    type="text"
                    className="border-warning mt-4 rounded-2xl border stroke-1 p-2"
                    placeholder="(Time) EX: 12:30"
                    onChange={(e) => setSubscribtionDateDaily(e.target.value)}
                  />
                </div>
                <p className="text-warning mt-2">
                  * Enter 0 for sunday, 1 for monday, 2 for tuesday, 3 for wednesday, 4 for thursday, 5 for friday, 6
                  for saturday and the time of the order.
                </p>
              </>
            )}
            {isSelectedSubscribtion == 3 && (
              <>
                <div className="sm:flex sm:gap-4">
                  <input
                    type="number"
                    placeholder="(Day in month) EX: 15"
                    className="border-warning mt-4 rounded-2xl border stroke-1 p-2"
                    onChange={(e) => setSubscribtionDateMonthly(Number(e.target.value))}
                  />
                  <input
                    type="text"
                    className="border-warning mt-4 rounded-2xl border stroke-1 p-2"
                    placeholder="(Time) EX: 12:30"
                    onChange={(e) => setSubscribtionDateDaily(e.target.value)}
                  />
                </div>
                <p className="text-warning mt-2">
                  * Enter the day of month from 1 to 31 to get your order monthly at the same day and the time of the
                  order.
                </p>
              </>
            )}
          </div>
          <h2 className="my-3">Products</h2>
          <div className="grid grid-cols-2 gap-3">
            {cartItems.map((item: Item) => {
              return (
                <div key={item.id} className="mb-5 rounded-2xl border">
                  <div className="grid grid-cols-1 sm:grid-cols-8">
                    <div className="rounded-2xl sm:col-span-2">
                      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                        <Image
                          src={item.product.images ?? IMAGE_PLACEHOLDER}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center gap-4 p-3 sm:col-span-2">
                      <div className="flex justify-between">
                        <h2>{item.product.title}</h2>
                      </div>
                      {item.variant != null && <h3>{item.variant.displayName}</h3>}
                      {item.variant == null && item.product.baseSalePrice == null && (
                        <h3>Price: {item.product.basePrice * item.quantity}</h3>
                      )}
                      {item.variant == null && item.product.baseSalePrice != null && (
                        <h3>Price: {item.product.baseSalePrice * item.quantity}</h3>
                      )}
                      {item.variant != null && item.variant.salePrice == null && (
                        <h3>Price: {item.variant.price * item.quantity}</h3>
                      )}
                      {item.variant != null && item.variant.salePrice != null && (
                        <h3>Price: {item.variant.salePrice * item.quantity}</h3>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <h2 className="mt-3">Payment Method</h2>
          <div className="mt-2">
            <select
              className="rounded-xl border stroke-1 p-1"
              onChange={(e) => setPayment(e.target.value)}
              name=""
              id=""
            >
              <option value="cod">Cash on delivery</option>
              <option value="wallet">Wallet</option>
            </select>
            {userData?.walletBalance > 0 && (
              <div className="mt-3 flex gap-3">
                <input type="checkbox" onClick={() => setDeductWallet(!deductWallet)} />
                <h4>
                  You have ${userData?.walletBalance} in your wallet balance, use them to deduct from the order fees?
                </h4>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-1 text-center"></div>
        <Button className="w-[150px] cursor-pointer sm:w-[500px]" onClick={() => checkout()}>
          Place Order
        </Button>
      </div>
      {isError && <p className="mt-5 text-center text-red-600">* Insufficient wallet balance to pay this order.</p>}
    </div>
  );
}
