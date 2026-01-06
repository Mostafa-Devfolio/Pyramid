


class ApiServices{
    baseUrl='https://pyramid.devfolio.net/api/';


    async getAllVendor(businessTypee: string, mainType: string){
        const query: string[] = [];
        if(businessTypee == 'discounted') query.push(`business-types/${mainType}/vendors/discounted?minDiscountedProducts=20&pagination[page]=1&pagination[pageSize]=8&populate=*`);
        if(businessTypee == 'most') query.push(`business-types/${mainType}/vendors/most-ordered?days=30&pagination[page]=1&pagination[pageSize]=8&populate=*`);
        if(businessTypee == 'top') query.push(`vendors?filters[businessType][slug][$eq]=${mainType}&filters[isActive][$eq]=true&sort[0]=rating:desc&pagination[page]=1&pagination[pageSize]=8&populate=logo`);
        if(businessTypee == 'latest') query.push(`vendors?filters[businessType][slug][$eq]=${mainType}&filters[isActive][$eq]=true&sort[0]=createdAt:desc&pagination[page]=1&pagination[pageSize]=8&populate=logo`);
        if(businessTypee == 'all') query.push(`vendors?filters[businessType][slug][$eq]=${mainType}&filters[isActive][$eq]=true&pagination[page]=1&pagination[pageSize]=20&populate=logo`);
        const response = await fetch(`${this.baseUrl}${query.join("")}`,{
            method: 'get',
        }).then((res)=> res.json());
        if(businessTypee == 'all' || businessTypee == 'latest' || businessTypee == 'top'){            
            return response.data;
        } else{
            return response.data.vendors;
        }
    }

    async getBanner(url: string){
        const response = await fetch(url, {
            method: 'get'
        }).then((res)=> res.json());
        return response.data;
    }

    async getHomeCategories(mainType: string){
        const response = await fetch(`${this.baseUrl}categories?filters[businessType][slug][$eq]=${mainType}&filters[parent][$null]=true&populate=*`, {
            method: 'get',
        }).then((res)=> res.json());
        return response.data;
    }

    async vendorsInCategory(businessId: string,categoryId: string){
        const response = await fetch(`${this.baseUrl}business-types/${businessId}/categories/${categoryId}/target`, {
            method: 'get'
        }).then(res => res.json());
        return response.data.vendors;
    }
    async categoryName(businessId: string,categoryId: string){
        const response = await fetch(`${this.baseUrl}business-types/${businessId}/categories/${categoryId}/target`, {
            method: 'get'
        }).then(res => res.json());
        return response.data
    }

    async vendorPageInfo(vendorId: string){
        const response = await fetch(`${this.baseUrl}vendors?filters[slug][$eq]=${vendorId}&filters[isActive][$eq]=true&populate=*`,{
            method: 'get'
        }).then(res => res.json());
        return response.data[0];
    }

    async vendorPageCategory(vendorId: string){
        const response = await fetch(`${this.baseUrl}categories?filters[vendors][slug][$eq]=${vendorId}&filters[parent][$null]=true&filters[isActive][$eq]=true&sort=order:asc&populate=*`,{
            method: 'get'
        }).then(res => res.json());
        return response.data;
    }

    async vendorPageCoupon(vendorId: string){
        const response = await fetch(`${this.baseUrl}coupons?filters[scope][$eq]=vendor&filters[vendor][slug][$eq]=${vendorId}&filters[isActive][$eq]=true&sort=startsAt:desc`,{
            method: 'get'
        }).then(res => res.json());
        return response.data;
    }

    async vendorPageBanners(vendorId: string){
        const response = await fetch(`${this.baseUrl}banners?filters[vendor][slug][$eq]=${vendorId}&filters[placement][$eq]=vendor_page&filters[isActive][$eq]=true&sort=order:asc&populate=*`,{
            method: 'get'
        }).then(res => res.json());
        return response.data;
    }

    async vendorPageDiscounted(vendorId: string){
        const response = await fetch(`${this.baseUrl}vendors/${vendorId}/products/discounted?page=1&pageSize=12`, {
            method: 'get'
        }).then(res => res.json());
        return response.data.products;
    }

    async productPage(productId: string){
        const response = await fetch(`${this.baseUrl}products?filters[slug][$eq]=${productId}&populate[variants][fields][0]=id
&populate[variants][fields][1]=price
&populate[variants][fields][2]=salePrice
&populate[variants][fields][3]=stock
&populate[variants][populate][options][fields][0]=id
&populate[variants][populate][options][fields][1]=label
&populate[variants][populate][options][populate][group][fields][0]=id
&populate[variants][populate][options][populate][group][fields][1]=name
&populate[optionGroups][populate][options]=true
&populate[vendor][populate]=true
&populate[category][populate]=true
&populate[reviews][populate]=true`, {
            method: 'get'
        }).then(res => res.json());
        console.log(response.data[0]);
        return response.data[0];
    }

    async Register(myData: any, type: string){
        const response = await fetch(`${this.baseUrl}auth/register/${type}`,{
            method: 'POST',
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify(myData)
        });
        const data = await response.json();
        if(!response.ok){
            return data.error;
        } else {
            return data;
        }
    }

    async currency(){
        const response = await fetch(`${this.baseUrl}currencies/default`, {
            method: 'get',
        }).then(res => res.json());
        return response.data;
    }
}

export const getClass = new ApiServices();