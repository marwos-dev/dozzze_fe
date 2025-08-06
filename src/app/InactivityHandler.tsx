'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearReserveStorage } from '@/utils/storage';
import { AppDispatch } from '@/store';

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

export default function InactivityHandler() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        clearReserveStorage(dispatch);
      }, INACTIVITY_LIMIT);
    };

    resetTimer();

    const events: Array<keyof WindowEventMap> = [
      'mousemove',
      'keydown',
      'scroll',
      'click',
    ];

    events.forEach((e) => window.addEventListener(e, resetTimer));

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearTimeout(timeout);
    };
  }, [dispatch]);

  return null;
}

