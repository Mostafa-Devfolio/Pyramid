import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'cart-db';
const STORE_NAME = 'cart';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is not available on the server');
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

export async function saveCart(cart: any[]) {
  const db = await getDb();
  await db.put(STORE_NAME, cart, 'cart');
}

export async function loadCart() {
  const db = await getDb();
  return (await db.get(STORE_NAME, 'cart')) || [];
}