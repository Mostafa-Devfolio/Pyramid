'use client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { IOrders, Item } from '@/app/interface/orders';

export default function Subscription() {
  const [saveOrders, setSaveOrders] = useState<IOrders[]>([]);
  const { auth, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [orderIDD, setOrderIDD] = useState(0);
  const router = useRouter();
  async function getOrder() {
    if(!token) return;
    const data = await getClass.getOrders(token);
    const orders = data
      .filter(
        (order: IOrders) =>
          ((order.fulfillmentStatus === 'pending' ||
          order.fulfillmentStatus === 'confirmed' ||
          order.fulfillmentStatus === 'processing' ||
          order.fulfillmentStatus === 'out_for_delivery') && order.subscription?.status === "active")
      )
      .sort((a: IOrders, b: IOrders) => b.id - a.id);
    setSaveOrders(orders);
  }

  async function cancelOrder(orderId: string) {
    if(!token) return;
    const cancel = {
      status: 'cancelled',
      fulfillmentStatus: 'cancelled',
      paymentStatus: 'unpaid',
    };
    const data = await getClass.cancelOrder(orderId, cancel, token);
    getOrder();
  }

  useEffect(() => {
    async function getOrders() {
    if(!token) return;
    const data = await getClass.getOrders(token);
    const orders = data
      .filter(
        (order: IOrders) =>
          ((order.fulfillmentStatus === 'pending' ||
          order.fulfillmentStatus === 'confirmed' ||
          order.fulfillmentStatus === 'processing' ||
          order.fulfillmentStatus === 'out_for_delivery') && order.subscription?.status === "active")
      )
      .sort((a: IOrders, b: IOrders) => b.id - a.id);
    setSaveOrders(orders);
  }
    getOrders();
  }, [token]);
  return (
    <div>
      {saveOrders.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-3">
          {saveOrders.map((order: IOrders) => {
            return (
              <div className="rounded border stroke-1 p-3" key={order.id}>
                <div key={order.id} className="grid grid-cols-2 rounded p-4">
                  <div>
                    <h4>Order ID: {order.id}</h4>
                    <h4>Order Status: {order.fulfillmentStatus}</h4>
                    <h4>Payment Method: {order.paymentMethod}</h4>
                    <h4>Payment Status: {order.paymentStatus}</h4>
                    <h4>Delivery Time: {order.deliveryTimingType}</h4>
                    <h4>Order Subscription Frequency: {order.subscription.frequency}</h4>
                    <h4>Order Subscription Next Time: {order.subscription.nextRunAt}</h4>
                  </div>
                  <div className="mt-3 text-green-600">
                    <h3 className="text-black">Summary</h3>
                    <h4>
                      Subtotal: {order.subtotal} {order.currencySnapshot.code}
                    </h4>
                    <h4>
                      Delivery Fee: {order.deliveryFee} {order.currencySnapshot.code}
                    </h4>
                    <h4>
                      Discount: {order.discount} {order.currencySnapshot.code}
                    </h4>
                    <h4>
                      Driver Tip: {order.tipAmount} {order.currencySnapshot.code}
                    </h4>
                    {order.walletUsedAmount != 0 && <h4>
                      Wallet Used Amount: {order.walletUsedAmount} {order.currencySnapshot.code}
                    </h4>}
                    <div className="mt-2 border-b"></div>
                    <h4 className="mt-1">
                      Total: {order.amountDue} {order.currencySnapshot.code}
                    </h4>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      className="mt-3 cursor-pointer"
                      onClick={() => {
                        setOpen(true);
                        setOrderIDD(order.id);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  {order.id === orderIDD && (
                    <div>
                      <Dialog open={open} onClose={setOpen} className="relative z-10">
                        <DialogBackdrop
                          transition
                          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                              transition
                              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                            >
                              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                    <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                                  </div>
                                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                      Cancel your order
                                    </DialogTitle>
                                    <div className="mt-2">
                                      <p className="text-sm text-gray-500">
                                        Are you sure you want to cancel this order?
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpen(false);
                                    cancelOrder(order.documentId);
                                  }}
                                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  data-autofocus
                                  onClick={() => setOpen(false)}
                                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                  Keep it
                                </button>
                              </div>
                            </DialogPanel>
                          </div>
                        </div>
                      </Dialog>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="m-4">Products</h2>
                  <div className="grid grid-cols-2 gap-3 mx-4">
                    {order.subOrders[0].items.map((item: Item) => {
                      return (
                        <div key={item.id} className="flex">
                          <Image
                            className="w-[100px]"
                            height={500}
                            width={500}
                            src={item.product?.images?.[0]?.url}
                            alt={order.recipientName}
                          />
                          <div className="flex flex-col">
                            <h3>{item.product.title}</h3>
                            <p>{order.subOrders[0].vendor.name}</p>
                            {item.variant != null &&
                              (item.variant?.salePrice ? (
                                <h5>{item.variant?.salePrice}</h5>
                              ) : (
                                <h5>{item.variant?.price}</h5>
                              ))}
                            {item.variant == null &&
                              (item.product?.baseSalePrice ? (
                                <h5>{item.product?.baseSalePrice}</h5>
                              ) : (
                                <h5>{item.product?.basePrice}</h5>
                              ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center">
          <h1 className="my-3 text-center">No subscribed orders</h1>
          <Button className="cursor-pointer" onClick={() => router.push('/')}>
            Shop Now
          </Button>
        </div>
      )}
    </div>
  );
}
