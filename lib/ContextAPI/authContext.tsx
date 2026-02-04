"use client"
import { getLoginTo } from "@/app/login/login";
import { getClass } from "@/services/ApiServices";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContext {
    auth: boolean,
    userData: any,
    setAuth: (value: boolean) => void,
    setUserData: (value: any) => void,
    token: any,
    setToken: (value: any) => void,
    isLoading: boolean,
    setIsLoading: (value: boolean) => void,
}

export const authContext = createContext<AuthContext | null>(null);

export default function AuthContextProvider({children}: {children: ReactNode}){
    const [userData, setUserData] = useState<[]|null>(null);
    const [token, setToken] = useState<string>("");
    const [auth, setAuth] = useState<boolean>(token!=null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loginOk();
        async function loginOk(){
            const isOk = await getLoginTo();
            if(isOk){
                setToken(isOk);
                setAuth(true);
                const user = await getClass.userProfile(token);
                setUserData(user);
                setIsLoading(false);
            } else{
                setAuth(false);
                setUserData(null);
                setIsLoading(true);
                setToken("")
            }
        }
        loginOk();
    },[auth, token])
    

    return (<authContext.Provider value={{auth, userData, setAuth, setUserData, token, setToken, setIsLoading, isLoading}}>
        {children}
    </authContext.Provider>)
}