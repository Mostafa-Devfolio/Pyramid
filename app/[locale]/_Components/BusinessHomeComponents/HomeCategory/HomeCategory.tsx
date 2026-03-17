import { ICategoryHome } from '@/app/[locale]/interface/categoryHomeInterface';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import Link from 'next/link';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import { baseURL } from '@/app/[locale]/page';

type id = { mainType: string };

export default async function HomeCategory({ mainType }: id) {
  const categories: ICategoryHome[] = await getClass.getHomeCategories(mainType);
  console.log(categories)

  return (
    <div className="no-scrollbar w-full snap-x snap-mandatory overflow-x-auto pb-4">
      <div className="flex gap-6 scroll-smooth px-1">
        {categories.map((category: ICategoryHome) => {
          return (
            <div key={category.id} className="group flex-shrink-0 snap-start">
              <Link href={`${mainType}/${category.slug}`} className="flex flex-col items-center gap-3">
                <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white p-1 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md sm:h-24 sm:w-24">
                  <Image
                    width={500}
                    height={500}
                    className="h-full w-full rounded-full object-cover"
                    src={
                      category.homeImage == null
                        ? IMAGE_PLACEHOLDER
                        : `${baseURL}${category.homeImage.url}`
                    }
                    alt={category.name}
                  />
                </div>
                <p className="text-center text-sm font-medium text-gray-600 transition-colors group-hover:text-black">
                  {category.name}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
