import { getLoginTo } from '@/app/login/login';

class ApiServices {
  baseUrl = 'https://pyramid.devfolio.net/api/';

  async getAllVendor(businessTypee: string, mainType: string) {
    const query: string[] = [];
    if (businessTypee == 'discounted')
      query.push(
        `business-types/${mainType}/vendors/discounted?minDiscountedProducts=20&pagination[page]=1&pagination[pageSize]=8&populate=*`
      );
    if (businessTypee == 'most')
      query.push(
        `business-types/${mainType}/vendors/most-ordered?days=30&pagination[page]=1&pagination[pageSize]=8&populate=*`
      );
    if (businessTypee == 'top')
      query.push(
        `vendors?filters[businessType][slug][$eq]=${mainType}&filters[isActive][$eq]=true&sort[0]=rating:desc&pagination[page]=1&pagination[pageSize]=8&populate=logo`
      );
    if (businessTypee == 'latest')
      query.push(
        `vendors?filters[businessType][slug][$eq]=${mainType}&filters[isActive][$eq]=true&sort[0]=createdAt:desc&pagination[page]=1&pagination[pageSize]=8&populate=logo`
      );
    if (businessTypee == 'all')
      query.push(
        `vendors?filters[businessType][slug][$eq]=${mainType}&filters[isActive][$eq]=true&pagination[page]=1&pagination[pageSize]=20&populate=logo`
      );
    const response = await fetch(`${this.baseUrl}${query.join('')}`, {
      method: 'get',
    }).then((res) => res.json());
    if (businessTypee == 'all' || businessTypee == 'latest' || businessTypee == 'top') {
      return response.data;
    } else {
      return response.data.vendors;
    }
  }

  async getBanner(url: string) {
    const response = await fetch(url, {
      method: 'get',
    }).then((res) => res.json());
    return response.data;
  }

  async getHomeCategories(mainType: string) {
    const response = await fetch(
      `${this.baseUrl}categories?filters[businessType][slug][$eq]=${mainType}&filters[parent][$null]=true&populate=*`,
      {
        method: 'get',
      }
    ).then((res) => res.json());
    return response.data;
  }

  async vendorsInCategory(businessId: string, categoryId: string) {
    const response = await fetch(`${this.baseUrl}business-types/${businessId}/categories/${categoryId}/target`, {
      method: 'get',
    }).then((res) => res.json());
    return response.data?.vendors;
  }
  async categoryName(businessId: string, categoryId: string) {
    const response = await fetch(`${this.baseUrl}business-types/${businessId}/categories/${categoryId}/target`, {
      method: 'get',
    }).then((res) => res.json());
    return response.data;
  }

  async vendorPageInfo(vendorId: string) {
    const response = await fetch(
      `${this.baseUrl}vendors?filters[slug][$eq]=${vendorId}&filters[isActive][$eq]=true&populate=*`,
      {
        method: 'get',
      }
    ).then((res) => res.json());
    return response.data[0];
  }

  async vendorPageCategory(vendorId: string) {
    const response = await fetch(
      `${this.baseUrl}categories?filters[vendors][slug][$eq]=${vendorId}&filters[parent][$null]=true&filters[isActive][$eq]=true&sort=order:asc&populate=*`,
      {
        method: 'get',
      }
    ).then((res) => res.json());
    return response.data;
  }

  async vendorPageCoupon(vendorId: string) {
    const response = await fetch(
      `${this.baseUrl}coupons?filters[scope][$eq]=vendor&filters[vendor][slug][$eq]=${vendorId}&filters[isActive][$eq]=true&sort=startsAt:desc`,
      {
        method: 'get',
      }
    ).then((res) => res.json());
    return response.data;
  }

  async vendorPageBanners(vendorId: string) {
    const response = await fetch(
      `${this.baseUrl}banners?filters[vendor][slug][$eq]=${vendorId}&filters[placement][$eq]=vendor_page&filters[isActive][$eq]=true&sort=order:asc&populate=*`,
      {
        method: 'get',
      }
    ).then((res) => res.json());
    return response.data;
  }

  async vendorPageDiscounted(vendorId: string) {
    const response = await fetch(`${this.baseUrl}vendors/${vendorId}/products/discounted?page=1&pageSize=12`, {
      method: 'get',
    }).then((res) => res.json());
    return response.data.products;
  }

  async productPage(productId: string) {
    const response = await fetch(
      `${this.baseUrl}products?filters[slug][$eq]=${productId}&populate[variants][fields][0]=id
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
&populate[reviews][populate]=true
&populate[businessType][populate]=true`,
      {
        method: 'get',
      }
    ).then((res) => res.json());
    return response.data[0];
  }

  async Register(myData: any, type: string) {
    const response = await fetch(`${this.baseUrl}auth/register/${type}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(myData),
    });
    const data = await response.json();
    if (!response.ok) {
      return data.error;
    } else {
      return data;
    }
  }

  async getVendorProduct(vendorId:string, whichSubCat:string) {
    const response = await fetch(`${this.baseUrl}vendors/${vendorId}/subcategories/${whichSubCat}/products?&populate=*`, {
      method: 'GET',
    }).then((res) => res.json());
    console.log(response);
    return response;
  }

  async login(userData: any) {
    const response = await fetch(`${this.baseUrl}auth/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Success From api auth:::: ',data);
      return data;
    } else {
      console.log('Error From api auth:::: ',data.error);
      return data.error;
    }
  }

