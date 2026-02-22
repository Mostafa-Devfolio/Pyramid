'use client';
import { getLoginTo, getLogout } from '@/app/login/login';
import { authContext, useAuth } from '@/lib/ContextAPI/authContext';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from '@heroui/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { getClass } from '@/services/ApiServices';
import { cartCount } from '@/lib/ContextAPI/cartCount';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';

export default function NavBar() {
  const pathName = usePathname();
  const cartItem = useSelector((state: any) => state.cart);
  const [hide, setHide] = useState(false);
  const { auth, setToken, setAuth } = useAuth();
  const [isSelected, setIsSelected] = useState(-1);
  const [apiCount, setApiCount] = useState(0);
  const [menu, setMenu] = useState(false);

  async function getRoute(pageNumber: number) {
    if (pageNumber == 0) {
      router.push('/orders');
    } else if (pageNumber == 1) {
      router.push('address');
    } else if (pageNumber == 2) {
      router.push('loyalty');
    } else if (pageNumber == 3) {
      router.push('wallet');
    }
  }

  function logout() {
    getLogout();
    router.push('/');
    setAuth(false);
    setToken(null);
  }

  useEffect(() => {
    if (pathName == '/') {
      setIsSelected(0);
    } else if (pathName == '/about') {
      setIsSelected(1);
    } else if (pathName == '/contact-us') {
      setIsSelected(2);
    }
  }, []);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { countt, setCountt } = useContext(cartCount);
  async function getCartCount() {
    const tokens = await getLoginTo();
    const data = await getClass.getCartItems(1, tokens);
    setApiCount(data.items.length);
  }

  useEffect(() => {
    getCartCount();
  }, [apiCount, setApiCount]);

  const menuItems = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Contact US', url: '/contact-us' },
  ];
  const router = useRouter();

  return (
    <>
      <div className="grid grid-cols-3 border-b text-center sm:hidden">
        {/* <div className="w-[50%]"></div> */}
        <div className=""></div>
        <h2 className="my-3 text-center">Pyramids</h2>
        <div className="relative flex justify-end pr-3">
          <button onClick={() => router.push('/cart')} className="rounded p-2 text-blue-600">
            <FontAwesomeIcon icon={faShoppingCart} />
          </button>
          {auth ? (
            <div className="absolute flex h-[18px] w-[18px] items-center justify-center rounded-4xl bg-gray-200">
              {countt}
            </div>
          ) : (
            <div className="absolute flex h-[18px] w-[18px] items-center justify-center rounded-4xl bg-gray-200">
              {cartItem.length}
            </div>
          )}
        </div>
      </div>
      <Navbar className="hidden sm:flex" onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="sm:hidden" />
          <NavbarBrand>
            <h3 className="font-bold text-inherit">
              <Link href={'/'}>PYRAMIDS</Link>
            </h3>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden gap-4 text-4xl sm:flex" justify="center">
          <NavbarItem>
            <Link
              onClick={() => setIsSelected(0)}
              className={`rounded-[40px] p-2 hover:bg-black hover:text-white ${isSelected == 0 ? 'bg-black text-white' : ''}`}
              href={'/'}
            >
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              onClick={() => setIsSelected(1)}
              className={`rounded-[40px] p-2 hover:bg-black hover:text-white ${isSelected == 1 ? 'bg-black text-white' : ''}`}
              href={'/about'}
            >
              About
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              onClick={() => setIsSelected(2)}
              className={`rounded-[40px] p-2 hover:bg-black hover:text-white ${isSelected == 2 ? 'bg-black text-white' : ''}`}
              href={'/contact-us'}
            >
              Contact US
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <Link href={'/cart'}>
            <div className="flex items-center gap-10">
              <div className="relative">
                <h2 className="counter">
                  <i className="fa-solid fa-cart-shopping"></i>
                </h2>
                {auth ? (
                  <div className="absolute top-[-5px] right-[-10px] flex h-[22px] w-[22px] items-center justify-center rounded-2xl bg-red-600 text-white">
                    {countt}
                  </div>
                ) : (
                  <div className="absolute top-[-5px] right-[-10px] flex h-[22px] w-[22px] items-center justify-center rounded-2xl bg-red-600 text-white">
                    {cartItem.length}
                  </div>
                )}
              </div>
            </div>
          </Link>
          {!auth ? (
            <>
              {' '}
              <NavbarItem className="hidden lg:flex">
                <Button className="mx-2" as={Link} color="primary" href="/register" variant="flat">
                  Register
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button as={Link} color="primary" href="/login" variant="flat">
                  Login
                </Button>
              </NavbarItem>{' '}
            </>
          ) : (
            <div className="flex items-center gap-7">
              <Dropdown>
                <DropdownTrigger>
                  <h2 onClick={() => router.push('/profile')} className="counter cursor-pointer">
                    <svg
                      width="1.6em"
                      height="1.6em"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="5" y="4" width="14" height="18" rx="2" fill="black" />

                      <path d="M5 8V6C5 4.89543 5.89543 4 7 4H17C18.1046 4 19 4.89543 19 6V8H5Z" fill="#333333" />

                      <circle cx="12" cy="11" r="2.5" fill="white" />

                      <path d="M16.5 19.5H7.5V18.5C7.5 16.5 9 15 12 15C15 15 16.5 16.5 16.5 18.5V19.5Z" fill="white" />
                    </svg>
                  </h2>
                </DropdownTrigger>
                {menu && (
                  <DropdownMenu>
                    <DropdownItem
                      onClick={() => {
                        setMenu(false);
                        getRoute(0);
                      }}
                      key={'orders'}
                    >
                      My Orders
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        setMenu(false);
                        getRoute(1);
                      }}
                      key={'address'}
                    >
                      My Address
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        setMenu(false);
                        getRoute(2);
                      }}
                      key={'loyalty'}
                    >
                      My Loyalty Points
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        setMenu(false);
                        getRoute(3);
                      }}
                      key={'wallet'}
                    >
                      My Wallet
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </Dropdown>
              <NavbarItem>
                <Button
                  as={Link}
                  onClick={() => {
                    logout();
                  }}
                  color="primary"
                  href="#"
                  variant="flat"
                >
                  Logout
                </Button>
              </NavbarItem>
            </div>
          )}
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
                color={index === 2 ? 'primary' : index === menuItems.length - 1 ? 'danger' : 'foreground'}
                href={`${item.url}`}
                size="lg"
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </>
  );

  return (
    <div className="border-b-2 border-gray-300 pt-2">
      <div className="container m-4 mx-auto flex items-center justify-between">
        <h1 className="cursor-default">PYRAMIDS</h1>
        <ul className="flex gap-5 rounded-[40px] bg-black p-5 text-white">
          <li>
            <Link
              onClick={() => setIsSelected(0)}
              className={`rounded-[40px] p-2 ${isSelected == 0 ? 'bg-white text-black' : ''}`}
              href={'/'}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setIsSelected(1)}
              className={`rounded-[40px] p-2 ${isSelected == 1 ? 'bg-white text-black' : ''}`}
              href={'/about'}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setIsSelected(2)}
              className={`rounded-[40px] p-2 ${isSelected == 2 ? 'bg-white text-black' : ''}`}
              href={'/contact-us'}
            >
              Contact US
            </Link>
          </li>
        </ul>
        <div className="flex items-center gap-7">
          <Link href={'/cart'}>
            <div className="flex items-center gap-10">
              <div className="relative">
                <h2 className="counter">
                  <i className="fa-solid fa-cart-shopping"></i>
                </h2>
                <div className="absolute top-[-5px] right-[-10px] flex h-[22px] w-[22px] items-center justify-center rounded-2xl bg-red-600 text-white">
                  {cartItem.length}
                </div>
              </div>
            </div>
          </Link>
          <div className="relative">
            <h2 onClick={() => setHide(!hide)}>
              <i className="fa-solid fa-user"></i>
            </h2>
            {auth ? (
              <div
                className={`absolute top-10 right-0 z-1000 flex flex-col gap-3 rounded-2xl rounded-tl-none bg-gray-50 p-5 pr-15 ${hide ? '' : 'hidden'}`}
              >
                <Link href={'/settings'} onClick={() => setHide(false)}>
                  <h4 className="cursor-pointer">Settings</h4>
                </Link>
                <Link href={'/orders'} onClick={() => setHide(false)}>
                  <h4 className="cursor-pointer">Orders</h4>
                </Link>
                <h4
                  className="cursor-pointer"
                  onClick={() => {
                    setHide(false);
                    logout();
                  }}
                >
                  Logout
                </h4>
              </div>
            ) : (
              <div
                className={`absolute top-10 right-0 z-1000 flex flex-col gap-3 rounded-2xl rounded-tl-none bg-gray-50 p-5 pr-15 ${hide ? '' : 'hidden'}`}
              >
                <Link onClick={() => setHide(false)} className="hover:text-green-600" href={'/login'}>
                  <h4>Login</h4>
                </Link>
                <Link onClick={() => setHide(false)} className="hover:text-green-600" href={'/register'}>
                  <h4>Signup</h4>
                </Link>
              </div>
            )}
          </div>
        </div>
        {/* <Button onClick={() => dispatch(decreaseOne())}>-</Button>
            <Button onClick={() => dispatch(increase(20))}>+</Button>
            <Button onClick={() => dispatch(increaseOne())}>+</Button> */}
      </div>
    </div>
  );
}
