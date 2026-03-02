import { ISearchProperty } from '@/app/interface/booking';
import {
  addAddress,
  addWishList2,
  cancelOrder2,
  cart,
  cart2,
  checkout,
  clearCart,
  coupon,
  courierDelivery,
  items,
  login,
  LoyaltyPoints,
  paymentPayload,
  placeCourier,
  postReview,
  refundRequest,
  returnRequest,
  updatedAddress,
  userType,
  Withdrawal,
} from '@/app/interface/interfaceForApiService';

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

  async Register(myData: userType, type: string) {
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

  async getVendorProduct(vendorId: string, whichSubCat: string) {
    const response = await fetch(
      `${this.baseUrl}vendors/${vendorId}/subcategories/${whichSubCat}/products?&populate=*`,
      {
        method: 'GET',
      }
    ).then((res) => res.json());
    return response;
  }

  async login(userData: login) {
    console.log(userData);
    const response = await fetch(`${this.baseUrl}auth/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      return data;
    } else {
      return data.error;
    }
  }

  async cartAdd(cartData: items, token: string) {
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
    return data2;
  }

  async addItemToCart(itemDetails: cart, token: string) {
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

  async updateItemsInCart(items: cart2, token: string) {
    const response = await fetch(`${this.baseUrl}carts/update-item`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(items),
    });
    const data = await response.json();
    return data;
  }

  async getCartItems(businessId: number, token: string) {
    const response = await fetch(`${this.baseUrl}carts/me?businessTypeId=${businessId}`, {
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
    return data;
  }

  async applyCoupon(couponData: coupon, token: string) {
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

  async clearCart(clear: clearCart, token: string) {
    const response = await fetch(`${this.baseUrl}carts/clear`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(clear),
    });
    const data = await response.json();
    return data;
  }

  async checkout(checkoutData: checkout, token: string) {
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
      return data;
    } catch (err) {
      return err;
    }
  }

  async addAddress(userData: addAddress, token: string) {
    const response = await fetch(`${this.baseUrl}addresses/from-coordinates`, {
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

  async updateAddress(addressId: number, update: updatedAddress, token: string) {
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
    return data.data;
  }

  async cancelOrder(id: string, cancel: cancelOrder2, token: string) {
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

  async refundRequest(orderId: number, body: refundRequest, token: string) {
    const response = await fetch(`${this.baseUrl}orders/${orderId}/refund-request`, {
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

  async returnRequest(orderId: number, body: returnRequest, token: string) {
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

  async postRateReview(token: string, bodyData: postReview) {
    const response = await fetch(`${this.baseUrl}reviews`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data: bodyData }),
    });
    const data = await response.json();
    return data;
  }

  async updateRateReview(token: string, bodyData: postReview, reviewId: number) {
    const response = await fetch(`${this.baseUrl}reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data: bodyData }),
    });
    const data = await response.json();
    return data;
  }

  async getProductById(productId: string) {
    const response = await fetch(`${this.baseUrl}products/${productId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    });
    const data = await response.json();
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
    return data;
  }

  // async addToWallet(token: string, body: any) {
  //   const response = await fetch(`${this.baseUrl}wallet-transactions`, {
  //     method: 'POST',
  //     headers: {
  //       'content-type': 'application/json',
  //       ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //     },
  //     body: JSON.stringify({ data: body }),
  //   });
  //   const data = await response.json();
  //   return data;
  // }

  async addWishList(token: string, body: addWishList2) {
    const response = await fetch(`${this.baseUrl}wishlist`, {
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

  async getWishList(token: string) {
    const response = await fetch(`${this.baseUrl}wishlist`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
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
    return data;
  }

  async getLoyalty(token: string) {
    const response = await fetch(`${this.baseUrl}loyalty/me`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    return data;
  }

  async loyaltyHistory(token: string) {
    const response = await fetch(`${this.baseUrl}loyalty/transactions/me`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    return data;
  }

  async convertLoyaltyToWallet(token: string, myData: LoyaltyPoints) {
    const response = await fetch(`${this.baseUrl}loyalty/convert-to-wallet`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data: myData }),
    });
    const data = await response.json();
    return data;
  }

  async withdrawalLoyaltyCash(token: string, myData: Withdrawal) {
    const response = await fetch(`${this.baseUrl}loyalty/withdraw`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data: myData }),
    });
    const data = await response.json();
    return data;
  }

  async cancelTrip(token: string, tripDocId: string, tripId: number) {
    const response = await fetch(`${this.baseUrl}rides/${tripDocId || tripId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ data: { status: 'cancelled' } }),
    });
    const data = await response.json();
    return data;
  }

  async getMaps(lat: number, lng: number) {
    const response = await fetch(`${this.baseUrl}addresses/reverse-geocode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng }),
    });
    const data = await response.text();
    let json;
    try {
      json = JSON.parse(data);
    } catch (e) {
      return;
    }
    if (response.ok) {
      const mapDetails = json.data?.data || json.data || json;
      return mapDetails;
    } else {
      console.error('Backend refused to geocode:', json);
    }
  }

  async getTaxiCourier(token: string) {
    const response = await fetch(`${this.baseUrl}pricing-config`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    return data.data;
  }

  async getCourier(token: string) {
    const response = await fetch(`${this.baseUrl}parcel-types `, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    return data.data;
  }

  async courierDeliveryFee(getData: courierDelivery, token: string) {
    const response = await fetch(`${this.baseUrl}parcel-bookings/estimate`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      // ✅ FIX: Send getData exactly as is!
      body: JSON.stringify(getData),
    });
    const data = await response.json();
    return data;
  }

  async placeCourier(token: string, myData: placeCourier) {
    const response = await fetch(`${this.baseUrl}parcel-bookings/request`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(myData),
    });
    const data = await response.json();
    return data;
  }

  async universalCheckout(token: string, getData: paymentPayload) {
    const response = await fetch(`${this.baseUrl}checkout/universal`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(getData),
    });
    const data = await response.json();
    return data;
  }

  async getParcel(token: string, userId: number) {
    const response = await fetch(`${this.baseUrl}parcel-bookings/me`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    return data.data;
  }

  async deleteParcelOrder(token: string, userId: string) {
    const response = await fetch(`${this.baseUrl}parcel-bookings/${userId}/cancel`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    return data;
  }

  async properites() {
    const response = await fetch(`${this.baseUrl}properties`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async searchProperties(myData: any) {
    const searchParams = new URLSearchParams(myData)
    const response = await fetch(`${this.baseUrl}properties/search?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async getLocation(locationDetails: string){
    const response = await fetch(`${this.baseUrl}properties/locations?query=${locationDetails}`,{
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
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
