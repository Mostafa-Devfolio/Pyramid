export default function HomeProductsMainSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="">
          <div className="my-3 flex animate-pulse flex-col rounded-2xl border shadow-lg">
            {/* IMAGE PLACEHOLDER */}
            <div className="relative aspect-square rounded-2xl bg-gray-200">
              {/* Favorite Button Placeholder */}
              <div className="absolute top-2 right-2">
                <div className="h-8 w-8 rounded-full bg-gray-300"></div>
              </div>

              {/* Top/Discount Badge Placeholder */}
              {/* Matching your custom w-15 and h-10 sizing */}
              <div className="absolute top-2 left-2 flex h-10 w-15 rounded-2xl bg-gray-300"></div>
            </div>

            {/* CONTENT PLACEHOLDER */}
            <div className="flex flex-col gap-3 p-5">
              {/* Rating / Review Count Placeholder */}
              <div className="h-4 w-12 rounded bg-gray-200"></div>

              {/* Product Title Placeholder (Made it a bit wider to mimic text) */}
              <div className="h-5 w-4/5 rounded bg-gray-300"></div>

              {/* Vendor Name Placeholder (text-[10px] size) */}
              <div className="h-3 w-2/5 rounded bg-gray-200"></div>

              {/* Brand Name Placeholder (text-[11px] size) */}
              <div className="h-3 w-1/3 rounded bg-gray-200"></div>

              {/* Price Placeholder */}
              <div className="mt-1 h-6 w-24 rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
