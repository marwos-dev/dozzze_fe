'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { logoutCustomer } from '@/utils/axiosAuth';

interface Props {
  email: string;
  variant?: 'desktop' | 'mobile';
}

export default function UserMenu({ email, variant = 'desktop' }: Props) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logoutCustomer(dispatch);
    setOpen(false);
  };

  useEffect(() => {
    if (variant === 'desktop') {
      const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [variant]);

  if (variant === 'mobile') {
    return (
      <div className="px-6 py-4 text-lg font-semibold text-dozegray">
        {email}
        <Link
          href="/profile"
          className="block px-0 py-4 text-lg font-semibold hover:text-dozeblue border-t border-dozegray/30"
        >
          Perfil
        </Link>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-0 py-4 text-lg font-semibold hover:text-dozeblue border-t border-dozegray/30"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  // Desktop (dropdown)
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-dozeblue hover:bg-dozeblue/90 text-white font-semibold px-4 py-1.5 rounded-full transition"
      >
        {email}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <Link
            href="/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
