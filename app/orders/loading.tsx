export default function OrdersSkeleton() {
  return (
    // Wrapper matching your active orders grid, adding animate-pulse
    <div className="mt-3 grid animate-pulse grid-cols-1 gap-3">
      {/* Simulating 2 processing orders loading in */}
      {[1, 2].map((i) => (
        <div key={i} className="rounded border stroke-1 p-3">
          {/* Top Half: Order Details & Summary */}
          <div className="grid grid-cols-1 gap-4 rounded p-4 sm:grid-cols-2">
            {/* Left: Order Info */}
            <div className="flex flex-col gap-2">
              <div className="h-5 w-40 rounded bg-gray-300"></div> {/* Order ID */}
              <div className="h-4 w-48 rounded bg-gray-200"></div> {/* Status */}
              <div className="h-4 w-48 rounded bg-gray-200"></div> {/* Payment Method */}
              <div className="h-4 w-40 rounded bg-gray-200"></div> {/* Payment Status */}
              <div className="h-4 w-48 rounded bg-gray-200"></div> {/* Delivery Time */}
            </div>

            {/* Right: Summary */}
            <div className="mt-3 flex flex-col gap-2 sm:mt-0">
              <div className="mb-1 h-5 w-24 rounded bg-gray-300"></div> {/* "Summary" */}
              <div className="h-4 w-32 rounded bg-gray-200"></div> {/* Subtotal */}
              <div className="h-4 w-32 rounded bg-gray-200"></div> {/* Delivery Fee */}
              <div className="h-4 w-28 rounded bg-gray-200"></div> {/* Discount */}
              <div className="h-4 w-28 rounded bg-gray-200"></div> {/* Driver Tip */}
              <div className="mt-2 border-b"></div>
              <div className="mt-1 h-5 w-32 rounded bg-gray-300"></div> {/* Total */}
              {/* Cancel Button Placeholder */}
              <div className="mt-2 flex justify-end">
                <div className="h-10 w-20 rounded-md bg-gray-300"></div>
              </div>
            </div>
          </div>

          {/* Bottom Half: Products */}
          <div>
            <div className="m-4 h-6 w-24 rounded bg-gray-300"></div> {/* "Products" Title */}
            <div className="mx-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[1, 2].map((j) => (
                <div key={j} className="flex gap-3">
                  {/* Product Image */}
                  {/* Matching the w-30 (which is 120px) rounded-md */}
                  <div className="h-24 w-[120px] shrink-0 rounded-md bg-gray-200"></div>

                  {/* Product Info */}
                  <div className="flex w-full flex-col gap-2 py-1">
                    <div className="h-5 w-3/4 rounded bg-gray-300"></div> {/* Title */}
                    <div className="h-4 w-1/2 rounded bg-gray-200"></div> {/* Vendor */}
                    <div className="h-4 w-1/3 rounded bg-gray-300"></div> {/* Price */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
