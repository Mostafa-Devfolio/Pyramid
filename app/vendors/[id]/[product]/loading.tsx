export default function ProductPageSkeleton() {
  return (
    // Main wrapper matching your product page container with animate-pulse
    <div className="container mx-auto my-4 animate-pulse">
      {/* 1. BREADCRUMBS SKELETON */}
      <div className="flex items-center gap-4">
        <div className="h-4 w-12 rounded bg-gray-200"></div>
        <i className="fa-solid fa-angle-right text-gray-300"></i>
        <div className="h-4 w-20 rounded bg-gray-200"></div>
        <i className="fa-solid fa-angle-right text-gray-300"></i>
        <div className="h-4 w-24 rounded bg-gray-200"></div>
        <i className="fa-solid fa-angle-right text-gray-300"></i>
        <div className="h-4 w-32 rounded bg-gray-300"></div>
      </div>

      {/* 2. TOP SECTION: IMAGES & DETAILS */}
      <div className="my-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* LEFT COLUMN: IMAGES */}
        <div className="sm:col-span-1">
          {/* Main Image */}
          <div className="h-[500px] w-full rounded-2xl bg-gray-200"></div>
          {/* Thumbnails */}
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 w-24 rounded-2xl bg-gray-200"></div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT DETAILS & OPTIONS */}
        <div className="sm:col-span-1">
          {/* Title & Favorite Button */}
          <div className="flex items-center justify-between">
            <div className="h-8 w-3/4 rounded bg-gray-300"></div>
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
          </div>

          {/* Ratings & Reviews */}
          <div className="my-3 flex items-center gap-2 border-b pb-5">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 w-4 rounded-full bg-gray-200"></div>
              ))}
            </div>
            <div className="h-5 w-8 rounded bg-gray-300"></div>
            <div className="ml-2 h-5 w-24 rounded border-l bg-gray-200 pl-2"></div>
          </div>

          {/* Product Options Component Wrapper */}
          <div className="my-4">
            {/* Option Group Name */}
            <div className="h-6 w-32 rounded bg-gray-300"></div>

            {/* Variants Selector */}
            <ul className="my-3 flex gap-4">
              {[1, 2, 3].map((i) => (
                <li key={i} className="h-14 w-20 rounded-2xl border bg-gray-100"></li>
              ))}
            </ul>

            {/* Price */}
            <div className="mt-4 flex items-center gap-2">
              <div className="h-6 w-16 rounded bg-gray-300"></div>
              <div className="h-6 w-24 rounded bg-gray-200"></div>
            </div>

            {/* Short Description */}
            <div className="mt-3 flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-gray-200"></div>
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            </div>

            {/* Stock */}
            <div className="mt-3 h-5 w-24 rounded bg-gray-200"></div>

            {/* Add to Cart Area */}
            <div className="mt-3 flex gap-3">
              <div className="h-10 w-32 rounded-lg bg-gray-300"></div>
            </div>

            {/* Total */}
            <div className="my-7 h-6 w-32 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>

      {/* 3. DIVIDER */}
      <div className="border-b-2"></div>

      {/* 4. PRODUCT DESCRIPTION TABS & CONTENT */}
      <div className="my-5">
        {/* Tabs */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          <div className="col-span-1 h-6 w-32 rounded bg-gray-300"></div>
          <div className="col-span-1 h-6 w-36 rounded bg-gray-200"></div>
          <div className="col-span-1 h-6 w-36 rounded bg-gray-200"></div>
        </div>

        {/* Description Body Paragraph Placeholder */}
        <div className="my-5 flex flex-col gap-3">
          <div className="h-4 w-full rounded bg-gray-200"></div>
          <div className="h-4 w-5/6 rounded bg-gray-200"></div>
          <div className="h-4 w-4/6 rounded bg-gray-200"></div>
        </div>
      </div>

      {/* 5. YOU MIGHT ALSO LIKE (Grid) */}
      <div className="mt-8">
        <div className="my-5 h-8 w-64 rounded bg-gray-300"></div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              {/* Image */}
              <div className="aspect-square w-full rounded-2xl bg-gray-200"></div>
              {/* Title */}
              <div className="mt-1 h-5 w-3/4 rounded bg-gray-300"></div>
              {/* Price */}
              <div className="h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
