'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, LogIn, ShoppingCart, Sun, Moon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  selectCustomerProfile,
  selectIsCustomerLoggedIn,
} from '@/store/selectors/customerSelectors';
import Seeker from '@/components/sections/Seeker';
import FilterModal from '@/components/ui/modals/FilterModal';
import UserMenu from '@/components/ui/menus/UserMenu';

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/aboutUs' },
  { label: 'Reservas', href: '/reserve', icon: ShoppingCart },
];

export default function Navbar() {
  const profile = useSelector((state: RootState) =>
    selectCustomerProfile(state)
  );
  const isLoggedIn = useSelector((state: RootState) =>
    selectIsCustomerLoggedIn(state)
  );

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const initialDark = storedTheme ? storedTheme === 'dark' : prefersDark;

    setIsDarkMode(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY <= 0);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  return (
    <nav className="bg-greenlight/80 dark:bg-dozeblue/60 backdrop-blur-md shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo de Dozzze"
              width={120}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map(({ label, href, icon: Icon }) =>
              href.startsWith('/') ? (
                <Link
                  key={href}
                  href={href}
                  className={`${isTop ? 'text-dozeblue' : 'text-dozegray'} font-semibold hover:text-dozeblue transition flex items-center`}
                >
                  {Icon ? (
                    <>
                      <Icon size={18} />
                      <span className="sr-only">{label}</span>
                    </>
                  ) : (
                    label
                  )}
                </Link>
              ) : (
                <a
                  key={href}
                  href={href}
                  className={`${isTop ? 'text-dozeblue' : 'text-dozegray'} font-semibold hover:text-dozeblue transition flex items-center`}
                >
                  {Icon ? (
                    <>
                      <Icon size={18} />
                      <span className="sr-only">{label}</span>
                    </>
                  ) : (
                    label
                  )}
                </a>
              )
            )}

            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center space-x-1 hover:text-dozeblue transition"
            >
              <Search
                className={`${isTop ? 'text-dozeblue' : 'text-dozegray'} hover:text-dozeblue`}
                size={18}
              />
              <span
                className={`${isTop ? 'text-dozeblue' : 'text-dozegray'} font-semibold hover:text-dozeblue transition`}
              >
                Buscar
              </span>
            </button>

            {isLoggedIn && profile ? (
              <UserMenu email={profile.email} variant="desktop" />
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-dozeblue hover:bg-dozeblue/90 text-white font-semibold px-4 py-1.5 rounded-full transition"
              >
                <LogIn size={18} />
                Iniciar sesión
              </Link>
            )}

            <div
              onClick={toggleDarkMode}
              className="cursor-pointer text-xl"
              title="Cambiar modo"
            >
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <div
              onClick={toggleDarkMode}
              className="cursor-pointer text-xl"
              title="Cambiar modo"
            >
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="text-gray-600 hover:text-dozeblue"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[var(--background)] text-[var(--foreground)] shadow-lg z-40 transform transition-transform duration-300 md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-20">
          {navLinks.map(({ label, href, icon: Icon }) =>
            href.startsWith('/') ? (
              <Link
                key={href}
                href={href}
                className="block px-6 py-4 text-lg font-semibold hover:text-dozeblue transition border-b border-dozegray/30 flex items-center"
                onClick={() => setOpen(false)}
              >
                {Icon ? (
                  <>
                    <Icon size={18} />
                    <span className="sr-only">{label}</span>
                  </>
                ) : (
                  label
                )}
              </Link>
            ) : (
              <a
                key={href}
                href={href}
                className="block px-6 py-4 text-lg font-semibold hover:text-dozeblue transition border-b border-dozegray/30 flex items-center"
                onClick={() => setOpen(false)}
              >
                {Icon ? (
                  <>
                    <Icon size={18} />
                    <span className="sr-only">{label}</span>
                  </>
                ) : (
                  label
                )}
              </a>
            )
          )}

          <button
            onClick={() => {
              setSearchOpen(true);
              setOpen(false);
            }}
            className="block w-full text-left px-6 py-4 text-lg font-semibold hover:text-dozeblue border-t border-dozegray/30"
          >
            Buscar
          </button>

          {isLoggedIn && profile ? (
            <UserMenu email={profile.email} variant="mobile" />
          ) : (
            <Link
              href="/login"
              className="block mx-6 mt-4 mb-6 text-center bg-dozeblue text-white font-semibold px-4 py-2 rounded-full hover:bg-dozeblue/90 transition"
              onClick={() => setOpen(false)}
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/80 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Search modal */}
      <FilterModal isOpen={searchOpen} onClose={() => setSearchOpen(false)}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-dozeblue">
              Buscar alojamiento
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <Seeker />
          </div>
        </div>
      </FilterModal>
    </nav>
  );
}
