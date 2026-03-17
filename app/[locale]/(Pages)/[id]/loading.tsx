export default function HomeLoading() {
  return (
    <div className="container mx-auto animate-pulse pt-3">
      {/* 1. CAROUSEL SKELETON */}
      <div className="mx-auto w-full p-1">
        <div className="aspect-3/2 h-47 w-full rounded-md bg-gray-200 sm:h-64"></div>
      </div>

      {/* 2. CATEGORY HORIZONTAL SCROLL SKELETON */}
      <div className="mt-4">
        {/* "Category" Title Placeholder */}
        <div className="my-4 h-6 w-24 rounded bg-gray-300"></div>

        <div className="no-scrollbar w-full overflow-hidden">
          <div className="flex gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-24 w-24 rounded-2xl border bg-gray-200"></div>
                {/* Category Text Placeholder */}
                <div className="h-3 w-16 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. VENDORS / PRODUCTS GRID SKELETON */}
      {[1, 2, 3].map((sectionIndex) => (
        <div key={sectionIndex} className="mt-8">
          {/* Section Title Placeholder */}
          <div className="my-4 h-6 w-48 rounded bg-gray-300"></div>

          {/* The Grid mapping the cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, cardIndex) => (
              <div key={cardIndex} className="my-3 flex flex-col rounded-2xl border shadow-lg">
                {/* Image Area */}
                <div className="relative aspect-square rounded-2xl bg-gray-200">
                  {/* Sale/Top Badge Placeholder */}
                  <div className="absolute top-2 left-2 flex h-10 w-15 rounded-2xl bg-gray-300"></div>
                  {/* Heart Icon Placeholder */}
                  <div className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-300"></div>
                </div>

                {/* Content Area (Text, Price, Rating) */}
                <div className="flex flex-col gap-3 p-5">
                  <div className="h-4 w-12 rounded bg-gray-200"></div> {/* Rating Placeholder */}
                  <div className="h-5 w-4/5 rounded bg-gray-300"></div> {/* Title Placeholder */}
                  <div className="h-3 w-2/5 rounded bg-gray-200"></div> {/* Subtitle/Vendor */}
                  <div className="h-3 w-1/3 rounded bg-gray-200"></div> {/* Brand Placeholder */}
                  <div className="mt-1 h-6 w-24 rounded bg-gray-300"></div> {/* Price Placeholder */}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
