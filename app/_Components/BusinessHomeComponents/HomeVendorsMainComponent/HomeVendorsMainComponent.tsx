import Image from "next/image";
import Icon from '@/app/icon';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import Link from "next/link";

export default function HomeVendorsMainComponent({vendor, businessTypee}: any) {

    return (
    <>
        <div className="flex flex-col my-3 border rounded-2xl shadow-lg">
            <div className="rounded-2xl aspect-square relative">
                <Link href={`/vendors/${vendor.slug}`}>
                    <Image className="rounded-2xl w-full object-cover" width={500} height={500} src={vendor.logo == null||"" ? IMAGE_PLACEHOLDER : vendor.logo} alt={vendor.name}/>
                </Link>
                {businessTypee=='discounted' && <div className="absolute h-10 w-15 bg-red-600 top-2 left-2 flex justify-center items-center rounded-2xl text-white">Sale</div>}
                {businessTypee=='top' && <div className="absolute h-10 w-20 text-white bg-yellow-600 top-2 left-2 flex justify-center items-center rounded-2xl">{vendor.rating} <Icon className="text-yellow-400 text-xl" /></div>}
            </div>
            <div className="flex flex-col p-5 gap-3">
                {vendor.isOpen? <p className='text-green-700'>Opened</p> : <p className='text-red-700'>Closed</p>}
                <Link href={`/vendors/${vendor.slug}`}>
                    <h4 className=''>{vendor.name}</h4>
                </Link>
                <p className='text-yellow-500'>{vendor.rating} <Icon className="text-yellow-400 text-xl" /></p>
            </div>
        </div>
    </>
    )
}
