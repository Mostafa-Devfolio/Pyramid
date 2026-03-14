export default function CourierSkeleton() {
  return (
    // Main wrapper matching your Courier page exactly, with animate-pulse
    <div className="container mx-auto my-5 animate-pulse">
      {/* Static Title */}
      <h1 className="mb-4 text-3xl font-bold text-gray-800">Courier</h1>

      {/* Step 0 Content: Grid for Parcel Types */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Generating 3 placeholder cards for the courier options */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="my-3 rounded-2xl border-2 p-2 text-center">
            {/* Parcel Type Name (h3) Placeholder */}
            <div className="mx-auto mt-2 h-6 w-1/2 rounded bg-gray-300"></div>

            {/* Description (p) Placeholder */}
            <div className="mx-auto my-4 h-4 w-3/4 rounded bg-gray-200"></div>

            {/* Max Weight (h4) Placeholder */}
            <div className="mx-auto mb-2 h-5 w-2/5 rounded bg-gray-200"></div>

            {/* Base Fee (h4) Placeholder */}
            <div className="mx-auto mb-1 h-6 w-1/3 rounded bg-gray-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
