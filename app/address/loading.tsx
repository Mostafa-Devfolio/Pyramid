export default function AddressSkeleton() {
  return (
    // Main wrapper matching your Address page, with animate-pulse
    <div className="animate-pulse">
      {/* 1. HEADER */}
      <div className="flex items-center gap-1">
        {/* Back Button SVG Placeholder */}
        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
        {/* "Addresses" Title Placeholder */}
        <div className="ml-2 h-8 w-32 rounded bg-gray-300"></div>
      </div>

      {/* 2. ADD BUTTON */}
      <div className="mt-3 h-10 w-16 rounded-md bg-gray-300"></div>

      {/* 3. ADDRESS CARDS GRID */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Generating 3 placeholder cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative rounded-2xl border stroke-1 p-5 shadow-sm">
            {/* Address Label Title */}
            <div className="mb-4 h-6 w-1/2 rounded bg-gray-300"></div>

            {/* Street Line */}
            <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>

            {/* Building/Apt Line */}
            <div className="mb-2 h-4 w-full rounded bg-gray-200"></div>

            {/* City Line */}
            <div className="mb-4 h-4 w-2/3 rounded bg-gray-200"></div>

            {/* View on Map Link Placeholder */}
            <div className="mt-2 mb-3 h-3 w-24 rounded bg-blue-200"></div>

            {/* Default Status Placeholder */}
            <div className="mt-2 h-4 w-20 rounded bg-gray-200"></div>

            {/* Set Default Button Placeholder */}
            <div className="mt-4 h-10 w-full rounded-md border-2 border-gray-200 bg-gray-50"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
