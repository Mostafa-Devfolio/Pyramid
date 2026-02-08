import Image from 'next/image';
import { IBusiness } from './interface/businessTypeInterface';
import Link from 'next/link';
import { CarouselHome } from './_Components/Carsoul/Carsoul';

export const baseURL = 'http://localhost:1337';
export const baseURL2 = `https://pyramid.devfolio.net/api/`;

export default async function Home() {
  async function getBusinessType() {
    const response = await fetch(baseURL2 + 'business-types', {
      method: 'get',
    }).then((res) => res.json());
    return response.data;
  }

  const businessData: IBusiness[] = await getBusinessType();

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
    </div>
  );
}
