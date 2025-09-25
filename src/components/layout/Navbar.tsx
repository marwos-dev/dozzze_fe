'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, LogIn, Sun, Moon, ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  selectCustomerProfile,
  selectIsCustomerLoggedIn,
} from '@/store/selectors/customerSelectors';
import UserMenu from '@/components/ui/menus/UserMenu';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/i18n/LanguageContext';
import { usePathname } from 'next/navigation';

// Solo el formulario
import SeekerForm from '@/components/ui/seeker/SeekerForm';

const navLinks = [
  { labelKey: 'nav.home', href: '/' },
  { labelKey: 'nav.about', href: '/aboutUs' },
  { labelKey: 'nav.reservations', href: '/reserve', icon: ShoppingCart },
];

export default function Navbar() {
  const profile = useSelector((s: RootState) => selectCustomerProfile(s));
  const isLoggedIn = useSelector((s: RootState) => selectIsCustomerLoggedIn(s));

  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t } = useLanguage();
  const pathname = usePathname();
  const isHome = pathname === '/'; // <- solo mostramos el seeker en "/"

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const initialDark = storedTheme ? storedTheme === 'dark' : prefersDark;
    setIsDarkMode(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  const toggleDarkMode = () => {
    const v = !isDarkMode;
    setIsDarkMode(v);
    document.documentElement.classList.toggle('dark', v);
    localStorage.setItem('theme', v ? 'dark' : 'light');
  };

  // Colores estilo Booking
  const blue = 'bg-[#003580]';
  const blue2 = 'bg-[#0a5bd3]';

  return (
    <header className="sticky top-0 z-50">
      {/* TOP BAR */}
      <nav
        className={`${blue} text-white/90 backdrop-blur relative z-[60] overflow-visible`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 md:h-14 lg:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Dozzze"
                width={120}
                height={40}
                className="object-contain"
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-5">
              {navLinks.map(({ labelKey, href, icon: Icon }) =>
                href.startsWith('/') ? (
                  <Link
                    key={href}
                    href={href}
                    className="font-semibold hover:text-white"
                  >
                    <span className="inline-flex items-center gap-2">
                      {Icon ? <Icon size={18} /> : null}
                      {t(labelKey)}
                    </span>
                  </Link>
                ) : (
                  <a
                    key={href}
                    href={href}
                    className="font-semibold hover:text-white"
                  >
                    <span className="inline-flex items-center gap-2">
                      {Icon ? <Icon size={18} /> : null}
                      {t(labelKey)}
                    </span>
                  </a>
                )
              )}

              {isLoggedIn && profile ? (
                <UserMenu customer={profile} variant="desktop" />
              ) : (
                <Link
                  href="/login"
                  className={`${blue2} hover:brightness-110 text-white font-semibold px-4 py-1 rounded-full transition`}
                >
                  <span className="inline-flex items-center gap-2">
                    <LogIn size={18} />
                    {t('nav.login')}
                  </span>
                </Link>
              )}

              <button
                onClick={toggleDarkMode}
                title={t('nav.changeMode') as string}
              >
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <LanguageSwitcher />
            </div>

            {/* Mobile toggles */}
            <div className="md:hidden flex items-center gap-3">
              <button onClick={toggleDarkMode} aria-label="Toggle theme">
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <LanguageSwitcher />
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`md:hidden fixed top-12 md:top-14 lg:top-16 right-0 w-72 h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)] ${blue} text-white/90 shadow-xl transform transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 space-y-2">
            {navLinks.map(({ labelKey, href, icon: Icon }) =>
              href.startsWith('/') ? (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 rounded hover:bg-white/10"
                >
                  <span className="inline-flex items-center gap-2">
                    {Icon ? <Icon size={18} /> : null}
                    {t(labelKey)}
                  </span>
                </Link>
              ) : (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 rounded hover:bg-white/10"
                >
                  <span className="inline-flex items-center gap-2">
                    {Icon ? <Icon size={18} /> : null}
                    {t(labelKey)}
                  </span>
                </a>
              )
            )}

            {isLoggedIn && profile ? (
              <UserMenu customer={profile} variant="mobile" />
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-2 block text-center px-4 py-2 rounded-full bg-white text-[#003580] font-semibold"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* HERO AZUL CON BUSCADOR FLOTANTE: solo en home */}
      {isHome && (
        <>
          <div className={`${blue} text-white relative z-[40]`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4 md:pb-14">
              {/* En mobile no flotamos */}
              <div className="mt-2 md:hidden">
                <SeekerForm dense tight showActions />
              </div>
            </div>

            {/* Flotante en desktop/tablet */}
            <div className="hidden md:block pointer-events-none absolute inset-x-0 bottom-0 z-40">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="translate-y-1/2 pointer-events-auto">
                  <SeekerForm dense tight showActions />
                </div>
              </div>
            </div>
          </div>

          {/* Spacer para que el contenido no quede tapado por el pill flotante */}
          <div className="hidden md:block h-6 md:h-8 lg:h-10" />
        </>
      )}
    </header>
  );
}
