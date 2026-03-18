import Image from 'next/image';
import { IBusiness } from './interface/businessTypeInterface';
import Link from 'next/link';
import { CarouselHome } from './_Components/Carsoul/Carsoul';
import { getClass } from '@/services/ApiServices';
import { getLoginTo } from './login/login';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import SetBusiness from './_Components/BusinessHomeComponents/HomeBusiness/SetBusiness';
import { IBooking } from './interface/booking';
import { getTranslations } from 'next-intl/server';

export const baseURL = '***REMOVED***';
export const baseURL2 = `***REMOVED***/api/`;

export default async function Home() {
  const t = await getTranslations('PRISM');
  async function getBusinessType() {
    const response = await fetch(baseURL2 + 'business-types', {
      method: 'get',
    }).then((res) => res.json());
    return response.data;
  }

  const token = await getLoginTo();
  const businessData: IBusiness[] = await getBusinessType();
  const logisticsData = await getClass.getTaxiCourier(token);

  return (
    <div className="container mx-auto space-y-20 px-4 pt-6 pb-24">
      {/* Top Carousel Section */}
      <div className="mx-auto w-full overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-black/5">
        <CarouselHome typee="main_home" />
      </div>

      {/* Business Types Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {t('choose_type')}
          </h2>
          <p className="font-medium text-slate-500 dark:text-slate-100">{t('explore')}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {businessData.map((business: IBusiness) => (
            <SetBusiness key={business.id} business={business} />
          ))}
        </div>
      </section>

      {/* Delivery and Courier Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 space-y-8 delay-100 duration-700">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {t('delivery_logistics')}
          </h2>
          <p className="font-medium text-slate-500 dark:text-slate-200">{t('fast_reliable_transport')}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {logisticsData.isTaxiEnabled == true && (
            <Link
              href={`/taxi`}
              className="group relative flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-amber-100 bg-linear-to-br from-amber-50 to-white p-10 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 dark:from-black/60 dark:to-black/20"
            >
              <div className="relative mb-6 h-40 w-40 transition-transform duration-700 group-hover:scale-110">
                <Image
                  width={2000}
                  height={2000}
                  className="h-full w-full object-contain drop-shadow-xl"
                  src={`${baseURL}/uploads/taxi.webp`}
                  alt={'Taxi'}
                />
              </div>
              <h3 className="mb-2 text-2xl font-black text-slate-900 transition-colors group-hover:text-amber-600 dark:text-white">
                {t('taxi')}
              </h3>
              <p className="font-medium text-slate-500 dark:text-slate-300">{t('book_taxi')}</p>
            </Link>
          )}

          {logisticsData.isCourierEnabled == true && (
            <Link
              href={`/courier`}
              className="group relative flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-10 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 dark:from-black/60 dark:to-black/20"
            >
              <div className="relative mb-6 h-40 w-40 transition-transform duration-700 group-hover:scale-110">
                <Image
                  width={2000}
                  height={2000}
                  className="h-full w-full object-contain drop-shadow-xl"
                  src={`${baseURL}/uploads/courier.png`}
                  alt={'Courier'}
                />
              </div>
              <h3 className="mb-2 text-2xl font-black text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white">
                {t('courier')}
              </h3>
              <p className="font-medium text-slate-500 dark:text-slate-300">{t('deliver_everything')}</p>
            </Link>
          )}
        </div>
      </section>

      {/* Bookings Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 space-y-8 delay-200 duration-700">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {t('bookings')}
          </h2>
          <p className="font-medium text-slate-500 dark:text-slate-300">{t('find_your_perfect')}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link
            href={`/bookings`}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-10 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 dark:border-slate-600 dark:from-black/60 dark:to-black/20"
          >
            <div className="relative mb-6 h-40 w-40 transition-transform duration-700 group-hover:scale-110">
              <Image
                width={2000}
                height={2000}
                className="h-full w-full object-contain drop-shadow-xl"
                src={`${baseURL}/uploads/booking.png`}
                alt={'Booking'}
              />
            </div>
            <h3 className="mb-2 text-2xl font-black text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-300">
              {t('booking')}
            </h3>
            <p className="font-medium text-slate-500 dark:text-slate-300">{t('book_hotels')}</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
