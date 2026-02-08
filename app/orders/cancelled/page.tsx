'use client';
import { Button } from '@/components/ui/button';
import { authContext } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

export default function Cancelled() {
  const [saveOrders, setSaveOrders] = useState([]);
  const { auth, token } = useContext(authContext);
  const router = useRouter();
  async function getOrder() {
    const data = await getClass.getOrders(token);
    console.log('data', data);

    const orders = data
      .filter(
        (order: any) =>
          order.fulfillmentStatus === 'cancelled' ||
          order.fulfillmentStatus === 'returned' ||
          order.fulfillmentStatus === 'returned'
      )
      .sort((a: any, b: any) => b.id - a.id);
    setSaveOrders(orders);
    console.log('Helllo', orders);
  }

  useEffect(() => {
    getOrder();
  }, []);
  return (
    <div>
      {saveOrders.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-3">
          {saveOrders.map((order: any) => {
            return (
              <div key={order.id} className="rounded border stroke-1 p-3">
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
                    <div className="mt-2 border-b"></div>
                    <h4 className="mt-1">
                      Total: {order.total} {order.currencySnapshot.code}
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
                  <h2 className="my-4">Products</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {order.subOrders[0].items.map((item: any) => {
                      return (
                        <div key={item.id} className="flex">
                          <Image
                            className="w-[100px]"
                            height={500}
                            width={500}
                            src={item.product?.images?.[0]?.url}
                            alt={order}
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
