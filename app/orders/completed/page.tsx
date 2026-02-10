'use client';
import { Button } from '@/components/ui/button';
import { authContext } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Completed() {
  const [saveOrders, setSaveOrders] = useState([]);
  const { auth, token } = useContext(authContext);
  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const router = useRouter();
  const [orderIDD, setOrderIDD] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [isReturn, setIsReturn] = useState(false);
  const [rate, setRate] = useState(-1);
  const [review, setReview] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<number | null>(null);
  const [isClicked, setIsClicked] = useState<number | null>(null);
  const [productIsReviewed, setProductIsReviewed] = useState(false);
  async function getOrder() {
    const data = await getClass.getOrders(token);

    const orders = data
      .filter(
        (order: any) =>
          order.fulfillmentStatus === 'delivered' ||
          order.fulfillmentStatus === 'returned' ||
          order.fulfillmentStatus === 'processing_return'
      )
      .sort((a: any, b: any) => b.id - a.id);
    setSaveOrders(orders);
    console.log('Helllo', orders);
  }

  async function returnOrder(orderId: number) {
    const body = {
      message: '<optional>',
      reason: '<optional>',
    };
    const data = await getClass.returnRequest(orderId, body, token);
    getOrder();
    console.log(data);
  }

  async function refund(orderId: number) {
    const body = {
      message: '<optional>',
      reason: '<optional>',
    };
    const data = await getClass.refundRequest(orderId, body, token);
    console.log(data);
  }

  async function getProductDetails(productIdd: number) {
    console.log(productIdd);
    const data = await getClass.getProductById(productIdd);
    setProductIsReviewed(data.data.reviews.length == 0);
  }

  async function rateReview(itemId: number, orderId: number) {
    const body = {
      rating: rate,
      comment: review,
      product: itemId,
      order: orderId,
    };
    const data = await getClass.postRateReview(token, body);
    getOrder();
  }
  async function rateReviewVendor(vendorId: number, orderId: number) {
    const body = {
      rating: rate,
      comment: review,
      vendor: vendorId,
      order: orderId,
    };
    const data = await getClass.postRateReview(token, body);
    getOrder();
  }
  async function updateRateReview(itemId: number, orderId: number, reviewId: number) {
    const body = {
      rating: rate,
      comment: review,
      product: itemId,
      order: orderId,
    };
    const data = await getClass.updateRateReview(token, body, reviewId);
    getOrder();
  }
  async function updateRateReviewVendor(vendorId: number, orderId: number, reviewId: number) {
    const body = {
      rating: rate,
      comment: review,
      vendor: vendorId,
      order: orderId,
    };
    const data = await getClass.updateRateReview(token, body, reviewId);
    getOrder();
  }

  useEffect(() => {
    getOrder();
  }, [token]);
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
                    {open && order.returnRequested == false && order.id === orderIDD && (
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
                                        Return and refund request
                                      </DialogTitle>
                                      <div className="mt-2">
                                        <label htmlFor="message">Message:</label>
                                        <textarea
                                          id="message"
                                          className="w-[100%] rounded border stroke-1 p-1"
                                          rows={3}
                                          placeholder="Enter your message..."
                                        ></textarea>
                                        <label htmlFor="reason">Reason: </label>
                                        <input
                                          type="text"
                                          id="reason"
                                          className="rounded border stroke-1 p-1"
                                          placeholder="Enter your reason..."
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      returnOrder(order.id);
                                      setOpen(false);
                                    }}
                                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
                                  >
                                    Submit
                                  </button>
                                  <button
                                    type="button"
                                    data-autofocus
                                    onClick={() => setOpen(false)}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </DialogPanel>
                            </div>
                          </div>
                        </Dialog>
                      </div>
                    )}
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
                    {order.returnRequested === false && (
                      <Button
                        className="cursor-pointer"
                        onClick={() => {
                          setOpen(true);
                          setOrderIDD(order.id);
                        }}
                      >
                        Return Request
                      </Button>
                    )}
                    {order.returnRequested === true && order.fulfillmentStatus === 'delivered' && (
                      <h2 className="text-center text-green-500">
                        Step 1: We have received your request. Our team will contact you shortly.
                      </h2>
                    )}
                    {order.returnRequested === true && order.fulfillmentStatus === 'processing_return' && (
                      <h2 className="text-center text-green-500">Step 2: Return is in processing</h2>
                    )}
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
                  <div className="grid grid-cols-2">
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
                          <div className="flex gap-10">
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
                            {order.subOrders[0].items.map((item: any) => {
                              return (
                                <div key={item.id} className="">
                                  {item.alreadyReviewed == false ? (
                                    <div>
                                      {!isReviewing && (
                                        <Button
                                          onClick={() => {
                                            setIsReviewing(!isReviewing);
                                            setCurrentOrder(order.id);
                                            setIsClicked(item.product.id);
                                            setOpenReview(true);
                                            getProductDetails(item.product.documentId);
                                          }}
                                        >
                                          Review and Rate
                                        </Button>
                                      )}
                                      {isReviewing &&
                                        isClicked === item.product.id &&
                                        order.id === currentOrder &&
                                        item.alreadyReviewed == false &&
                                        openReview == true && (
                                          <div>
                                            <Dialog open={openReview} onClose={setOpenReview} className="relative z-10">
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
                                                          <ExclamationTriangleIcon
                                                            aria-hidden="true"
                                                            className="size-6 text-red-600"
                                                          />
                                                        </div>
                                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                          <DialogTitle
                                                            as="h3"
                                                            className="text-base font-semibold text-gray-900"
                                                          >
                                                            Rate and review the product
                                                          </DialogTitle>
                                                          <div className="mt-2">
                                                            <label htmlFor="reason">Rate: </label>
                                                            <input
                                                              className="rounded-2xl border stroke-1 p-3"
                                                              onChange={(e) => setRate(e.target.value)}
                                                              type="number"
                                                              placeholder="Enter from 1 to 5"
                                                              min={1}
                                                              max={5}
                                                            />
                                                            <label htmlFor="message">Review:</label>
                                                            <textarea
                                                              id="message"
                                                              className="w-[100%] rounded border stroke-1 p-1"
                                                              onChange={(e) => setReview(e.target.value)}
                                                              rows={3}
                                                              placeholder="Enter your review..."
                                                            ></textarea>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          rateReview(item.product.id, order.id);
                                                          setIsReviewing(false);
                                                          setOpenReview(false);
                                                        }}
                                                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
                                                      >
                                                        Submit
                                                      </button>
                                                      <button
                                                        type="button"
                                                        data-autofocus
                                                        onClick={() => {
                                                          setOpenReview(false);
                                                          setIsReviewing(false);
                                                        }}
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                      >
                                                        Cancel
                                                      </button>
                                                    </div>
                                                  </DialogPanel>
                                                </div>
                                              </div>
                                            </Dialog>
                                          </div>
                                        )}
                                    </div>
                                  ) : (
                                    <div>
                                      {
                                        <div className="">
                                          <p>{'⭐'.repeat(item.userReview.rating)}</p>
                                          <p className="mb-3">Review: {item.userReview.comment}</p>
                                          <Button
                                            onClick={() => {
                                              setIsReviewing(!isReviewing);
                                              setCurrentOrder(order.id);
                                              setIsClicked(item.product.id);
                                              setOpenReview(true);
                                              getProductDetails(item.product.documentId);
                                              setRate(item.userReview.rating);
                                              setReview(item.userReview.comment);
                                            }}
                                          >
                                            Edit
                                          </Button>
                                          {order.id == currentOrder &&
                                            item.product.id == isClicked &&
                                            isReviewing == true && (
                                              <div>
                                                <Dialog
                                                  open={openReview}
                                                  onClose={setOpenReview}
                                                  className="relative z-10"
                                                >
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
                                                              <ExclamationTriangleIcon
                                                                aria-hidden="true"
                                                                className="size-6 text-red-600"
                                                              />
                                                            </div>
                                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                              <DialogTitle
                                                                as="h3"
                                                                className="text-base font-semibold text-gray-900"
                                                              >
                                                                Update Rate and review the product
                                                              </DialogTitle>
                                                              <div className="mt-2">
                                                                <label htmlFor="reason">Rate: </label>
                                                                <input
                                                                  className="rounded-2xl border stroke-1 p-3"
                                                                  onChange={(e) => setRate(e.target.value)}
                                                                  type="number"
                                                                  placeholder="Enter from 1 to 5"
                                                                  min={1}
                                                                  max={5}
                                                                  value={rate}
                                                                />
                                                                <label htmlFor="message">Review:</label>
                                                                <textarea
                                                                  id="message"
                                                                  className="w-[100%] rounded border stroke-1 p-1"
                                                                  onChange={(e) => setReview(e.target.value)}
                                                                  rows={3}
                                                                  value={review}
                                                                  placeholder="Enter your review..."
                                                                ></textarea>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                          <button
                                                            type="button"
                                                            onClick={() => {
                                                              updateRateReview(
                                                                item.product.id,
                                                                order.id,
                                                                item.userReview.id
                                                              );
                                                              setIsReviewing(false);
                                                              setOpenReview(false);
                                                            }}
                                                            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
                                                          >
                                                            Submit
                                                          </button>
                                                          <button
                                                            type="button"
                                                            data-autofocus
                                                            onClick={() => {
                                                              setOpenReview(false);
                                                              setIsReviewing(false);
                                                            }}
                                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                          >
                                                            Cancel
                                                          </button>
                                                        </div>
                                                      </DialogPanel>
                                                    </div>
                                                  </div>
                                                </Dialog>
                                              </div>
                                            )}
                                        </div>
                                      }
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="">
                  <h2>{order.subOrders[0].vendor.name}</h2>
                  {order.subOrders[0].alreadyReviewed == false ? (
                    <div>
                      {!isReviewing && (
                        <Button
                          onClick={() => {
                            setIsReviewing(!isReviewing);
                            setCurrentOrder(order.id);
                            setIsClicked(order.subOrders[0].vendor.id);
                            setOpenReview(true);
                          }}
                        >
                          Review and rate the vendor
                        </Button>
                      )}
                      {isReviewing &&
                        isClicked === order.subOrders[0].vendor.id &&
                        order.id === currentOrder &&
                        openReview == true && (
                          <div>
                            <Dialog open={openReview} onClose={setOpenReview} className="relative z-10">
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
                                            Rate and review the vendor
                                          </DialogTitle>
                                          <div className="mt-2">
                                            <label htmlFor="reason">Rate: </label>
                                            <input
                                              className="rounded-2xl border stroke-1 p-3"
                                              onChange={(e) => setRate(e.target.value)}
                                              type="number"
                                              placeholder="Enter from 1 to 5"
                                              min={1}
                                              max={5}
                                            />
                                            <label htmlFor="message">Review:</label>
                                            <textarea
                                              id="message"
                                              className="w-[100%] rounded border stroke-1 p-1"
                                              onChange={(e) => setReview(e.target.value)}
                                              rows={3}
                                              placeholder="Enter your review..."
                                            ></textarea>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          rateReviewVendor(order.subOrders[0].vendor.id, order.id);
                                          setIsReviewing(false);
                                          setOpenReview(false);
                                        }}
                                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
                                      >
                                        Submit
                                      </button>
                                      <button
                                        type="button"
                                        data-autofocus
                                        onClick={() => {
                                          setOpenReview(false);
                                          setIsReviewing(false);
                                        }}
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </DialogPanel>
                                </div>
                              </div>
                            </Dialog>
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="">
                      <p>{'⭐'.repeat(order.subOrders[0].userReview.rating)}</p>
                      <p className="mb-3">Review: {order.subOrders[0].userReview.comment}</p>
                      <Button
                        onClick={() => {
                          setIsReviewing(!isReviewing);
                          setCurrentOrder(order.id);
                          setIsClicked(order.subOrders[0].vendor.id);
                          setOpenReview(true);
                          setRate(order.subOrders[0].userReview.rating);
                          setReview(order.subOrders[0].userReview.comment);
                        }}
                      >
                        Edit
                      </Button>
                      {order.id == currentOrder && order.subOrders[0].vendor.id == isClicked && isReviewing == true && (
                        <div>
                          <Dialog open={openReview} onClose={setOpenReview} className="relative z-10">
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
                                          Update Rate and review the vendor
                                        </DialogTitle>
                                        <div className="mt-2">
                                          <label htmlFor="reason">Rate: </label>
                                          <input
                                            className="rounded-2xl border stroke-1 p-3"
                                            onChange={(e) => setRate(e.target.value)}
                                            type="number"
                                            placeholder="Enter from 1 to 5"
                                            min={1}
                                            max={5}
                                            value={rate}
                                          />
                                          <label htmlFor="message">Review:</label>
                                          <textarea
                                            id="message"
                                            className="w-[100%] rounded border stroke-1 p-1"
                                            onChange={(e) => setReview(e.target.value)}
                                            rows={3}
                                            value={review}
                                            placeholder="Enter your review..."
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateRateReviewVendor(
                                          order.subOrders[0].vendor.id,
                                          order.id,
                                          order.subOrders[0].userReview.id
                                        );
                                        setIsReviewing(false);
                                        setOpenReview(false);
                                      }}
                                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
                                    >
                                      Submit
                                    </button>
                                    <button
                                      type="button"
                                      data-autofocus
                                      onClick={() => {
                                        setOpenReview(false);
                                        setIsReviewing(false);
                                      }}
                                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </DialogPanel>
                              </div>
                            </div>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center">
          <h1 className="my-3 text-center">No completed orders!</h1>
          <Button className="cursor-pointer" onClick={() => router.push('/')}>
            Shop Now
          </Button>
        </div>
      )}
    </div>
  );
}
