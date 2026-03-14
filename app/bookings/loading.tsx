export default function BookingSkeleton() {
  return (
    // Main wrapper matching your Booking page, with animate-pulse
    <div className="my-5 animate-pulse">
      {/* 1. YELLOW SEARCH BAR SKELETON */}
      {/* Matches the 12-column grid on sm screens and the bg-yellow-400 */}
      <div className="grid grid-cols-1 gap-2 rounded-xl border bg-yellow-400 stroke-1 p-2 sm:grid-cols-12">
        {/* Location Input Placeholder (col-span-4) */}
        <div className="relative flex h-[52px] max-w-full items-center rounded-xl bg-white p-3 sm:col-span-4">
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        </div>

        {/* DatePicker Input Placeholder (col-span-3) */}
        <div className="flex h-[52px] items-center rounded-xl bg-white p-3 sm:col-span-3">
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
        </div>

        {/* Rooms/Guests Input Placeholder (col-span-3) */}
        <div className="relative flex h-[52px] w-full items-center justify-center rounded-xl bg-white p-3 sm:col-span-3">
          <div className="h-4 w-2/3 rounded bg-gray-200"></div>
        </div>

        {/* Options Placeholder (col-span-1) */}
        <div className="relative flex h-[52px] items-center justify-center rounded-xl bg-white p-2 sm:col-span-1">
          <div className="h-4 w-16 rounded bg-gray-200"></div>
        </div>

        {/* Search Button Placeholder (col-span-1) */}
        <div className="h-[52px] sm:col-span-1">
          <div className="h-full w-full rounded-xl bg-blue-400"></div>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA (Carousel) */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Carousel Placeholder (Matches CarouselCSR styling) */}
        <div className="sm:col-span-3">
          <div className="p-1">
            {/* Matches the aspect-3/2 h-64 CardContent */}
            <div className="flex aspect-[3/2] h-64 w-full items-center justify-center overflow-hidden rounded-md bg-gray-200">
              {/* Centered Title Badge Placeholder */}
              <div className="absolute top-20 h-12 w-48 rounded-lg bg-gray-300 shadow-lg"></div>
              {/* Button Placeholder */}
              <div className="absolute bottom-10 h-10 w-24 rounded-md bg-gray-400 shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
