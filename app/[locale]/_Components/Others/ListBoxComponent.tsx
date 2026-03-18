'use client';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { useRouter } from 'next/navigation';
import { logOutNow } from './Logout';
import { SVGProps } from 'react';
import { SSRProvider } from '@react-aria/ssr';

type IconProps = SVGProps<SVGSVGElement>;

// Modernized Icon Wrappers for the Dashboard
const NavCard = ({
  title,
  desc,
  icon,
  onClick,
  isDanger = false,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  onClick: () => void;
  isDanger?: boolean;
}) => (
  <button
    onClick={onClick}
    className={cn(
      'group relative flex flex-col items-start gap-4 rounded-[2rem] border p-6 text-left transition-all duration-300 hover:-translate-y-1',
      isDanger
        ? 'border-red-100 bg-red-50/30 hover:bg-red-50 hover:shadow-xl hover:shadow-red-500/10'
        : 'border-gray-100 bg-white hover:border-black hover:shadow-2xl hover:shadow-black/5'
    )}
  >
    <div
      className={cn(
        'flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110',
        isDanger ? 'bg-red-100' : 'bg-gray-50 group-hover:bg-black'
      )}
    >
      <div className={cn('h-8 w-8', !isDanger && 'group-hover:invert')}>{icon}</div>
    </div>
    <div>
      <h3 className={cn('text-lg font-bold', isDanger ? 'text-red-600' : 'text-gray-900')}>{title}</h3>
      <p className="mt-1 line-clamp-2 text-sm font-medium text-gray-500">{desc}</p>
    </div>
    {/* Floating arrow for modern feel */}
    <div className="absolute top-6 right-6 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path d="M7 17l10-10M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </button>
);

// Simplified Icon imports (Preserving your exact SVG shapes via props if needed)
import { Settings, ShoppingBag, CalendarCheck, MapPin, Heart, Award, Wallet, LogOut } from 'lucide-react';
import { cn } from '@heroui/react';

export default function ListBoxComponent() {
  const router = useRouter();
  const { setAuth, setToken } = useAuth();

  async function logout() {
    await logOutNow();
    setAuth(false);
    setToken(null);
    router.push('/');
  }

  const menuItems = [
    { title: 'Settings', desc: 'Change your account data and security.', icon: <Settings />, path: '/settings' },
    { title: 'My Orders', desc: 'Track and view your e-commerce orders.', icon: <ShoppingBag />, path: '/orders' },
    {
      title: 'My Bookings',
      desc: 'View your hotel and villa reservations.',
      icon: <CalendarCheck />,
      path: '/orders/bookings',
    },
    { title: 'My Addresses', desc: 'Add, edit or remove delivery addresses.', icon: <MapPin />, path: '/address' },
    { title: 'Wishlist', desc: "Products you've saved for later.", icon: <Heart />, path: '/wishlist' },
    { title: 'Loyalty Points', desc: 'Convert your prism points into credit.', icon: <Award />, path: '/loyalty' },
    { title: 'My Wallet', desc: 'Check your balance and transaction history.', icon: <Wallet />, path: '/wallet' },
  ];

  return (
    <SSRProvider>
      <div className="space-y-12">
        {/* Actions Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <NavCard
              key={item.path}
              title={item.title}
              desc={item.desc}
              icon={item.icon}
              onClick={() => router.push(item.path)}
            />
          ))}
        </div>

        {/* Danger Zone Section */}
        <div className="border-t border-gray-100 pt-8">
          <h2 className="mb-6 px-4 text-sm font-black tracking-[0.2em] text-gray-400 uppercase">Danger Zone</h2>
          <div className="max-w-md">
            <NavCard
              title="Logout"
              desc="Securely sign out of your account."
              icon={<LogOut />}
              isDanger={true}
              onClick={logout}
            />
          </div>
        </div>
      </div>
    </SSRProvider>
  );
}
