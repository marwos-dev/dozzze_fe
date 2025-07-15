'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initAxiosAuthHeader } from '@/utils/axiosAuth';
import { getCustomerProfile, setCustomer } from '@/store/customerSlice';
import { AppDispatch } from '@/store';
import Cookies from 'js-cookie';

export default function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    initAxiosAuthHeader(); // si hay cookie, pone el header
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

  return null;
}
