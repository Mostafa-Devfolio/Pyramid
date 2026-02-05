"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./_Components/Navbar/Navbar";
import Footer from "./_Components/Footer/Footer";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import ReactQueryProviders from "@/lib/ReactQueryProvider/ReactQueryProvider";
import ReduxProvider from "@/lib/ReduxProvider/ReduxProvider";
import ReduxProviders from "@/redux/ReduxProviders/Providers";
import CartSave from "./_Components/BusinessHomeComponents/CartSaveComponents/page";
import { Toaster } from 'react-hot-toast';
import AuthContextProvider from "@/lib/ContextAPI/authContext";
import NavBar from "./_Components/Navbar/Navbar";
import {HeroUIProvider} from "@heroui/react";
import Statusbar from "./_Components/Statusbar/Statusbar";

config.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
            <ReduxProviders>
              <CartSave />
              <AuthContextProvider>
                <ReactQueryProviders>
                  <HeroUIProvider>
                  <Toaster />
                  <NavBar/>
                  <div className="w-[90%] mx-auto mb-15 sm:mb-0">
                    {children}
                    <Statusbar/>
                  </div>
                  <Footer/>
                  </HeroUIProvider>
                </ReactQueryProviders>
              </AuthContextProvider>
            </ReduxProviders>
        
      </body>
    </html>
  );
}
