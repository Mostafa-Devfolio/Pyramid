"use server";
import { cookies } from "next/headers";


export async function loginTo(loginJwt: string){
    const cookieStore = await cookies();
    const token = cookieStore.set('authToken', loginJwt, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/' 
    });
}

export async function getLoginTo(){
    const cookieStore = await cookies();
    const tokens = cookieStore.get('authToken');
    const token = tokens?.value ?? '';
    return token;
}

export async function getLogout(){
    const cookieStore = await cookies();
    cookieStore.delete('authToken');
}


















// "use server";
// import { cookies } from "next/headers";


// export async function loginTo(loginJWT: any){
//     const cookieStore = await cookies();
//     const token = cookieStore.set('authToken', loginJWT, {
//         httpOnly: true,
//         sameSite: 'strict',
//         maxAge: 60 * 60 * 24,
//         path: '/'
//     })
// }

// export async function getLoginTo(){
//     const cookieStore = await cookies();
//     const tokens = cookieStore.get('authToken');
//     const token: string = tokens?.value ?? '';
//     return token;
// }

// export async function getLogout(){
//     const cookieStore = await cookies();
//     cookieStore.delete('authToken');
// }