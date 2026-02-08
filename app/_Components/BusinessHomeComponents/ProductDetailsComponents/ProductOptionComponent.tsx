'use client';
import {
  IProductDetailsPage,
  Option,
  OptionGroup,
  Variant,
} from '@/app/interface/ProductDetailsPage/productDetailsPageInterface';
import { Button } from '@/components/ui/button';
import { addToCart } from '@/redux/slices/cartSlice';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getClass } from '@/services/ApiServices';
import { authContext } from '@/lib/ContextAPI/authContext';
import { cartCount } from '@/lib/ContextAPI/cartCount';

type optiongroup = {
  products: IProductDetailsPage;
};
export default function ProductOptionComponent({ products }: optiongroup) {
  const cartItem = useSelector((state: any) => state.cart);
  const [errorMsg, setErrorMsg] = useState('');
  const { auth, token } = useContext(authContext);
  const [getCar, setGetCar] = useState([]);
  console.log(products);
  const { countt, setCountt } = useContext(cartCount);

  // Check if a product has a variant
  const haveVariants = useMemo(() => {
    if (products.variants.length == 0) return null;
    return products.variants.reduce((min, variant) => {
      const minPrice = min.salePrice ?? min.price;
      const variantPrice = variant.salePrice ?? variant.price;
      return minPrice < variantPrice ? min : variant;
    });
  }, [products.variants]);
  const dispatch = useDispatch();

  const cartPrice = useMemo(() => {
    if (!auth) {
      return;
    }
    const item = getCar?.items?.find((itemm: any) => products.id == itemm.product.id);
    if (!item) {
      return;
    }

    if (item.variant) {
      const variantPrice = item.variant.salePrice ?? item.variant.price;
      return variantPrice * item.quantity;
    }
    if (!item.variant) {
      const mainPrice = item.product.baseSalePrice ?? item.product.basePrice;
      return mainPrice * item.quantity;
    }
  }, [getCar, products.id, auth]);

  async function getCartItems() {
    const getCart = await getClass.getCartItems(1, token);
    setGetCar(getCart);
    setCountt(getCart.items.length);
    console.log('cart itemssssssssssssssssssssssssssssssssss:', getCart);
  }

  // Function to add items to cart

  async function addToCartt(productsId: any) {
    if (!auth) {
      return;
    }
    const itemss = getCar?.items ?? [];

    const alreadyExists = itemss.some((item: any) => item.product.id === productsId);
    if (alreadyExists) {
      console.log('Cannot add to the cart because it already exists');
      return;
    }

    const cart = {
      businessTypeId: products.businessType.id,
      productId: products.id,
      quantity: 1,
      variantId: isSelected ?? null,
      selectedOptions: [
        {
          groupId: haveVariants?.options[0].group.id,
          optionIds: [haveVariants?.options[0].id],
        },
      ],
    };
    const data = await getClass.addItemToCart(cart, token);
    getCartItems();
  }

  async function removeItem(itemId: number) {
    if (auth) {
      const data = await getClass.removeItemFromCart(itemId);
      setCount(0);
      getCartItems();
    }
    //else {
    //     dispatch(removeFromCart(itemId));
    // }
  }

  async function changeCart(itemId: number, count: number) {
    if (!auth) {
      return;
    }
    if (count == 0) {
      removeItem(itemId);
      getCartItems();
    }
    const cart = {
      cartItemId: itemId,
      quantity: count,
    };
    const data = await getClass.updateItemsInCart(cart);
    getCartItems();
  }

  function addItemToCart() {
    const sameVendor = cartItem.find((item) => item.vendorName != products.vendor.name);
    if (sameVendor) {
      setCount(0);
      setErrorMsg('Please add products from the same vendor only. Clear the cart if you want to add from this vendor.');
      toast.error('Please add products from the same vendor only. Clear the cart if you want to add from this vendor.');
      return null;
    }

    if (haveVariants) {
      dispatch(
        addToCart({
          id: products.id,
          name: products.title,
          quantity: count || 1,
          variantName: haveVariants.options.map((variant: any) => variant.label),
          price:
            haveVariants.salePrice != 0 && haveVariants.salePrice != null ? haveVariants.salePrice : haveVariants.price,
          deliveryFee: products.vendor.deliveryFee,
          vendorName: products.vendor.name,
          businesstype: products.businessType.id,
          variantId: haveVariants.options.map((variant: any) => variant.id),
          selectedOptions: [],
        })
      );
    } else {
      dispatch(
        addToCart({
          id: products.id,
          name: products.title,
          quantity: count || 1,
          variantName: null,
          price:
            products.baseSalePrice != null && products.baseSalePrice != 0 ? products.baseSalePrice : products.basePrice,
          deliveryFee: products.vendor.deliveryFee,
          vendorName: products.vendor.name,
          businesstype: products.businessType.id,
          variantId: null,
          selectedOptions: [],
        })
      );
    }
  }

  // function addItemToCart(){
  //     if(haveVariants){
  //         dispatch(addToCart({
  //             id: products.id,
  //             name: products.title,
  //             price: haveVariants.salePrice != 0 && haveVariants.salePrice != null ? haveVariants.salePrice : haveVariants.price,
  //             image: '',
  //             quantity: count || 1,
  //             variantName: haveVariants.options.map((option: Option) => option.label).join(''),
  //             deliveryFee: products.vendor.deliveryFee,
  //             deliveryTime: products.vendor.deliveryTime,
  //         }))
  //     } else {
  //         dispatch(addToCart({
  //             id: products.id,
  //             name: products.title,
  //             price: products.baseSalePrice != 0 && products.baseSalePrice != null ? products.baseSalePrice : products.basePrice,
  //             image: '',
  //             quantity: count || 1,
  //             deliveryFee: products.vendor.deliveryFee,
  //             deliveryTime: products.vendor.deliveryTime,
  //         }))
  //     }
  // }

  const [isSelected, setIsSelected] = useState<number | null>(null);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [basePrice, setBasePrice] = useState(0);
  const [stock, setStock] = useState<number>(0);
  const [count, setCount] = useState<number | null>(null);

  // Setting the initial base price, sale price if available, stock and which variant is selected
  useEffect(() => {
    getCartItems();
    if (!haveVariants) return;
    setIsSelected(haveVariants.id);
    setSalePrice(haveVariants.salePrice);
    setBasePrice(haveVariants.price);
    setStock(haveVariants.stock);
    setTimeout(() => console.log(getCar), 3000);
    // const cartId = getCar?.items.
  }, [haveVariants, getCartItems]);

  // Decrease quantity
  function decrease() {
    if (count <= 0) {
      return;
    }
    setCount(count - 1);
  }

  // Increase quantity
  function increase() {
    setCount(count + 1);
  }

  return (
    <>
      {/* Vairants options to select */}
      <ul className="my-3 flex gap-4">
        {products.variants.map((variant: Variant) => (
          <li
            key={variant.id}
            onClick={() => {
              setIsSelected((prev) => (prev == variant.id ? null : variant.id));
              setStock(variant.stock);
              setSalePrice(variant.salePrice);
              setBasePrice(variant.price);
            }}
            className={`rounded-2xl border p-4 ${isSelected == variant.id ? 'border-black' : ''}`}
          >
            {variant.options[0].label}
          </li>
        ))}
      </ul>

      {/* Price of each variant with sale price if available */}
      <div className="flex items-center gap-2">
        <h3>Price:</h3>
        {salePrice != 0 && (
          <div className="flex gap-3">
            {salePrice && <h3>{salePrice}</h3>}
            {salePrice ? (
              <h3 className="text-red-600 line-through">{basePrice}</h3>
            ) : (
              <h3 className="text-green-600">{basePrice}</h3>
            )}
          </div>
        )}
        {!haveVariants && (
          <div className="flex gap-3">
            {products.baseSalePrice && <h3>{products.baseSalePrice}</h3>}
            {products.baseSalePrice ? (
              <h3 className="text-red-600 line-through">{products.basePrice}</h3>
            ) : (
              <h3 className="text-green-600">{products.basePrice}</h3>
            )}
          </div>
        )}
      </div>

      {/* Short decription */}
      {products.shortDescription && (
        <div className="mt-3 flex items-center gap-2">
          <i className="fa-solid fa-check"></i>
          <p>{products.shortDescription}</p>
        </div>
      )}

      {/* Stock available */}
      <div className="mt-3">
        {haveVariants && <h4 className="text-green-500">Stock: {stock}</h4>}
        {!haveVariants && <h4 className="text-green-500">Stock: {products.stock}</h4>}
      </div>

      {/* Add To Cart & Quantity Button */}
      <div className="mt-3 flex gap-3">
        <div className="flex items-center gap-2 rounded-2xl border">
          <div className="">
            {(count == null || count == 0) && !getCar?.items?.some((ite: any) => products.id == ite.product.id) ? (
              <Button
                onClick={() => {
                  setCount(count + 1);
                  addItemToCart();
                  addToCartt(products.id);
                }}
              >
                Add To Cart
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                {auth ? (
                  getCar?.items?.map(
                    (itemm: any) =>
                      products.id == itemm.product.id && (
                        <Button
                          key={itemm.id}
                          onClick={() => {
                            changeCart(itemm.id, itemm.quantity - 1);
                          }}
                        >
                          -
                        </Button>
                      )
                  )
                ) : (
                  <Button
                    onClick={() => {
                      decrease();
                      addItemToCart();
                      addToCartt(products.id);
                    }}
                  >
                    -
                  </Button>
                )}
                {auth ? (
                  getCar?.items?.map(
                    (itemm: any) => products.id == itemm.product.id && <p key={itemm.id}>{itemm.quantity}</p>
                  )
                ) : (
                  <p>{count}</p>
                )}
                {auth ? (
                  getCar?.items?.map(
                    (itemm: any) =>
                      products.id == itemm.product.id && (
                        <Button
                          key={itemm.id}
                          onClick={() => {
                            changeCart(itemm.id, itemm.quantity + 1);
                          }}
                        >
                          +
                        </Button>
                      )
                  )
                ) : (
                  <Button
                    onClick={() => {
                      increase();
                      addItemToCart();
                      addToCartt(products.id);
                    }}
                  >
                    +
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Total price after adding quantity */}
      <div className="my-7">
        {auth && cartPrice != null ? (
          <h4>Total: {cartPrice}</h4>
        ) : (
          <h4 className="flex items-center gap-2">
            Total:
            {salePrice != 0 && (
              <div className="flex gap-3">
                {salePrice ? (
                  <h3>{Math.round(salePrice * count * 100) / 100}</h3>
                ) : (
                  <h3>{Math.round(basePrice * count * 100) / 100}</h3>
                )}
              </div>
            )}
            {!haveVariants && (
              <div className="flex gap-3">
                {products.baseSalePrice ? (
                  <h3>{Math.round(products.baseSalePrice * count * 100) / 100}</h3>
                ) : (
                  <h3 className="text-green-600">{Math.round(products.basePrice * count * 100) / 100}</h3>
                )}
              </div>
            )}
          </h4>
        )}
      </div>
      {errorMsg && (
        <div className="bg-border mt-5 rounded-2xl border p-3 text-red-600">
          <p>{errorMsg}</p>
        </div>
      )}
    </>
  );
}
