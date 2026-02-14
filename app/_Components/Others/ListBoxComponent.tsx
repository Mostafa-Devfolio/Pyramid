"use client"
import { authContext } from '@/lib/ContextAPI/authContext';
import { Listbox, ListboxItem, ListboxSection, cn } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { logOutNow } from './Logout';

export const AddNoteIcon = (props) => {
  return (
    <svg width="3em" height="3em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 4C12.5523 4 13 4.44772 13 5V5.1C13.92 5.23 14.79 5.54 15.57 5.99L16.27 5.29C16.66 4.9 17.29 4.9 17.68 5.29L18.71 6.32C19.1 6.71 19.1 7.34 18.71 7.73L18.01 8.43C18.46 9.21 18.77 10.08 18.9 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H18.9C18.77 13.92 18.46 14.79 18.01 15.57L18.71 16.27C19.1 16.66 19.1 17.29 18.71 17.68L17.68 18.71C17.29 19.1 16.66 19.1 16.27 18.71L15.57 18.01C14.79 18.46 13.92 18.77 13 18.9V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V18.9C10.08 18.77 9.21 18.46 8.43 18.01L7.73 18.71C7.34 19.1 6.71 19.1 6.32 18.71L5.29 17.68C4.9 17.29 4.9 16.66 5.29 16.27L5.99 15.57C5.54 14.79 5.23 13.92 5.1 13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H5.1C5.23 10.08 5.54 9.21 5.99 8.43L5.29 7.73C4.9 7.34 4.9 6.71 5.29 6.32L6.32 5.29C6.71 4.9 7.34 4.9 7.73 5.29L8.43 5.99C9.21 5.54 10.08 5.23 11 5.1V5C11 4.44772 11.4477 4 12 4Z"
        fill="#4A90E2"
      />

      <circle cx="12" cy="12" r="5" fill="#357ABD" />

      <circle cx="12" cy="12" r="2.5" fill="white" />
    </svg>
  );
};

