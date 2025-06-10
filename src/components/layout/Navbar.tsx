'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import Seeker from '@/components/sections/Seeker';
import FilterModal from '@/components/ui/modals/FilterModal';
import Image from 'next/image';

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  return (
    <nav className="bg-greenlight shadow-md sticky top-0 z-50 transition-colors">
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

          {/* Desktop */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-dozegray font-semibold hover:text-dozeblue transition"
              >
                {label}
              </a>
            ))}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center space-x-1 hover:text-dozeblue transition"
            >
              <Search
                className="text-dozegray hover:text-dozeblue "
                size={18}
              />
              <span className="text-dozegray font-semibold hover:text-dozeblue transition">
                Buscar
              </span>
            </button>

            {/* Toggle dark mode with icons */}
            <div
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <span className="text-sm">🌞</span>
              <div
                className={`w-10 h-5 flex items-center rounded-full p-1 transition ${
                  isDarkMode
                    ? 'bg-dozeblue justify-end'
                    : 'bg-dozegray/30 justify-start'
                }`}
              >
                <div className="w-3.5 h-3.5 bg-white rounded-full shadow-md transition" />
              </div>
              <span className="text-sm">🌙</span>
            </div>
          </div>

          {/* Mobile: dark mode + menu */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Dark mode toggle with icons */}
            <div
              onClick={toggleDarkMode}
              className="flex items-center space-x-1 cursor-pointer"
            >
              <span className="text-xs">🌞</span>
              <div
                className={`w-8 h-4 flex items-center rounded-full p-0.5 transition ${
                  isDarkMode
                    ? 'bg-dozeblue justify-end'
                    : 'bg-dozegray/30 justify-start'
                }`}
              >
                <div className="w-3 h-3 bg-white rounded-full shadow-md transition" />
              </div>
              <span className="text-xs">🌙</span>
            </div>

            {/* Menu icon */}
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
          {navLinks.map(({ label, href }, index) => (
            <a
              key={href}
              href={href}
              className={`block px-6 py-4 text-lg font-semibold hover:text-dozeblue transition ${
                index !== navLinks.length - 1
                  ? 'border-b border-dozegray/30'
                  : ''
              }`}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <button
            onClick={() => {
              setSearchOpen(true);
              setOpen(false);
            }}
            className="block w-full text-left px-6 py-4 text-lg font-semibold hover:text-dozeblue border-t border-dozegray/30"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Overlay oscuro del menú móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Modal de búsqueda */}
      <FilterModal isOpen={searchOpen} onClose={() => setSearchOpen(false)}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-dozeblue">
              Buscar alojamiento
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <Seeker loading={false} />
          </div>
        </div>
      </FilterModal>
    </nav>
  );
}
