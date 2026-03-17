"use server"
import { cookies } from "next/headers";

export async function logOutNow() {
  const cookieStore = await cookies();
  cookieStore.delete('authToken');
}
