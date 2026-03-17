export interface userType {
  username: string;
  email: string;
  password: string;
  gender: string;
  phoneCountryIso2: string;
  phoneNumber: string;
}

export interface login {
  email: string;
  password: string;
}

export interface items {
  businessTypeId: number;
  productId: number;
  quantity: number;
  variantId: null;
  selectedOptions: any;
}

export interface cart {
  businessTypeId: number;
  productId: number;
  quantity: number;
  variantId: number | null;
  selectedOptions: {
    groupId: number | undefined;
    optionIds: (number | undefined)[];
  }[];
}

export interface cart2 {
    cartItemId: number;
    quantity: number;
}

export interface coupon {
    businessTypeId: number;
    code: string;
}

export interface clearCart {
    businessTypeId: number;
}

export interface checkout {
    addressId: number;
    paymentMethod: string;
    businessTypeId: number;
    tipAmount: number;
    customerNote: string;
    deliverTo: string;
    recipientName: string;
    recipientPhone: number | null;
    deliveryTimingType: string;
    deliveryScheduledAt: string | null;
    useWallet: boolean;
    recurrence: string;
    subscriptionTimeOfDay: string | null;
    subscriptionDayOfWeek: number | null;
    subscriptionDayOfMonth: number | null;
}

export interface addAddress {
    lat: number;
    lng: number;
    label: string;
    street: string;
    building: string;
    floor: string;
    apartment: string;
    city: string;
    other: string;
    isDefault: boolean;
}

export interface updatedAddress {
    isDefault: boolean;
}

export interface cancelOrder2 {
    status: string;
    fulfillmentStatus: string;
    paymentStatus: string;
}

export interface refundRequest {
    message: string;
    reason: string;
}

export interface returnRequest {
    message: string;
    reason: string;
}

export interface postReview {
    rating: number;
    comment: string;
    product?: number;
    vendor?: number;
    order: number;
}

export interface addWishList2 {
    productId: number;
}

export interface LoyaltyPoints {
    points: number;
}

export interface Withdrawal {
    points: number;
    bankDetails: {
        bankName: string;
        accountNumber: number | null;
        holderName: string;
    };
}

export interface courierDelivery {
    parcelTypeId: string | null;
    pickupLocation: {
        lat: number | undefined;
        lng: number | undefined;
        address: string;
    };
    dropoffLocation: {
        lat: number | undefined;
        lng: number | undefined;
        address: string;
    };
    receiverName: string;
    receiverPhone: string;
}

export interface placeCourier {
    parcelType: string | null;
    parcelTypeString: string;
    pickupLocation: {
        lat: number | undefined;
        lng: number | undefined;
        address: string;
    };
    dropoffLocation: {
        lat: number | undefined;
        lng: number | undefined;
        address: string;
    };
    pickupLat: number | undefined;
    pickupLng: number | undefined;
    dropoffLat: number | undefined;
    dropoffLng: number | undefined;
    distanceKm: number | undefined;
    receiverName: string;
    receiverPhone: string;
    senderName: string;
    senderPhone: string;
    generalNotes: string;
    estimatedPrice: number | undefined;
    senderAddress: string;
    recipientAddress: string;
    payer: "sender" | "receiver";
    paymentMethod: "cash" | "wallet" | "online";
}

export interface paymentPayload {
    moduleType: string;
    moduleId: number;
    amountEgp: number | undefined;
    paymentMethod: "cash" | "online" | "wallet";
    couponCode: string | undefined;
    deliveryFeeEgp: number | undefined;
}