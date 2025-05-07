'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
    const [open, setOpen] = useState(false)

    return (
        <nav className="bg-primarydozze  shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold text-blue-600">
                        DOZZZE
                    </Link>

                    {/* Desktop menu */}
                    <div className="hidden md:flex space-x-6">
                        <Link href="/" className="hover:text-blue-600 transition">
                            Inicio
                        </Link>
                        <Link href="/about" className="hover:text-blue-600 transition">
                            Nosotros
                        </Link>
                        <Link href="/contact" className="hover:text-blue-600 transition">
                            Contacto
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden text-gray-600 hover:text-blue-600"
                    >
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden px-4 pb-4 space-y-2">
                    <Link href="/" className="block hover:text-blue-600">
                        Inicio
                    </Link>
                    <Link href="/about" className="block hover:text-blue-600">
                        Nosotros
                    </Link>
                    <Link href="/contact" className="block hover:text-blue-600">
                        Contacto
                    </Link>
                </div>
            )}
        </nav>
    )
}
