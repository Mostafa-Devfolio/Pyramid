'use client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { IOrders, Item } from '../interface/orders';
import { IMAGE_PLACEHOLDER } from '@/lib/image';

export default function Processing() {
  const [saveOrders, setSaveOrders] = useState<IOrders[]>([]);
  const { auth, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [orderIDD, setOrderIDD] = useState(0);
  const router = useRouter();

  async function getOrder() {
    if (!token) return;
    const data = await getClass.getOrders(token);
    const orders = data
      .filter((order: IOrders) =>
        ['pending', 'confirmed', 'processing', 'out_for_delivery'].includes(order.fulfillmentStatus)
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
        .filter((order: IOrders) =>
          ['pending', 'confirmed', 'processing', 'out_for_delivery'].includes(order.fulfillmentStatus)
        )
        .sort((a: IOrders, b: IOrders) => b.id - a.id);
      setSaveOrders(orders);
    }
    getOrders();
  }, [token]);

  // Helper for nice status badges
  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-indigo-100 text-indigo-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      {saveOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {saveOrders.map((order: IOrders) => (
            <div
              className="flex flex-col rounded-3xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              key={order.id}
            >
              {/* Order Card Header */}
              <div className="flex items-center justify-between border-b border-gray-100 p-6 sm:p-8">
                <div>
                  <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase">Order ID</h3>
                  <p className="text-xl font-black text-gray-900">#{order.id}</p>
                </div>
                <div
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase ${getStatusBadge(order.fulfillmentStatus)}`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-50"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-current"></span>
                  </span>
                  {order.fulfillmentStatus.replace('_', ' ')}
                </div>
              </div>

              {/* Order Card Body */}
              <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-2">
                {/* Left Column: Details & Items */}
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-500">Payment Method</p>
                      <p className="font-bold text-gray-900 uppercase">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500">Payment Status</p>
                      <p
                        className={`font-bold capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-500'}`}
                      >
                        {order.paymentStatus}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold text-gray-500">Delivery Timing</p>
                      <p className="font-bold text-gray-900 capitalize">{order.deliveryTimingType.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  <div>
                    <h4 className="mb-4 text-sm font-bold text-gray-900">Items in this order</h4>
                    <div className="flex flex-col gap-4">
                      {order.subOrders?.[0]?.items?.map((item: Item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                            <Image
                              fill
                              className="object-cover"
                              src={
                                item.product?.images?.[0]?.url
                                  ? `https://pyramids.devfolio.net${item.product?.images?.[0]?.url}`
                                  : IMAGE_PLACEHOLDER
                              }
                              alt={item.product?.title ?? 'Product'}
                            />
                          </div>
                          <div className="flex flex-1 flex-col">
                            <h5 className="line-clamp-1 font-bold text-gray-900">{item.product.title}</h5>
                            <p className="text-xs font-medium text-gray-500">{order.subOrders[0].vendor.name}</p>
                            <p className="mt-1 text-sm font-bold text-gray-900">
                              {item.variant
                                ? item.variant.salePrice || item.variant.price
                                : item.product.baseSalePrice || item.product.basePrice}{' '}
                              {order.currencySnapshot.code}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Financial Summary */}
                <div className="flex flex-col justify-between rounded-3xl border border-gray-100 bg-gray-50 p-6">
                  <div>
                    <h3 className="mb-4 text-lg font-bold text-gray-900">Order Summary</h3>
                    <div className="space-y-3 text-sm font-medium text-gray-600">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-bold text-gray-900">
                          {order.subtotal} {order.currencySnapshot.code}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="font-bold text-gray-900">
                          {order.deliveryFee} {order.currencySnapshot.code}
                        </span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span className="font-bold">
                            -{order.discount} {order.currencySnapshot.code}
                          </span>
                        </div>
                      )}
                      {order.tipAmount > 0 && (
                        <div className="flex justify-between">
                          <span>Driver Tip</span>
                          <span className="font-bold text-gray-900">
                            {order.tipAmount} {order.currencySnapshot.code}
                          </span>
                        </div>
                      )}
                      {order.walletUsedAmount > 0 && (
                        <div className="flex justify-between text-blue-600">
                          <span>Wallet Deduction</span>
                          <span className="font-bold">
                            -{order.walletUsedAmount} {order.currencySnapshot.code}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                      <span className="text-base font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-black text-gray-900">
                        {order.amountDue} {order.currencySnapshot.code}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      className="rounded-full border-2 border-red-100 bg-red-50 px-6 py-2.5 text-sm font-bold text-red-600 transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white active:scale-95"
                      onClick={() => {
                        setOpen(true);
                        setOrderIDD(order.id);
                      }}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              </div>

              {/* Headless UI Cancel Modal */}
              {order.id === orderIDD && (
                <Dialog open={open} onClose={setOpen} className="relative z-50">
                  <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200"
                  />
                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                      <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all data-closed:translate-y-4 data-closed:opacity-0 sm:my-8 sm:w-full sm:max-w-md data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                      >
                        <div className="bg-white px-6 pt-8 pb-6 sm:p-8 sm:pb-6">
                          <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-50 sm:mx-0 sm:h-12 sm:w-12">
                              <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="mt-4 text-center sm:mt-0 sm:ml-4 sm:text-left">
                              <DialogTitle as="h3" className="text-xl font-bold text-gray-900">
                                Cancel Order #{order.id}
                              </DialogTitle>
                              <div className="mt-2">
                                <p className="text-sm leading-relaxed font-medium text-gray-500">
                                  Are you sure you want to cancel this order? This action cannot be undone and any paid
                                  amount will be refunded according to our policy.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse sm:px-8">
                          <button
                            type="button"
                            onClick={() => {
                              setOpen(false);
                              cancelOrder(order.documentId);
                            }}
                            className="inline-flex w-full justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-red-500 sm:ml-3 sm:w-auto"
                          >
                            Yes, Cancel it
                          </button>
                          <button
                            type="button"
                            data-autofocus
                            onClick={() => setOpen(false)}
                            className="mt-3 inline-flex w-full justify-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-900 shadow-sm transition-colors hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          >
                            No, Keep it
                          </button>
                        </div>
                      </DialogPanel>
                    </div>
                  </div>
                </Dialog>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-4 py-24 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-gray-400">
            <i className="fa-solid fa-box-open text-3xl"></i>
          </div>
          <h2 className="mb-2 text-2xl font-extrabold text-gray-900">No Active Orders</h2>
          <p className="mb-6 max-w-sm text-sm font-medium text-gray-500">
            You don&apos;t have any processing orders right now. Want to explore some products?
          </p>
          <Button
            className="rounded-full px-8 py-4 font-bold transition-transform hover:scale-105 active:scale-95"
            onClick={() => router.push('/')}
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
}
