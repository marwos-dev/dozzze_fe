import Cookies from 'js-cookie';
import type { Customer } from '@/types/costumers';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const CUSTOMER_PROFILE_COOKIE = 'customerProfile';
const COOKIE_OPTIONS = {
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  expires: 30,
  path: '/',
};

const COOKIE_REMOVAL_OPTIONS = { path: '/' } as const;

export const getAccessToken = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get(ACCESS_TOKEN_COOKIE);
};

export const persistAccessToken = (token: string) => {
  Cookies.set(ACCESS_TOKEN_COOKIE, token, COOKIE_OPTIONS);
};

export const clearAccessToken = () => {
  Cookies.remove(ACCESS_TOKEN_COOKIE, COOKIE_REMOVAL_OPTIONS);
};

export const persistCustomerProfile = (profile: Customer) => {
  Cookies.set(CUSTOMER_PROFILE_COOKIE, JSON.stringify(profile), COOKIE_OPTIONS);
};

export const getStoredCustomerProfile = (): Customer | undefined => {
  if (typeof window === 'undefined') return undefined;

  const serializedProfile = Cookies.get(CUSTOMER_PROFILE_COOKIE);
  if (!serializedProfile) {
    return undefined;
  }

  try {
    return JSON.parse(serializedProfile) as Customer;
  } catch {
    return undefined;
  }
};

export const clearCustomerProfile = () => {
  Cookies.remove(CUSTOMER_PROFILE_COOKIE, COOKIE_REMOVAL_OPTIONS);
};

export const clearPersistedSession = () => {
  clearAccessToken();
  clearCustomerProfile();
};
