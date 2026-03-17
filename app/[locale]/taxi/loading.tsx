export default function TaxiBookingSkeleton() {
  return (
    <div className="container mx-auto min-h-screen max-w-md animate-pulse bg-gray-50 px-4 pt-4 pb-24 sm:min-h-full sm:max-w-full">
      {/* 1. PROGRESS BAR SKELETON */}
      <div className="mb-6 flex gap-2">
        {/* Step 1 active (darker), Steps 2 & 3 inactive (lighter) */}
        <div className="h-2 flex-1 rounded-full bg-gray-400" />
        <div className="h-2 flex-1 rounded-full bg-gray-200" />
        <div className="h-2 flex-1 rounded-full bg-gray-200" />
      </div>

      {/* 2. STEP 1 CONTENT: "What do you need?" */}
      <div className="animate-in fade-in slide-in-from-right-4">
        {/* Main Heading Placeholder */}
        <div className="mb-6 h-8 w-64 rounded bg-gray-300"></div>

        {/* Grid for Vehicle Options */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {/* Car Option Placeholder */}
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* Emoji Icon Placeholder (text-4xl size) */}
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="flex flex-col gap-2">
              <div className="h-6 w-16 rounded bg-gray-300"></div> {/* "Car" */}
              <div className="h-4 w-48 rounded bg-gray-200"></div> {/* Subtitle */}
            </div>
          </div>

          {/* Motorcycle Option Placeholder */}
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="flex flex-col gap-2">
              <div className="h-6 w-32 rounded bg-gray-300"></div> {/* "Motorcycle" */}
              <div className="h-4 w-40 rounded bg-gray-200"></div> {/* Subtitle */}
            </div>
          </div>

          {/* Bus Option Placeholder */}
          <div className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* SWVL Style Badge Placeholder */}
            <div className="absolute -top-4 -right-4 origin-bottom-left rotate-45 transform bg-gray-200 px-6 py-4"></div>

            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="flex flex-col gap-2">
              <div className="h-6 w-36 rounded bg-gray-300"></div> {/* "Mass Transit Bus" */}
              <div className="h-4 w-48 rounded bg-gray-200"></div> {/* Subtitle */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
