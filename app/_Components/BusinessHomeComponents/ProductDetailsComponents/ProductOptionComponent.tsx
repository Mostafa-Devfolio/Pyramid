"use client"
import { IProductDetailsPage, Option, OptionGroup, Variant } from '@/app/interface/ProductDetailsPage/productDetailsPageInterface'
import { Button } from '@/components/ui/button';
import { addToCart } from '@/redux/slices/cartSlice';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

type optiongroup = {
    products: IProductDetailsPage,
}
export default function ProductOptionComponent({products}: optiongroup) {

    const cartItem = useSelector((state: any) => state.cart);
    const [errorMsg, setErrorMsg] = useState("")

    // Check if a product has a variant
    const haveVariants = useMemo(() => {
        if (products.variants.length == 0) return null;
        return products.variants.reduce((min, variant) => {
            const minPrice = min.salePrice ?? min.price;
            const variantPrice = variant.salePrice ?? variant.price;
            return minPrice < variantPrice ? min : variant;
        })
    }, [products.variants]);
    const dispatch = useDispatch();

    // Function to add items to cart

    function addItemToCart() {

        const sameVendor = cartItem.find((item) => item.vendorName != products.vendor.name);
        if(sameVendor){
            setCount(0);
            setErrorMsg("Please add products from the same vendor only. Clear the cart if you want to add from this vendor.");
            toast.error('Please add products from the same vendor only. Clear the cart if you want to add from this vendor.');
            return null;
        }

        if(haveVariants){
            dispatch(addToCart({
                id: products.id,
                name: products.title,
                quantity: count || 1,
                variantName: haveVariants.options.map((variant: any) => variant.label),
                price: haveVariants.salePrice != 0 && haveVariants.salePrice != null ? haveVariants.salePrice : haveVariants.price,
                deliveryFee: products.vendor.deliveryFee,
                vendorName: products.vendor.name
            }))
        } else {
            dispatch(addToCart({
                id: products.id,
                name: products.title,
                quantity: count || 1,
                variantName: null,
                price: products.baseSalePrice != null && products.baseSalePrice != 0 ? products.baseSalePrice : products.basePrice,
                deliveryFee: products.vendor.deliveryFee,
                vendorName: products.vendor.name
            }))
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

    const [isSelected, setIsSelected] = useState<number|null>(null);
    const [salePrice, setSalePrice] = useState<number>(0);
    const [basePrice, setBasePrice] = useState(0);
    const [stock, setStock] = useState<number>(0);
    const [count, setCount] = useState<number|null>(null);

    // Setting the initial base price, sale price if available, stock and which variant is selected
    useEffect(() => {
        if(!haveVariants) return;
        setIsSelected(haveVariants.id);
        setSalePrice(haveVariants.salePrice);
        setBasePrice(haveVariants.price);
        setStock(haveVariants.stock);
    },[haveVariants]);

    // Decrease quantity
    function decrease(){
        if(count <= 0){
            return;
        }
        setCount(count-1);
    }

    // Increase quantity
    function increase(){
        setCount(count+1);
    }
    
    return (<>
    {/* Vairants options to select */}
    <ul className='flex gap-4 my-3'>
            {products.variants.map((variant: Variant) => (
                <li key={variant.id} onClick={() => {setIsSelected(prev => prev == variant.id ? null : variant.id); setStock(variant.stock); setSalePrice(variant.salePrice); setBasePrice(variant.price)}} className={`border p-4 rounded-2xl rounded-2xl ${isSelected == variant.id ? 'border-black' : ''}`}>{variant.options[0].label}</li>
            ))}
    </ul>

    {/* Price of each variant with sale price if available */}
    <div className="flex gap-2 items-center">
        <h3>Price:</h3>
        {salePrice != 0 && <div className='flex gap-3'>
            {salePrice && <h3>{salePrice}</h3>}
            {salePrice ? <h3 className='line-through text-red-600'>{basePrice}</h3> : <h3 className='text-green-600'>{basePrice}</h3>}
        </div>}
        {(!haveVariants) && <div className='flex gap-3'>
            {products.baseSalePrice && <h3>{products.baseSalePrice}</h3>}
            {products.baseSalePrice ? <h3 className='line-through text-red-600'>{products.basePrice}</h3> : <h3 className='text-green-600'>{products.basePrice}</h3>}
        </div>}
    </div>

    {/* Short decription */}
    {products.shortDescription && <div className="flex gap-2 items-center mt-3">
            <i className="fa-solid fa-check"></i>
            <p>{products.shortDescription}</p>
    </div>}

    {/* Stock available */}
    <div className="mt-3">
        {(haveVariants) && <h4 className='text-green-500'>Stock: {stock}</h4>}
        {(!haveVariants) && <h4 className='text-green-500'>Stock: {products.stock}</h4>}
    </div>

    {/* Add To Cart & Quantity Button */}
    <div className="flex gap-3 mt-3">
        <div className='border rounded-2xl flex items-center gap-2'>
            <div className="">
                {count == null || count == 0 ? <Button onClick={() => {setCount(count+1); addItemToCart()}}>Add To Cart</Button> : 
                    <div className="flex items-center gap-3">
                        <Button onClick={() => {decrease(); addItemToCart()}}>-</Button>
                        {<p>{count}</p>}
                        <Button onClick={() => {increase(); addItemToCart()}}>+</Button>
                    </div>
                }
            </div>
        </div>
    </div>

    {/* Total price after adding quantity */}
    <div className="my-7">
        <h4 className='flex gap-2 items-center'>Total: 
        {salePrice != 0 && <div className='flex gap-3'>
        {salePrice ? <h3>{Math.round(salePrice * count * 100)/100}</h3> : <h3>{Math.round(basePrice * count * 100)/100}</h3> }</div>}
        
        {(!haveVariants) && <div className='flex gap-3'>
        {products.baseSalePrice ? <h3>{Math.round(products.baseSalePrice * count * 100)/100}</h3> : <h3 className='text-green-600'>{Math.round(products.basePrice * count * 100)/100}</h3>}
        </div>}</h4>
    </div>
    {errorMsg && <div className="mt-5 text-red-600 border p-3 rounded-2xl bg-border">
        <p>{errorMsg}</p>
    </div>}
    </>
    )
}
