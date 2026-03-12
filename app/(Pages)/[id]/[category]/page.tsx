import HomeProductsMainComponent from '@/app/_Components/BusinessHomeComponents/HomeVendorsMainComponent/HomeProductsMainComponent';
import HomeVendorsMainComponent from '@/app/_Components/BusinessHomeComponents/HomeVendorsMainComponent/HomeVendorsMainComponent';
import { IProductsInCategory, IVendorsInCategory } from '@/app/interface/vendorsInCategory';
import { getClass } from '@/services/ApiServices';

export default async function Category({ params }: { params: Promise<{ category: string; id: string }> }) {
  const { category, id } = await params;

  const vendorsAndProducts = await getClass.vendorsAndProductsInCategory(id, category);
  const vendors: IVendorsInCategory[] = vendorsAndProducts?.vendors;
  const products: IProductsInCategory[] = vendorsAndProducts?.products;
  const catName = await getClass.categoryName(id, category);

  return (
    <div>
      <h3 className="container mx-auto my-3">{catName?.category.name}</h3>
      <div className={`container mx-auto grid grid-cols-2 gap-4 lg:grid-cols-4`}>
        {vendors?.map((vendor: IVendorsInCategory) => (
          <HomeVendorsMainComponent key={vendor.id} businessTypee={id} vendor={vendor} />
        ))}
        {products?.map((product: IProductsInCategory) => (
          <HomeProductsMainComponent key={product.id} businessTypee={id} product={product} />
        ))}
      </div>
    </div>
  );
}
