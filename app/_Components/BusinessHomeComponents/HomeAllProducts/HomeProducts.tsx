// import { IProductsHome } from '@/app/interface/productsHomeInterface';
// import { baseURL2 } from '@/app/page'
// import React from 'react'
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import Image from "next/image";

// type mainType = {mainType: string};
// export default async function HomeProducts({mainType}: mainType) {

//     async function AllProducts() {
//         const response = await fetch(`${baseURL2}products?filters[businessType][slug][$eq]=${mainType}&populate=*`, {
//             method: 'get',
//         }).then((res)=> res.json());
//         return response.data;
//     }

//     const products: IProductsHome[] = await AllProducts();
//     console.log(products);

//   return (<>
//     <div className='grid grid-cols-4 gap-4'>
//       {products.map((product: IProductsHome) => {
//         return <div key={product.id} className="">
//           <Card>
//             <CardHeader>
//               <CardTitle><Image height={500} width={500} className='w-full' src={product.images} alt={product.title}/></CardTitle>
//               <CardDescription>{product.description}</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p>{product.title}</p>
//             </CardContent>
//             <CardFooter>
//               {product.basePrice && <p>{product.basePrice}</p>}
//             </CardFooter>
//           </Card>
//         </div>
//       })}
//     </div>
//   </>
//   )
// }
