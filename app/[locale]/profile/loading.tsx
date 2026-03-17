export default function ProfileSkeleton() {
  return (
    // Main wrapper matching your Profile page, with animate-pulse
    <div className="container mx-auto my-5 animate-pulse">
      {/* 1. PAGE TITLE & GREETING */}
      {/* Simulating <h1>Profile</h1> */}
      <div className="mb-4 h-10 w-24 rounded-lg bg-gray-300"></div>

      {/* Simulating <h3>Hi! {username}, welcome to...</h3> */}
      <div className="my-3 flex flex-wrap items-center gap-2">
        <div className="h-7 w-8 rounded bg-gray-200"></div>
        {/* Username Placeholder (red-500 context) */}
        <div className="h-7 w-32 rounded bg-gray-300"></div>
        <div className="h-7 w-64 rounded bg-gray-200 sm:w-96"></div>
      </div>

      {/* 2. LISTBOX COMPONENT SKELETON */}
      {/* Matches the ListboxWrapper styling from HeroUI */}
      <div className="rounded-small border-default-200 dark:border-default-100 mt-6 w-full max-w-[100%] border px-1 py-2">
        {/* SECTION 1: Actions */}
        <div className="px-2 py-2">
          {/* Section Title */}
          <div className="mb-3 h-4 w-16 rounded bg-gray-300"></div>

          <div className="flex flex-col gap-1">
            {/* Generate 7 placeholder items matching your listbox items */}
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-md px-2 py-2">
                {/* Icon Placeholder (Matches the 3em x 3em SVG sizes) */}
                <div className="h-12 w-12 shrink-0 rounded-md bg-gray-200"></div>

                {/* Text Content */}
                <div className="flex flex-col gap-1.5">
                  {/* Title Placeholder */}
                  <div className="h-5 w-32 rounded bg-gray-300"></div>
                  {/* Description Placeholder */}
                  <div className="h-3 w-48 rounded bg-gray-200 sm:w-64"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION DIVIDER */}
        <div className="my-1 h-px w-full bg-gray-200"></div>

        {/* SECTION 2: Danger Zone */}
        <div className="px-2 py-2">
          {/* Section Title */}
          <div className="mb-3 h-4 w-24 rounded bg-gray-300"></div>

          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            {/* Icon Placeholder */}
            <div className="h-12 w-12 shrink-0 rounded-md bg-red-200"></div>

            {/* Text Content */}
            <div className="flex flex-col gap-1.5">
              {/* Logout Title Placeholder */}
              <div className="h-5 w-20 rounded bg-red-300"></div>
              {/* Logout Description Placeholder */}
              <div className="h-3 w-40 rounded bg-red-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
