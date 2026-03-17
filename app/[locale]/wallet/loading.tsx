export default function WalletSkeleton() {
  return (
    <div className="container mx-auto animate-pulse">
      {/* 1. HEADER */}
      <div className="flex items-center gap-1">
        {/* Back Button SVG Placeholder (2em x 2em) */}
        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
        {/* "Wallet" Title Placeholder */}
        <div className="mt-3 h-8 w-24 rounded bg-gray-300"></div>
      </div>

      <div className="my-3">
        {/* 2. BALANCE DISPLAY */}
        <div className="mb-4 h-6 w-48 rounded bg-gray-300"></div>

        {/* 3. HERO-UI TABLE SKELETON */}
        <div className="my-4 w-full rounded-2xl border border-gray-100 shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 rounded-t-2xl bg-gray-100 p-4">
            <div className="h-4 w-8 rounded bg-gray-300"></div> {/* ID */}
            <div className="h-4 w-24 rounded bg-gray-300"></div> {/* Balance Before */}
            <div className="h-4 w-24 rounded bg-gray-300"></div> {/* Balance After */}
            <div className="h-4 w-16 rounded bg-gray-300"></div> {/* Reason */}
          </div>

          {/* Table Body (Striped Rows) */}
          <div className="flex flex-col">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`grid grid-cols-4 gap-4 p-4 ${
                  i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } ${i === 5 ? 'rounded-b-2xl' : 'border-b border-gray-100'}`}
              >
                <div className="h-4 w-6 rounded bg-gray-200"></div>
                <div className="h-4 w-16 rounded bg-gray-200"></div>
                <div className="h-4 w-16 rounded bg-gray-200"></div>
                <div className="h-4 w-32 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
