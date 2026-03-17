'use client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon, StarIcon } from '@heroicons/react/24/solid';
import { IOrders, Item } from '@/app/[locale]/interface/orders';
import { IMAGE_PLACEHOLDER } from '@/lib/image';

export default function Completed() {
  const [saveOrders, setSaveOrders] = useState<IOrders[]>([]);
  const { auth, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const router = useRouter();
  const [orderIDD, setOrderIDD] = useState(0);
  const [rate, setRate] = useState(-1);
  const [review, setReview] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<number | null>(null);
  const [isClicked, setIsClicked] = useState<number | null>(null);

  async function getOrder() {
    if (!token) return;
    const data = await getClass.getOrders(token);
    const orders = data
      .filter((order: IOrders) => ['delivered', 'returned', 'processing_return'].includes(order.fulfillmentStatus))
      .sort((a: IOrders, b: IOrders) => b.id - a.id);
    setSaveOrders(orders);
  }

  async function returnOrder(orderId: number) {
    if (!token) return;
    await getClass.returnRequest(orderId, { message: '<optional>', reason: '<optional>' }, token);
    getOrder();
  }

  async function rateReview(itemId: number, orderId: number) {
    if (!token) return;
    await getClass.postRateReview(token, { rating: rate, comment: review, product: itemId, order: orderId });
    getOrder();
  }

  async function rateReviewVendor(vendorId: number, orderId: number) {
    if (!token) return;
    await getClass.postRateReview(token, { rating: rate, comment: review, vendor: vendorId, order: orderId });
    getOrder();
  }

  async function updateRateReview(itemId: number, orderId: number, reviewId: number) {
    if (!token) return;
    await getClass.updateRateReview(
      token,
      { rating: rate, comment: review, product: itemId, order: orderId },
      reviewId
    );
    getOrder();
  }

  async function updateRateReviewVendor(vendorId: number, orderId: number, reviewId: number) {
    if (!token) return;
    await getClass.updateRateReview(
      token,
      { rating: rate, comment: review, vendor: vendorId, order: orderId },
      reviewId
    );
    getOrder();
  }

  useEffect(() => {
    async function getOrder2() {
      if (!token) return;
      const data = await getClass.getOrders(token);
      const orders = data
        .filter((order: IOrders) => ['delivered', 'returned', 'processing_return'].includes(order.fulfillmentStatus))
        .sort((a: IOrders, b: IOrders) => b.id - a.id);
      setSaveOrders(orders);
    }
    getOrder2();
  }, [token]);

  return (
    <div className="space-y-6">
      {saveOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {saveOrders.map((order: IOrders) => (
            <div
              key={order.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-gray-100 bg-gray-50/20 p-6 sm:px-8">
                <div className="flex gap-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Order ID</span>
                    <p className="text-lg font-black text-gray-900">#{order.id}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Completed On</span>
                    <p className="text-sm font-bold text-gray-900">{new Date(order.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase ${order.fulfillmentStatus === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                >
                  {order.fulfillmentStatus.replace('_', ' ')}
                </div>
              </div>

              {/* Grid Body */}
              <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-2">
                {/* Items & Actions */}
                <div className="space-y-8">
                  <div className="space-y-6">
                    {order.subOrders[0].items.map((item: Item) => (
                      <div key={item.id} className="space-y-4 rounded-2xl border border-gray-50 bg-gray-50/50 p-4">
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white shadow-sm">
                            <Image
                              fill
                              className="object-cover"
                              src={
                                item.product?.images?.[0]?.url
                                  ? `https://pyramids.devfolio.net${item.product?.images?.[0]?.url}`
                                  : IMAGE_PLACEHOLDER
                              }
                              alt="Product"
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-center">
                            <h3 className="leading-tight font-bold text-gray-900">{item.product.title}</h3>
                            <p className="text-sm font-medium text-gray-500">{order.subOrders[0].vendor.name}</p>
                            <p className="mt-1 font-black text-gray-900">
                              {item.variant
                                ? item.variant.salePrice || item.variant.price
                                : item.product.baseSalePrice || item.product.basePrice}{' '}
                              {order.currencySnapshot.code}
                            </p>
                          </div>
                        </div>

                        {/* Item Review Logic */}
                        <div className="border-t border-gray-200/50 pt-2">
                          {item.alreadyReviewed === false ? (
                            <button
                              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-bold text-gray-700 transition-all hover:border-black"
                              onClick={() => {
                                setIsReviewing(true);
                                setCurrentOrder(order.id);
                                setIsClicked(item.product.id);
                                setOpenReview(true);
                              }}
                            >
                              Rate Product
                            </button>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex gap-0.5 text-yellow-400">
                                  {[...Array(item.userReview.rating)].map((_, i) => (
                                    <StarIcon key={i} className="h-4 w-4" />
                                  ))}
                                </div>
                                <span className="text-xs font-bold text-gray-400">Review:</span>
                                <p className="line-clamp-1 text-xs font-medium text-gray-600">
                                  {item.userReview.comment}
                                </p>
                              </div>
                              <button
                                className="text-xs font-bold text-blue-600 hover:underline"
                                onClick={() => {
                                  setIsReviewing(true);
                                  setCurrentOrder(order.id);
                                  setIsClicked(item.product.id);
                                  setOpenReview(true);
                                  setRate(item.userReview.rating);
                                  setReview(item.userReview.comment);
                                }}
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vendor Review */}
                  <div className="rounded-2xl border-2 border-dashed border-gray-100 p-6 text-center">
                    <h3 className="mb-3 text-sm font-bold tracking-wider text-gray-500 uppercase">
                      Vendor: {order.subOrders[0].vendor.name}
                    </h3>
                    {order.subOrders[0].alreadyReviewed === false ? (
                      <button
                        className="rounded-full bg-black px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-transform active:scale-95"
                        onClick={() => {
                          setIsReviewing(true);
                          setCurrentOrder(order.id);
                          setIsClicked(order.subOrders[0].vendor.id);
                          setOpenReview(true);
                        }}
                      >
                        Rate Vendor
                      </button>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-0.5 text-yellow-400">
                          {[...Array(order.subOrders[0].userReview.rating)].map((_, i) => (
                            <StarIcon key={i} className="h-5 w-5" />
                          ))}
                        </div>
                        <button
                          className="text-xs font-bold text-blue-600"
                          onClick={() => {
                            setIsReviewing(true);
                            setCurrentOrder(order.id);
                            setIsClicked(order.subOrders[0].vendor.id);
                            setOpenReview(true);
                            setRate(order.subOrders[0].userReview.rating);
                            setReview(order.subOrders[0].userReview.comment);
                          }}
                        >
                          Edit Vendor Review
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column Summary */}
                <div className="space-y-6">
                  <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
                    <h3 className="mb-6 text-xl font-bold">Payment Summary</h3>
                    <div className="space-y-3 text-sm text-slate-400">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-bold text-white">
                          {order.subtotal} {order.currencySnapshot.code}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fee</span>
                        <span className="font-bold text-white">
                          {order.deliveryFee} {order.currencySnapshot.code}
                        </span>
                      </div>
                      <div className="mt-4 flex justify-between border-t border-slate-800 pt-4">
                        <span className="text-lg font-bold">Total Paid</span>
                        <span className="text-2xl font-black text-white">
                          {order.amountDue} {order.currencySnapshot.code}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.returnRequested === false ? (
                      <button
                        className="w-full rounded-2xl border-2 border-gray-100 py-4 text-sm font-bold text-gray-500 transition-all hover:bg-gray-50"
                        onClick={() => {
                          setOpen(true);
                          setOrderIDD(order.id);
                        }}
                      >
                        Request a Return
                      </button>
                    ) : (
                      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                        <p className="mb-1 text-xs font-bold tracking-widest text-blue-900 uppercase">Return Status</p>
                        <p className="text-sm font-bold text-blue-700">
                          {order.fulfillmentStatus === 'delivered' && 'Step 1: Request Received'}
                          {order.fulfillmentStatus === 'processing_return' && 'Step 2: Processing Return'}
                          {order.fulfillmentStatus === 'returned' && 'Final Step: Order Returned & Wallet Refunded'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Combined Review Modal */}
              <Dialog open={openReview} onClose={setOpenReview} className="relative z-50">
                <DialogBackdrop transition className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
                <div className="fixed inset-0 z-10 flex w-screen items-center justify-center overflow-y-auto p-4">
                  <DialogPanel className="relative w-full transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all sm:max-w-md">
                    <DialogTitle as="h3" className="mb-6 text-2xl font-black text-gray-900">
                      Leave your rating
                    </DialogTitle>
                    <div className="space-y-6">
                      <div>
                        <label className="mb-2 block text-xs font-bold text-gray-400 uppercase">
                          Star Rating (1-5)
                        </label>
                        <input
                          type="number"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-bold outline-none focus:border-black"
                          value={rate}
                          onChange={(e) => setRate(Number(e.target.value))}
                          min={1}
                          max={5}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-bold text-gray-400 uppercase">Your Message</label>
                        <textarea
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-black"
                          rows={4}
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          placeholder="Tell us about your experience..."
                        />
                      </div>
                    </div>
                    <div className="mt-8 flex flex-col gap-3">
                      <button
                        className="w-full rounded-full bg-black py-4 font-bold text-white shadow-lg transition-transform active:scale-95"
                        onClick={() => {
                          if (isClicked === order.subOrders[0].vendor.id) {
                            order.subOrders[0].alreadyReviewed
                              ? updateRateReviewVendor(
                                  order.subOrders[0].vendor.id,
                                  order.id,
                                  order.subOrders[0].userReview.id
                                )
                              : rateReviewVendor(order.subOrders[0].vendor.id, order.id);
                          } else {
                            const item = order.subOrders[0].items.find((i) => i.product.id === isClicked);
                            item?.alreadyReviewed
                              ? updateRateReview(isClicked!, order.id, item.userReview.id)
                              : rateReview(isClicked!, order.id);
                          }
                          setOpenReview(false);
                          setIsReviewing(false);
                        }}
                      >
                        Submit Review
                      </button>
                      <button
                        className="w-full py-2 text-sm font-bold text-gray-400"
                        onClick={() => {
                          setOpenReview(false);
                          setIsReviewing(false);
                        }}
                      >
                        Discard
                      </button>
                    </div>
                  </DialogPanel>
                </div>
              </Dialog>

              {/* Return Modal Code exactly like other pages... */}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-400">No completed orders</h2>
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
