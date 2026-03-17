export default function MainHomeSkeleton() {
  return (
    <div className="container mx-auto animate-pulse pt-3">
      {/* 1. CAROUSEL SKELETON */}
      {/* Matches the CarsoulClient styling (p-1, aspect-3/2, h-47/sm:h-64) */}
      <div className="mx-auto w-full">
        <div className="p-1">
          <div className="aspect-3/2 h-47 w-full rounded-md bg-gray-200 sm:h-64"></div>
        </div>
      </div>

      {/* 2. CHOOSE YOUR TYPE SECTION */}
      <div className="my-5 h-8 w-48 rounded bg-gray-300"></div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 text-center">
            <div className="aspect-square w-full rounded-2xl bg-gray-200"></div>
            {/* h2 placeholder */}
            <div className="h-6 w-3/4 rounded bg-gray-300"></div>
            {/* p truncate placeholder */}
            <div className="h-4 w-full rounded bg-gray-200"></div>
          </div>
        ))}
      </div>

      {/* 3. DELIVERY AND COURIER SECTION */}
      <div className="my-5 h-8 w-64 rounded bg-gray-300"></div>

      <div className="grid grid-cols-2 gap-4">
        {/* Taxi Placeholder */}
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="aspect-square w-[45%] rounded-2xl bg-gray-200"></div>
          <div className="h-6 w-1/2 rounded bg-gray-300"></div>
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
        </div>

        {/* Courier Placeholder */}
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          {/* Matches the w-[50%] wrapper */}
          <div className="aspect-square w-[50%] rounded-2xl bg-gray-200"></div>
          <div className="h-6 w-1/2 rounded bg-gray-300"></div>
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
        </div>
      </div>

      {/* 4. BOOKINGS SECTION */}
      <div className="my-5">
        {/* Title Placeholder */}
        <div className="mb-4 h-8 w-32 rounded bg-gray-300"></div>

        <div className="grid grid-cols-2 gap-4">
          {/* Booking Item Placeholder */}
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            {/* Matches the w-[50%] wrapper */}
            <div className="aspect-square w-[50%] rounded-2xl bg-gray-200"></div>
            <div className="h-6 w-1/2 rounded bg-gray-300"></div>
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
