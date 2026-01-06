import { openDB } from 'idb';

const DB_NAME = 'cart-db';
const STORE_NAME = 'cart';

export const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME);
    }
  },
});

export async function saveCart(cart: any[]) {
  const db = await dbPromise;
  await db.put(STORE_NAME, cart, 'cart');
}

export async function loadCart() {
  const db = await dbPromise;
  return (await db.get(STORE_NAME, 'cart')) || [];
}
