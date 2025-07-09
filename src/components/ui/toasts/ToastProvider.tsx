'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '@/store';
import { clearToast } from '@/store/toastSlice';
import Toast from './Toast';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useSelector((state: RootState) => state.toast.toast);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  return (
    <>
      {children}
      {toast && <Toast message={toast.message} color={toast.color} />}
    </>
  );
}
