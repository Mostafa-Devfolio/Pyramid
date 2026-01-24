"use client"
import { getClass } from "@/services/ApiServices";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContext {
    auth: boolean,
    userData: any,
    setAuth: (value: boolean) => void,
    setUserData: (value: any) => void,
    token: any,
    setToken: (value: any) => void
}

export const authContext = createContext<AuthContext | null>(null);

export default function AuthContextProvider({children}: {children: ReactNode}){
    const [auth, setAuth] = useState<boolean>(localStorage.getItem("user")!=null);
    const [userData, setUserData] = useState<[]|null>(null);
    const [token, setToken] = useState<string|null>(null);

    useEffect(() => {
        async function userInfo(){
            const user = await getClass.userProfile();
            setUserData(user);
        }
        if(auth){
            userInfo();
        } else {
            setUserData(null);
        }
    },[auth])
    

    return (<authContext.Provider value={{auth, userData, setAuth, setUserData, token, setToken}}>
        {children}
    </authContext.Provider>)
}