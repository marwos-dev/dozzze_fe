'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import FilterModal from '@/components/ui/modals/FilterModal';

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="bg-greenlight shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-dozeblue">
            DOZZZE
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
              className="flex items-center space-x-1 text-dozegray hover:text-dozeblue transition"
            >
              <Search size={18} />
              <span className="font-semibold">Buscar</span>
            </button>
          </div>

          {/* Mobile toggle button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-600 hover:text-dozeblue"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-greenlight shadow-lg z-40 transform transition-transform duration-300 md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-20">
          {navLinks.map(({ label, href }, index) => (
            <a
              key={href}
              href={href}
              className={`block px-6 py-4 text-lg font-semibold text-dozegray hover:text-dozeblue transition ${
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
            className="block w-full text-left px-6 py-4 text-lg font-semibold text-dozegray hover:text-dozeblue border-t border-dozegray/30"
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
      <FilterModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}
