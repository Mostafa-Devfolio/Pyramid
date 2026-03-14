export default function PropertySkeleton() {
  return (
    // Main wrapper matching your component exactly, with animate-pulse
    <div className="my-7 animate-pulse">
      {/* 1. HEADER (Stars, Title, Address) */}
      <div className="">
        <div className="mb-2 h-3 w-20 rounded bg-gray-200"></div> {/* Stars */}
        <div className="h-8 w-2/3 rounded bg-gray-300 sm:w-1/2"></div> {/* Title */}
        <div className="mt-2 h-4 w-1/3 rounded bg-gray-200"></div> {/* Address */}
      </div>

      {/* 2. IMAGES & REVIEW GRID */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
        {/* LEFT: IMAGE GALLERY PREVIEW (sm:col-span-3) */}
        <div className="h-full max-h-full sm:col-span-3">
          {/* Top Main Images */}
          <div className="my-4 grid h-[300px] grid-cols-2 gap-1 sm:grid-cols-3 md:h-[400px]">
            {/* Large Main Image */}
            <div className="h-full w-full rounded-sm bg-gray-200 sm:col-span-2"></div>
            {/* Two Side Images */}
            <div className="col-span-1 flex h-full flex-col gap-1">
              <div className="h-1/2 w-full rounded-sm bg-gray-200"></div>
              <div className="h-1/2 w-full rounded-sm bg-gray-200"></div>
            </div>
          </div>

          {/* Bottom Thumbnails */}
          <div className="mt-1 grid grid-cols-4 gap-1 sm:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-[4/3] w-full rounded-sm bg-gray-200"></div>
            ))}
          </div>
        </div>

        {/* RIGHT: REVIEW BOX (col-span-1) */}
        <div className="col-span-1 my-4">
          <div className="rounded-sm border stroke-1 p-4">
            <div className="grid grid-cols-3 gap-5">
              <div className=""></div>
              <div className="col-span-1">
                <div className="h-5 w-16 rounded bg-gray-300"></div> {/* Review Word */}
                <div className="mt-1 h-3 w-16 rounded bg-gray-200"></div> {/* Count */}
              </div>
              <div className="col-span-1 flex h-10 w-10 items-center justify-center rounded-tl-md rounded-tr-md rounded-br-md bg-gray-300"></div>{' '}
              {/* Score */}
            </div>
            <div className="border-b py-2"></div>
            <div className="mt-3">
              <div className="h-4 w-48 rounded bg-gray-300"></div>
              <div className="mt-2 ml-10 h-4 w-3/4 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FACILITIES PILLS */}
      <div className="my-4">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-10 rounded-md border bg-gray-50 stroke-1"></div>
          ))}
        </div>
      </div>

      {/* 4. ABOUT & POPULAR FACILITIES */}
      <div className="mt-6">
        <div className="mb-3 h-6 w-48 rounded bg-gray-300"></div> {/* Title */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-full rounded bg-gray-200"></div>
          <div className="h-4 w-full rounded bg-gray-200"></div>
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
        </div>
      </div>

      <div className="my-6 flex flex-col gap-3">
        <div className="mb-2 h-5 w-48 rounded bg-gray-300"></div> {/* Title */}
        <div className="flex items-center gap-10">
          <div className="h-5 w-24 rounded bg-gray-200"></div>
          <div className="h-5 w-32 rounded bg-gray-200"></div>
          <div className="h-5 w-32 rounded bg-gray-200"></div>
        </div>
      </div>

      {/* 5. AVAILABILITY (YELLOW SEARCH BAR) */}
      <div className="w-full border-t-1 pt-6">
        <div className="mb-3 h-6 w-32 rounded bg-gray-300"></div> {/* "Availability" */}
        <div className="grid w-full gap-3 rounded-lg bg-yellow-400 p-2 sm:grid-cols-5">
          {/* Date Picker */}
          <div className="h-[52px] rounded-xl bg-white p-3 sm:col-span-2"></div>
          {/* Rooms Picker */}
          <div className="h-[52px] rounded-xl bg-white p-3 sm:col-span-2"></div>
          {/* Search Button */}
          <div className="h-[52px] rounded-xl bg-blue-400 sm:col-span-1"></div>
        </div>
      </div>

      {/* 6. BOOK THIS PROPERTY (TABLE) */}
      <div className="mt-8">
        <div className="mb-3 h-6 w-48 rounded bg-gray-300"></div> {/* Title */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse rounded-md border">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/5 border p-4">
                  <div className="mx-auto h-4 w-24 rounded bg-gray-200"></div>
                </th>
                <th className="w-1/5 border p-4">
                  <div className="mx-auto h-4 w-24 rounded bg-gray-200"></div>
                </th>
                <th className="w-1/5 border p-4">
                  <div className="mx-auto h-4 w-16 rounded bg-gray-200"></div>
                </th>
                <th className="w-1/5 border p-4">
                  <div className="mx-auto h-4 w-24 rounded bg-gray-200"></div>
                </th>
                <th className="border p-4">
                  <div className="mx-auto h-4 w-24 rounded bg-gray-200"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Dummy Table Row */}
              <tr>
                <td className="h-32 border p-4">
                  <div className="h-full w-full rounded bg-gray-100"></div>
                </td>
                <td className="h-32 border p-4">
                  <div className="h-full w-full rounded bg-gray-100"></div>
                </td>
                <td className="h-32 border p-4">
                  <div className="h-full w-full rounded bg-gray-100"></div>
                </td>
                <td className="h-32 border p-4">
                  <div className="h-full w-full rounded bg-gray-100"></div>
                </td>
                <td className="h-32 border p-4">
                  <div className="h-full w-full rounded bg-gray-100"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