export const CopyDocumentIcon = (props) => {
  return (
    <svg width="3em" height="3em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="4" width="14" height="18" rx="2" fill="#4A90E2" />

      <rect x="9" y="2" width="6" height="4" rx="1" fill="#357ABD" />

      <rect x="8" y="9" width="8" height="2" rx="1" fill="white" />
      <rect x="8" y="13" width="8" height="2" rx="1" fill="white" />

      <path d="M7 10L7.8 10.8L9 9.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path
        d="M7 14L7.8 14.8L9 13.5"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export const EditDocumentIcon = (props) => {
  return (
    <svg width="3em" height="3em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#E53935" />

      <circle cx="12" cy="9" r="3" fill="white" />
    </svg>
  );
};
export const WalletDocumentIcon = (props) => {
  return (
    <svg width="3em" height="3em" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="40" width="96" height="64" rx="12" fill="#4A90E2" />

      <path d="M16 56H96C104 56 112 52 112 46C112 40 104 36 96 36H28C20 36 16 40 16 46V56Z" fill="#357ABD" />

      <rect x="28" y="64" width="72" height="28" rx="6" fill="#FFFFFF" opacity="0.9" />

      <circle cx="92" cy="78" r="6" fill="#4A90E2" />
    </svg>
  );
};
export const LoyaltyDocumentIcon = (props) => {
  return (
    <svg width="3em" height="3em" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="64" cy="64" r="56" fill="#F4B400" />

      <circle cx="64" cy="64" r="46" fill="#FFD95A" />

      <path d="M64 36L71.8 55.2L92 57.2L76 70.8L81 90L64 79.5L47 90L52 70.8L36 57.2L56.2 55.2L64 36Z" fill="#FFFFFF" />

      <circle cx="94" cy="34" r="14" fill="#34A853" />
      <path d="M94 27V41M87 34H101" stroke="white" stroke-width="3" stroke-linecap="round" />
    </svg>
  );
};

export const DeleteDocumentIcon = (props) => {
  return (
    <svg width="3em" height="3em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="2" fill="#4A90E2" />

      <rect x="17" y="4" width="3" height="16" rx="1" fill="#357ABD" />

      <path
        d="M7 12H15M15 12L11.5 8.5M15 12L11.5 15.5"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export const WishListDocumentIcon = (props) => {
  return (
    <svg width="3em" height="3em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="4" width="14" height="18" rx="2" fill="#4A90E2" />

      <path d="M5 10V6C5 4.89543 5.89543 4 7 4H17C18.1046 4 19 4.89543 19 6V10H5Z" fill="#357ABD" />

      <path
        d="M12 18.5L10.91 17.4C7.035 13.9 4.5 11.59 4.5 8.76C4.5 7.57 4.965 6.45 5.75 5.64C6.535 4.83 7.615 4.375 8.8 4.375C9.985 4.375 11.065 4.83 11.85 5.64L12 5.79L12.15 5.64C12.935 4.83 14.015 4.375 15.2 4.375C16.385 4.375 17.465 4.83 18.25 5.64C19.035 6.45 19.5 7.57 19.5 8.76C19.5 11.59 16.965 13.9 13.09 17.4L12 18.5Z"
        fill="white"
        transform="translate(0, 4) scale(0.65) translate(6.5, 6)"
      />
      <path
        d="M12 19.5L10.65 18.35C7.2 15.2 5 13.2 5 10.5C5 8.5 6.5 7 8.5 7C9.9 7 11.25 7.8 12 9.2C12.75 7.8 14.1 7 15.5 7C17.5 7 19 8.5 19 10.5C19 13.2 16.8 15.2 13.35 18.35L12 19.5Z"
        fill="white"
      />
    </svg>
  );
};

export const ListboxWrapper = ({ children }) => (
  <div className="border-small rounded-small border-default-200 dark:border-default-100 w-full max-w-[100%] px-1 py-2">
    {children}
  </div>
);

export default function ListBoxComponent() {
  const iconClasses = 'text-xl text-default-500 pointer-events-none shrink-0';
  const router = useRouter();
  const { auth, setAuth, setToken } = useContext(authContext);
  function logout() {
    getLogout();
    setAuth(false);
    setToken(null);
  }
  async function getLogout() {
    await logOutNow()
    router.push('/')
  }

  return (
    <ListboxWrapper>
      <Listbox aria-label="Listbox menu with sections" className="w-[100%]" variant="flat">
        <ListboxSection showDivider title="Actions">
          <ListboxItem
            onClick={() => router.push('/settings')}
            key="settings"
            description="Change your account data."
            startContent={<AddNoteIcon className={iconClasses} />}
          >
            Settings
          </ListboxItem>
          <ListboxItem
            onClick={() => router.push('/orders')}
            key="orders"
            description="View your orders"
            startContent={<CopyDocumentIcon className={iconClasses} />}
          >
            My Orders
          </ListboxItem>
          <ListboxItem
            onClick={() => router.push('/address')}
            key="address"
            description="add, edit or remove addresses"
            startContent={<EditDocumentIcon className={iconClasses} />}
          >
            My Addresses
          </ListboxItem>
          <ListboxItem
            onClick={() => router.push('/wishlist')}
            key="wish"
            description="Wishlisted products here"
            startContent={<WishListDocumentIcon className={iconClasses} />}
          >
            Wishlist
          </ListboxItem>
          <ListboxItem
            onClick={() => router.push('/loyalty')}
            key="loyalty"
            description="Check your loyalty points, withdraw or convert them"
            startContent={<LoyaltyDocumentIcon className={iconClasses} />}
          >
            My Loyalty Points
          </ListboxItem>
          <ListboxItem
            onClick={() => router.push('/wallet')}
            key="wallet"
            description="Check your balance here"
            startContent={<WalletDocumentIcon className={iconClasses} />}
          >
            My Wallet
          </ListboxItem>
        </ListboxSection>
        <ListboxSection title="Danger zone">
          <ListboxItem
            onClick={() => {
              logout();
            }}
            key="logout"
            className="text-danger"
            color="danger"
            description="Logout of your account"
            startContent={<DeleteDocumentIcon className={cn(iconClasses, 'text-danger')} />}
          >
            Logout
          </ListboxItem>
        </ListboxSection>
      </Listbox>
    </ListboxWrapper>
  );
}
