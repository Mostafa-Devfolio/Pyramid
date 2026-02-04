"use client"
import { Button } from '@/components/ui/button';
import { authContext } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function Completed() {
    const [saveOrders, setSaveOrders] = useState([]);
    const {auth, token} = useContext(authContext);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [orderIDD, setOrderIDD] = useState(0);
    const [dialog, setDialog] = useState(false);
    const [isReturn, setIsReturn] = useState(false);
    async function getOrder(){
        const data = await getClass.getOrders(token);
        
        const orders = data.filter((order: any) => order.fulfillmentStatus === "delivered" || order.fulfillmentStatus === "returned" || order.fulfillmentStatus === "processing_return");
        setSaveOrders(orders);
        console.log('Helllo',orders);
    }
    
    async function returnOrder(orderId: number) {
      const body = {
        "message": "<optional>",
        "reason": "<optional>"
      }
      const data = await getClass.returnRequest(orderId, body, token);
      console.log(data);
    }

    async function refund(orderId: number){
      const body = {
        "message": "<optional>",
        "reason": "<optional>"
      }
      const data = await getClass.refundRequest(orderId, body, token);
      console.log(data);
    }

    useEffect(() => {
        getOrder();
    },[]);
  return (
    <div>
        {saveOrders.length > 0 ? <div className="mt-3 grid grid-cols-1 gap-3">
            {saveOrders.map((order: any) => {
                return <div key={order.id} className="border stroke-1 p-3 rounded grid grid-cols-2">
                    <div>
                        <h4>Order ID: {order.id}</h4>
                        <h4>Order Status: {order.fulfillmentStatus}</h4>
                        <h4>Payment Method: {order.paymentMethod}</h4>
                        <h4>Payment Status: {order.paymentStatus}</h4>
                        <h4>Delivery Time: {order.deliveryTimingType}</h4>
                        <h4 className='my-2'>Products</h4>
                        {order.subOrders[0].items.map((item: any) => {
                            return <div key={item.id} className="flex">
                                <Image className='w-[100px]' height={500} width={500} src={item.product?.images?.[0]?.url} alt={order}/>
                                <div className='flex flex-col'>
                                    <h3>{item.product.title}</h3>
                                    <p>{order.subOrders[0].vendor.name}</p>
                                    {item.variant != null && (item.variant?.salePrice ? <h5>{item.variant?.salePrice}</h5> : <h5>{item.variant?.price}</h5>)}
                                    {item.variant == null && (item.product?.baseSalePrice ? <h5>{item.product?.baseSalePrice}</h5> : <h5>{item.product?.basePrice}</h5>)}
                                </div>
                            </div>
                        })}
                        {(open && order.returnRequested == false && order.id === orderIDD) && <div>
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
                      <textarea id='message' className='w-[100%] border stroke-1 rounded p-1' rows={3} placeholder='Enter your message...'></textarea>
                      <label htmlFor="reason">Reason: </label>
                      <input type="text" id='reason' className='border stroke-1 rounded p-1' placeholder='Enter your reason...'/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {returnOrder(order.id); setOpen(false)}}
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
    </div>}
                    </div>
                    <div className='mt-3 text-green-600'>
                        <h3 className='text-black'>Summary</h3>
                        <h4>Subtotal: {order.subtotal} {order.currencySnapshot.code}</h4>
                        <h4>Delivery Fee: {order.deliveryFee} {order.currencySnapshot.code}</h4>
                        <h4>Discount: {order.discount} {order.currencySnapshot.code}</h4>
                        <div className="border-b mt-2"></div>
                        <h4 className='mt-1'>Total: {order.total} {order.currencySnapshot.code}</h4>
                    </div>
                    <div className='flex justify-end'>
                      {order.returnRequested === false && <Button className='cursor-pointer' onClick={() => {setOpen(true); setOrderIDD(order.id)}}>Return Request</Button>}
                      {order.returnRequested === true && order.fulfillmentStatus === "delivered" && <h2 className='text-center text-green-500'>Step 1: We have received your request. Our team will contact you shortly.</h2>}
                      {order.returnRequested === true && order.fulfillmentStatus === "processing_return" && <h2 className='text-center text-green-500'>Step 2: Return is in processing</h2>}
                      {order.returnRequested === true && order.fulfillmentStatus === "returned" && <h2 className='text-center text-green-500'>Final step: Your order is returned and the money is refunded to your wallet you can use it to buy any other thing.</h2>}
                    </div>
                </div>
            })}
        </div> : <div className='text-center'>
            <h1 className='text-center my-3'>No completed orders!</h1>
            <Button className='cursor-pointer' onClick={() => router.push('/')}>Shop Now</Button>
        </div>}
    </div>
  )
}
