'use client';

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getCustomerProfile, setCustomer } from '@/store/customerSlice';
import { AppDispatch } from '@/store';
import { clearReserveStorage } from '@/utils/storage';
import {
  getAccessToken,
  getStoredCustomerProfile,
} from '@/utils/authSession';

export default function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!getAccessToken()) {
      clearReserveStorage(dispatch);
    }

    const profile = getStoredCustomerProfile();
    if (profile) {
      dispatch(setCustomer(profile));
      return;
    }
    dispatch(getCustomerProfile()); // pide perfil del backend si no hay cookie
  }, [dispatch]);

  const lastToken = useRef<string | undefined>(getAccessToken());

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = getAccessToken();
      if (lastToken.current && !currentToken) {
        clearReserveStorage(dispatch);
      }
      lastToken.current = currentToken;
    }, 60_000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
}
