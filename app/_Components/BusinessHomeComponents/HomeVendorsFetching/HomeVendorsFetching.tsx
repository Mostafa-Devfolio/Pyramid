import { IDiscountedVendorsHome } from '@/app/interface/homePageDiscountedVendors';
import { getClass } from '@/services/ApiServices';
import HomeVendorsClient from './HomeVendorsClient';

type mainType = {
    mainType: string,
    businessTypee: string
}

export default async function HomeVendorsFetching({mainType, businessTypee}: mainType) {

    const vendors: IDiscountedVendorsHome[] = await getClass.getAllVendor(businessTypee, mainType);    

    return (
        <HomeVendorsClient mainType={mainType} businessTypee={businessTypee} vendors={vendors} />
    )
}
