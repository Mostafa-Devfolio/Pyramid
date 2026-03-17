import { getClass } from '@/services/ApiServices';
import { getLoginTo } from '../login/login';
import ListBoxComponent from '../_Components/Others/ListBoxComponent';

export default async function Profile() {
  const token = await getLoginTo();
  const user = await getClass.userProfile(token);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      {/* Premium Welcome Header */}
      <div className="relative mb-12 overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl sm:p-12">
        {/* Decorative background blur */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 space-y-2">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Profile</h1>
          <p className="pt-2 text-xl font-medium text-slate-300">
            Hi, <span className="font-bold text-red-400">{user?.username}</span>! Welcome back to your community.
          </p>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <ListBoxComponent />
      </div>
    </div>
  );
}
