export default function OrdersBookingSkeleton() {
  return (
    // Main wrapper matching your component, with animate-pulse
    <div className="my-3 animate-pulse">
      {/* "Your booking summary" Title Placeholder */}
      <div className="mb-4 h-8 w-56 rounded bg-gray-300"></div>

      {/* Simulating 3 booking cards loading in */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="my-2 grid grid-cols-8 gap-5 p-3 shadow-sm">
          {/* 1. Image Column (col-span-1) */}
          <div className="col-span-1">
            {/* Matches the 200x200 Image aspect ratio */}
            <div className="aspect-square w-full rounded bg-gray-200"></div>
          </div>

          {/* 2. Details Column (col-span-4) */}
          <div className="col-span-4">
            {/* Property Name Placeholder */}
            <div className="mb-3 h-6 w-3/4 rounded bg-gray-300"></div>

            <div className="flex flex-col gap-2">
              {/* Total Price Row */}
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 shrink-0 rounded-full bg-gray-200"></div>
                <div className="h-4 w-48 rounded bg-gray-200"></div>
              </div>

              {/* Dates Row */}
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 shrink-0 rounded-full bg-gray-200"></div>
                <div className="h-4 w-40 rounded bg-gray-200"></div>
              </div>

              {/* Room Type Row */}
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 shrink-0 rounded-full bg-gray-200"></div>
                <div className="h-4 w-32 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>

          {/* 3. Button Column (col-span-3) */}
          <div className="col-span-3 flex items-end justify-end">
            <div className="h-10 w-48 rounded bg-blue-300"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
