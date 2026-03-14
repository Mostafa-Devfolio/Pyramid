export default function VendorPageSkeleton() {
  return (
    // Added animate-pulse here so the entire page softly flashes
    <div className="animate-pulse">
      {/* 1. VENDOR INFO HEADER (Matches the dark gray bar) */}
      <div className="container mx-auto mb-3 grid cursor-default grid-cols-1 rounded-br-2xl rounded-bl-2xl border-b bg-gray-800 p-3 text-white md:flex md:items-center md:gap-4">
        {/* Vendor Name Placeholder */}
        <div className="mx-auto h-8 w-48 rounded bg-gray-600 md:mx-0 md:w-64"></div>

        {/* Vendor Details Grid */}
        <div className="mt-3 grid grid-cols-2 gap-3 md:mt-0 md:flex md:w-full md:justify-between">
          <div className="h-5 w-16 rounded bg-gray-600"></div> {/* Rating */}
          <div className="h-5 w-32 rounded bg-gray-600"></div> {/* Delivery Time */}
          <div className="h-5 w-32 rounded bg-gray-600"></div> {/* Delivery Fee */}
          <div className="h-5 w-24 rounded bg-gray-600"></div> {/* Status */}
        </div>
      </div>

      {/* 2. MAIN LAYOUT GRID */}
      <div className="container mx-auto grid grid-cols-1 gap-3 sm:grid-cols-4">
        {/* LEFT COLUMN: CATEGORIES SIDEBAR */}
        <div className="rounded-2xl border p-4 sm:col-span-1">
          <div className="mb-4 h-6 w-32 rounded bg-gray-300"></div> {/* "Categories" Title */}
          {/* List of Category Placeholders */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="mb-1 h-11 w-full rounded-2xl bg-gray-200"></div>
          ))}
        </div>

        {/* RIGHT COLUMN: MAIN CONTENT AREA */}
        <div className="px-3 sm:col-span-3">
          {/* Banner / Carousel Placeholder */}
          <div className="mx-auto mb-3">
            <div className="flex aspect-[3/2] h-64 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-200"></div>
          </div>
          {/* Coupons Placeholder */}
          <div className="mb-4 grid grid-cols-1 gap-2 sm:flex">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 w-full rounded-2xl bg-gray-200 p-5 sm:w-72"></div>
            ))}
          </div>
          {/* Sub-Categories */}
          <div className="mt-2 h-6 w-36 rounded bg-gray-300"></div>
          <div className="my-4 flex gap-5 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-28 rounded-2xl bg-gray-200"></div>
            ))}
          </div>
          {/* Standard Products Grid */}
          <div className="mb-3 h-6 w-24 rounded bg-gray-300"></div> {/* "Products" Title */}
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="relative flex flex-col items-center gap-2 text-center">
                {/* Image */}
                <div className="aspect-square w-full rounded-2xl bg-gray-200"></div>
                {/* Favorite Icon Placeholder */}
                <div className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-300"></div>
                {/* Title & Price */}
                <div className="mt-1 h-5 w-3/4 rounded bg-gray-300"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
          {/* Discounted Products Grid */}
          <div className="my-3 mt-8 h-6 w-48 rounded bg-gray-300"></div> {/* "Discounted Products" Title */}
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative flex flex-col items-center gap-2 text-center">
                {/* Image */}
                <div className="aspect-square w-full rounded-2xl bg-gray-200"></div>
                {/* Favorite Icon Placeholder */}
                <div className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-300"></div>
                {/* Title & Price */}
                <div className="mt-1 h-5 w-3/4 rounded bg-gray-300"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
