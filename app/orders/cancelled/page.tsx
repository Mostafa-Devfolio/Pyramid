'use client';
import { IOrders, Item } from '@/app/interface/orders';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

export default function Cancelled() {
  const [saveOrders, setSaveOrders] = useState<IOrders[]>([]);
  const { auth, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function getOrder() {
      if (!token) return;
      const data = await getClass.getOrders(token);

      const orders = data
        .filter(
          (order: IOrders) =>
            order.fulfillmentStatus === 'cancelled' ||
            order.fulfillmentStatus === 'returned' ||
            order.fulfillmentStatus === 'returned'
        )
        .sort((a: IOrders, b: IOrders) => b.id - a.id);
      setSaveOrders(orders);
    }
    getOrder();
  }, [token]);
  return (
    <div>
      {saveOrders.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-3">
          {saveOrders.map((order: IOrders) => {
            return (
              <div key={order.id} className="rounded border stroke-1 p-4">
                <div className="grid grid-cols-2">
                  <div>
                    <h4>Order ID: {order.id}</h4>
                    <h4>Order Status: {order.fulfillmentStatus}</h4>
                    <h4>Payment Method: {order.paymentMethod}</h4>
                    <h4>Payment Status: {order.paymentStatus}</h4>
                    <h4>Delivery Time: {order.deliveryTimingType}</h4>
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
                    {order.walletUsedAmount != 0 && (
                      <h4>
                        Wallet Used Amount: {order.walletUsedAmount} {order.currencySnapshot.code}
                      </h4>
                    )}
                    <div className="mt-2 border-b"></div>
                    <h4 className="mt-1">
                      Total: {order.amountDue} {order.currencySnapshot.code}
                    </h4>
                  </div>
                  <div className="flex justify-end">
                    {order.returnRequested === true && order.fulfillmentStatus === 'returned' && (
                      <h2 className="text-center text-green-500">
                        Final step: Your order is returned and the money is refunded to your wallet you can use it to
                        buy any other thing.
                      </h2>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="m-4">Products</h2>
                  <div className="mx-4 grid grid-cols-2 gap-3">
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
          <h1 className="my-3 text-center">No cancelled orders!</h1>
          <Button className="cursor-pointer" onClick={() => router.push('/')}>
            Shop Now
          </Button>
        </div>
      )}
    </div>
  );
}
