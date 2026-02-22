import Image from 'next/image';
import { IBusiness } from './interface/businessTypeInterface';
import Link from 'next/link';
import { CarouselHome } from './_Components/Carsoul/Carsoul';
import { getClass } from '@/services/ApiServices';
import { getLoginTo } from './login/login';
import { IMAGE_PLACEHOLDER } from '@/lib/image';

export const baseURL = 'http://devfolio.net/';
export const baseURL2 = `https://devfolio.net/`;

export default async function Home() {
  async function getBusinessType() {
    const response = await fetch(baseURL2 + 'business-types', {
      method: 'get',
    }).then((res) => res.json());
    return response.data;
  }

  const token = await getLoginTo();
  const businessData: IBusiness[] = await getBusinessType();
  const logisticsData = await getClass.getTaxiCourier(token);
  console.log(logisticsData);

  return (
    <div className="container mx-auto pt-3">
      <div className="mx-3 mx-auto w-[80%] md:w-full">
        <CarouselHome typee="main_home" />
      </div>
      <h2 className="my-5">Choose your type</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {businessData.map((business: IBusiness) => {
          return (
            <div className="text-center" key={business.id}>
              <Link className="group" href={`${business.slug}`}>
                <Image
                  width={200}
                  height={200}
                  className="w-full duration-500 group-hover:rotate-y-180"
                  src={`${baseURL}${business.icon.url}`}
                  alt={business.icon.alternativeText}
                />
              </Link>

              <Link href={`${business.slug}`}>
                <h2 className="text-center">{business.name}</h2>
              </Link>
              <Link href={`${business.slug}`}>
                <p>{business.description}</p>
              </Link>
            </div>
          );
        })}
      </div>
      <h2 className="my-5">Delivery and Booking</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          {logisticsData.isTaxiEnabled == true && (
            <div className="text-center flex flex-col justify-center items-center">
              <div className='w-[45%]'>
              <Link className="group" href={`/taxi`}>
                <Image
                  width={2000}
                  height={2000}
                  className="w-full rounded-2xl duration-500 group-hover:rotate-y-180"
                  src={'https://pyramid.devfolio.net/uploads/taxi.webp'}
                  alt={'Taxi'}
                />
              </Link>
              </div>
              <Link href={`/taxi`}>
                <h2 className="text-center">Taxi</h2>
              </Link>
              <Link href={`/taxi`}>
                <p>Book your taxi at any time</p>
              </Link>
            </div>
          )}
        </div>
        <div>
          {logisticsData.isCourierEnabled == true && (
            <div className="text-center flex flex-col justify-center items-center">
              <div className='w-[50%]'>
                <Link className="group" href={`/courier`}>
                  <Image
                    width={2000}
                    height={2000}
                    className="w-full rounded-2xl duration-500 group-hover:rotate-y-180"
                    src={'https://pyramid.devfolio.net/uploads/courier.png'}
                    alt={'Taxi'}
                  />
                </Link>
              </div>
              <Link href={`/courier`}>
                <h2 className="text-center">Courier</h2>
              </Link>
              <Link href={`/courier`}>
                <p>Deliver everything you want to any where.</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
