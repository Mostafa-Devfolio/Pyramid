import HomeVendorsMainComponent from '@/app/_Components/BusinessHomeComponents/HomeVendorsMainComponent/HomeVendorsMainComponent';
import { IVendorsInCategory } from '@/app/interface/vendorsInCategory';
import { getClass } from '@/services/ApiServices';

export default async function Category({params}: {params: Promise<{category: string, id: string}>}) {
  const { category, id } = await params;

  const vendors: IVendorsInCategory[] = await getClass.vendorsInCategory(id, category);
  const catName = await getClass.categoryName(id, category);
  

  return (
    <div>
      <h3 className='container mx-auto my-3'>{catName.category.name}</h3>
        <div className={`grid gap-4 lg:grid-cols-4 grid-cols-2 container mx-auto`}>
          {vendors.map((vendor: IVendorsInCategory) => 
              <HomeVendorsMainComponent key={vendor.id} businessTypee={id} vendor={vendor}/>
              )
          }
        </div>
    </div>
  )
}
