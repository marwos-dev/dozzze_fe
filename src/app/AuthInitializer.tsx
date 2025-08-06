'use client';

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { initAxiosAuthHeader } from '@/utils/axiosAuth';
import { getCustomerProfile, setCustomer } from '@/store/customerSlice';
import { AppDispatch } from '@/store';
import Cookies from 'js-cookie';
import { clearReserveStorage } from '@/utils/storage';

export default function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    initAxiosAuthHeader(); // si hay cookie, pone el header

    if (!Cookies.get('accessToken')) {
      clearReserveStorage(dispatch);
    }

    const profileCookie = Cookies.get('customerProfile');
    if (profileCookie) {
      try {
        const profile = JSON.parse(profileCookie);
        dispatch(setCustomer(profile));
        return;
      } catch {
        // fallthrough to backend fetch if parsing fails
      }
    }
    dispatch(getCustomerProfile()); // pide perfil del backend si no hay cookie
  }, [dispatch]);

  const lastToken = useRef<string | undefined>(Cookies.get('accessToken'));

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = Cookies.get('accessToken');
      if (lastToken.current && !currentToken) {
        clearReserveStorage(dispatch);
      }
      lastToken.current = currentToken;
    }, 60_000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
}
