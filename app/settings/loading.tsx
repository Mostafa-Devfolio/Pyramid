export default function SettingsSkeleton() {
  return (
    // Matches the exact padding and wrappers of UserInfo, adding animate-pulse
    <div className="container mx-auto my-5 animate-pulse">
      <div className="my-5">
        <div className="grid grid-cols-1 gap-4 p-5">
          <div className="flex flex-col gap-3 p-5">
            {/* "User Information" Title Placeholder */}
            <div className="h-8 w-48 rounded bg-gray-300"></div>

            {/* Name Placeholder */}
            <div className="mt-3 h-6 w-64 rounded bg-gray-200"></div>

            {/* Phone Placeholder */}
            <div className="h-6 w-48 rounded bg-gray-200"></div>

            {/* Email Placeholder */}
            <div className="h-6 w-72 rounded bg-gray-200"></div>

            {/* Account Confirmed Placeholder */}
            <div className="h-6 w-56 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
