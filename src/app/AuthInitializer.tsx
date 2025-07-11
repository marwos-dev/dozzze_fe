'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initAxiosAuthHeader } from '@/utils/axiosAuth';
import { getCustomerProfile } from '@/store/customerSlice';
import { AppDispatch } from '@/store';

export default function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    initAxiosAuthHeader(); // si hay cookie, pone el header
    dispatch(getCustomerProfile()); // pide perfil del backend
  }, [dispatch]);

  return null;
}