  async cartAdd(cartData: any, token: string) {
    const response = await fetch(`${this.baseUrl}carts/add-item`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(cartData),
    });
    const data = await response.json();
  }

  async cartUpdate(itemId: number, token: string) {
    const response = await fetch(`${this.baseUrl}carts/update-item`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer: ${token}` } : {}),
      },
    });
  }

  async userProfile(token: string) {
    const response = await fetch(`${this.baseUrl}me?&populate[image][populate]=true`, {
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    const data2 = await data.user;
    console.log(data);
    return data2;
  }

  async addItemToCart(itemDetails: any, token: any) {
    console.log(token);
    const response = await fetch(`${this.baseUrl}carts/add-item`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(itemDetails),
    });
    const data = await response.json();
    return data;
  }

  async updateItemsInCart(items: any, token: string) {
    const response = await fetch(`${this.baseUrl}carts/update-item`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(items),
    });
    const data = await response.json();
    console.log('Increase', data);
    return data;
  }

  async getCartItems(businessId: number, token: any) {
    const response = await fetch(`${this.baseUrl}carts/me?businessTypeId=1`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    const datas = data.data;
    return datas;
  }

  async removeItemFromCart(cartItemId: number, token: string) {
    const response = await fetch(`${this.baseUrl}carts/remove-item`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ cartItemId }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async applyCoupon(couponData: any, token: string) {
    const response = await fetch(`${this.baseUrl}carts/apply-coupon`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(couponData),
    });
    const data = await response.json();
    return data;
  }

  async clearCart(clear: any, token: string) {
    const response = await fetch(`${this.baseUrl}carts/clear`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(clear),
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async checkout(checkoutData: any, token: string) {
    try {
      const response = await fetch(`${this.baseUrl}orders/checkout`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(checkoutData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      console.log('success', data);
      return data;
    } catch (err) {
      console.log('failed', err);
      return err;
    }
  }

  async addAddress(userData: any, token: string) {
    const response = await fetch(`${this.baseUrl}addresses`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        data: userData,
      }),
    });
    const data = await response.json();
    return data;
  }

  async getAddress(token: string) {
    const response = await fetch(`${this.baseUrl}addresses`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    return data.data;
  }

  async updateAddress(addressId: any, update: any, token: string) {
    const response = await fetch(`${this.baseUrl}addresses/${addressId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        data: update,
      }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async getOrders(token: string) {
    const response = await fetch(`${this.baseUrl}orders`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    console.log(data);
    return data.data;
  }

  async cancelOrder(id: number, cancel: any, token: string) {
    const response = await fetch(`${this.baseUrl}orders/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data: cancel }),
    });
    const data = await response.json();
    return data;
  }

  async refundRequest(orderId: number, body: any, token: string) {
    const response = await fetch(`${this.baseUrl}orders/${orderId}/refund-request`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data: body }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async returnRequest(orderId: number, body: any, token: string) {
    const response = await fetch(`${this.baseUrl}orders/${orderId}/return-request`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data: body }),
    });
    const data = await response.json();
    return data;
  }

  async postRateReview(token: string, bodyData: any) {
    const response = await fetch(`${this.baseUrl}reviews`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data: bodyData }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async updateRateReview(token: string, bodyData: any, reviewId: number) {
    const response = await fetch(`${this.baseUrl}reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data: bodyData }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async getProductById(productId: number) {
    console.log(productId);
    const response = await fetch(`${this.baseUrl}products/${productId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async getWalletHistory(token: string) {
    const response = await fetch(`${this.baseUrl}wallet-transactions`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async addToWallet(token: string, body: any) {
    const response = await fetch(`${this.baseUrl}wallet-transactions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data: body }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async addWishList(token: string, body: any) {
    const response = await fetch(`${this.baseUrl}wishlist`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data: body }),
    });
    const data = await response.json();
    console.log('WishList', data);
    return data;
  }

  async getWishList(token: string) {
    const response = await fetch(`${this.baseUrl}wishlist`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    console.log('GET WishList', data);
    return data;
  }

  async removeWishList(token: string, wishlistId: number) {
    const response = await fetch(`${this.baseUrl}wishlist/${wishlistId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    console.log();
    return data;
  }

  async getLoyalty(token: string){
    const response = await fetch(`${this.baseUrl}loyalty/me`,{
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        ...(token ? {Authorization: `Bearer ${token}`} : {})
      }
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async loyaltyHistory(token: string){
    const response = await fetch(`${this.baseUrl}loyalty/transactions/me`,{
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        ...(token ? {Authorization: `Bearer ${token}`} : {})
      }
    });
    const data = await response.json();
    console.log("history", data);
    return data;
  }

  async convertLoyaltyToWallet(token: string, myData: any){
    const response = await fetch(`${this.baseUrl}loyalty/convert-to-wallet`,{
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? {Authorization: `Bearer ${token}`} : {})
      },
      body: JSON.stringify({data: myData})
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async withdrawalLoyaltyCash(token: string, myData: any){
    const response = await fetch(`${this.baseUrl}loyalty/withdraw`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? {Authorization: `Bearer ${token}`} : {})
      },
      body: JSON.stringify({data: myData})
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async currency() {
    const response = await fetch(`${this.baseUrl}currencies/default`, {
      method: 'get',
    }).then((res) => res.json());
    return response.data;
  }
}

export const getClass = new ApiServices();
