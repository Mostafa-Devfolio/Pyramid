'use client';
import { IOrders, Item } from '@/app/[locale]/interface/orders';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IMAGE_PLACEHOLDER } from '@/lib/image';

export default function Cancelled() {
  const [saveOrders, setSaveOrders] = useState<IOrders[]>([]);
  const { auth, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function getOrder() {
      if (!token) return;
      const data = await getClass.getOrders(token);
      const orders = data
        .filter((order: IOrders) => ['cancelled', 'returned'].includes(order.fulfillmentStatus))
        .sort((a: IOrders, b: IOrders) => b.id - a.id);
      setSaveOrders(orders);
    }
    getOrder();
  }, [token]);

  return (
    <div className="space-y-6">
      {saveOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {saveOrders.map((order: IOrders) => (
            <div
              key={order.id}
              className="group flex flex-col rounded-3xl border border-gray-100 bg-white opacity-80 shadow-sm transition-all hover:opacity-100"
            >
              <div className="flex items-center justify-between border-b border-gray-100 p-6 sm:px-8">
                <div>
                  <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Cancelled Order</span>
                  <p className="text-lg font-black text-gray-900">#{order.id}</p>
                </div>
                <div className="rounded-full bg-red-50 px-4 py-1.5 text-xs font-bold text-red-600 uppercase">
                  {order.fulfillmentStatus}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                    <p className="text-gray-500">
                      Method: <span className="text-gray-900 uppercase">{order.paymentMethod}</span>
                    </p>
                    <p className="text-gray-500">
                      Delivery: <span className="text-gray-900 capitalize">{order.deliveryTimingType}</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    {order.subOrders[0].items.map((item: Item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 grayscale">
                          <Image
                            fill
                            className="object-cover"
                            src={
                              item.product?.images?.[0]?.url
                                ? `https://pyramids.devfolio.net${item.product?.images?.[0]?.url}`
                                : IMAGE_PLACEHOLDER
                            }
                            alt="Cancelled Product"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h4 className="line-clamp-1 text-sm font-bold text-gray-900">{item.product.title}</h4>
                          <p className="text-xs text-gray-400">{order.subOrders[0].vendor.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                  <h3 className="mb-4 text-sm font-bold text-gray-900">Financial Summary</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>
                        {order.subtotal} {order.currencySnapshot.code}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fee</span>
                      <span>
                        {order.deliveryFee} {order.currencySnapshot.code}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between border-t pt-2 font-bold text-gray-900">
                      <span>Total</span>
                      <span>
                        {order.amountDue} {order.currencySnapshot.code}
                      </span>
                    </div>
                  </div>
                  {order.fulfillmentStatus === 'returned' && (
                    <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-3 text-xs font-bold text-green-700">
                      Refunded to your wallet successfully.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-400">No cancelled orders</h2>
          <Button
            className="mt-6 rounded-full px-8 py-4 font-bold transition-transform hover:scale-105 active:scale-95"
            onClick={() => router.push('/')}
          >
            Shop Now
          </Button>
        </div>
      )}
    </div>
  );
}
