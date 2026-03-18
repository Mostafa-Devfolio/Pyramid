'use client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { IOrders, Item } from '@/app/[locale]/interface/orders';
import { IMAGE_PLACEHOLDER } from '@/lib/image';

export default function Subscription() {
  const [saveOrders, setSaveOrders] = useState<IOrders[]>([]);
  const { auth, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [orderIDD, setOrderIDD] = useState(0);
  const router = useRouter();

  async function getOrder() {
    if (!token) return;
    const data = await getClass.getOrders(token);
    const orders = data
      .filter(
        (order: IOrders) =>
          (order.fulfillmentStatus === 'pending' ||
            order.fulfillmentStatus === 'confirmed' ||
            order.fulfillmentStatus === 'processing' ||
            order.fulfillmentStatus === 'out_for_delivery') &&
          order.subscription?.status === 'active'
      )
      .sort((a: IOrders, b: IOrders) => b.id - a.id);
    setSaveOrders(orders);
  }

  async function cancelOrder(orderId: string) {
    if (!token) return;
    const cancel = { status: 'cancelled', fulfillmentStatus: 'cancelled', paymentStatus: 'unpaid' };
    await getClass.cancelOrder(orderId, cancel, token);
    getOrder();
  }

  useEffect(() => {
    async function getOrders() {
      if (!token) return;
      const data = await getClass.getOrders(token);
      const orders = data
        .filter(
          (order: IOrders) =>
            (order.fulfillmentStatus === 'pending' ||
              order.fulfillmentStatus === 'confirmed' ||
              order.fulfillmentStatus === 'processing' ||
              order.fulfillmentStatus === 'out_for_delivery') &&
            order.subscription?.status === 'active'
        )
        .sort((a: IOrders, b: IOrders) => b.id - a.id);
      setSaveOrders(orders);
    }
    getOrders();
  }, [token]);

  return (
    <div className="space-y-6">
      {saveOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {saveOrders.map((order: IOrders) => (
            <div
              className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
              key={order.id}
            >
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-6 sm:px-8">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Subscription ID</span>
                    <p className="text-lg font-black text-gray-900">#{order.id}</p>
                  </div>
                  <div className="mx-2 h-8 w-[1px] bg-gray-200" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Frequency</span>
                    <p className="text-sm font-bold text-blue-600 capitalize">{order.subscription.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold text-green-700 uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  Active Sub
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-500">Next Delivery</p>
                      <p className="font-bold text-gray-900">
                        {new Date(order.subscription.nextRunAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500">Method</p>
                      <p className="font-bold text-gray-900 uppercase">{order.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {order.subOrders[0].items.map((item: Item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100">
                          <Image
                            fill
                            className="object-cover"
                            src={
                              item.product?.images?.[0]?.url
                                ? `https://prism.devfolio.net${item.product?.images?.[0]?.url}`
                                : IMAGE_PLACEHOLDER
                            }
                            alt={item.product.title}
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{item.product.title}</h4>
                          <p className="text-xs text-gray-500">{order.subOrders[0].vendor.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-gray-50 p-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold">
                        {order.subtotal} {order.currencySnapshot.code}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span className="font-bold">
                        {order.deliveryFee} {order.currencySnapshot.code}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-gray-200 pt-2">
                      <span className="font-bold">Total Due</span>
                      <span className="text-xl font-black text-gray-900">
                        {order.amountDue} {order.currencySnapshot.code}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      className="rounded-full bg-red-50 px-6 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white"
                      onClick={() => {
                        setOpen(true);
                        setOrderIDD(order.id);
                      }}
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              </div>

              {order.id === orderIDD && (
                <Dialog open={open} onClose={setOpen} className="relative z-50">
                  <DialogBackdrop transition className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
                  <div className="fixed inset-0 z-10 flex w-screen items-center justify-center overflow-y-auto p-4">
                    <DialogPanel
                      transition
                      className="relative w-full transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all sm:max-w-md"
                    >
                      <div className="text-center sm:text-left">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 sm:mx-0">
                          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle as="h3" className="text-xl font-bold text-gray-900">
                          Cancel Subscription
                        </DialogTitle>
                        <p className="mt-2 text-sm text-gray-500">
                          Are you sure? This will stop all future automatic orders for this subscription.
                        </p>
                      </div>
                      <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
                        <button
                          className="rounded-full bg-red-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-red-700"
                          onClick={() => {
                            setOpen(false);
                            cancelOrder(order.documentId);
                          }}
                        >
                          Yes, Cancel
                        </button>
                        <button
                          className="rounded-full border border-gray-200 bg-white px-8 py-3 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50"
                          onClick={() => setOpen(false)}
                        >
                          Keep it
                        </button>
                      </div>
                    </DialogPanel>
                  </div>
                </Dialog>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-400">No active subscriptions</h2>
          <Button
            className="mt-6 rounded-full px-8 py-4 font-bold transition-transform hover:scale-105 active:scale-95"
            onClick={() => router.push('/')}
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
}
