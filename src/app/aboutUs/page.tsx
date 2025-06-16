'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MessageCircleMore,
  ShieldCheck,
  Info,
  Contact2,
} from 'lucide-react';

export default function AboutUsPage() {
  const [activeTab, setActiveTab] = useState<'info' | 'tpv' | 'contact'>(
    'info'
  );

  const textColor = 'text-[var(--foreground)]';

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="max-w-5xl mx-auto px-4 py-20 space-y-12">
        {/* TÍTULO */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-dozeblue">
          Sobre Nosotros
        </h1>
        {/* HEADER SUPERIOR CON LOGO + LEYENDA */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-dozebg1 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 shadow-md">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Logo Dozzze"
              width={120}
              height={40}
              className="object-contain"
            />
            <div className="hidden md:block h-10 w-px bg-gray-300 dark:bg-white/20" />
          </div>
          <div className="mt-3 md:mt-0 text-center md:text-left">
            <p className="text-lg font-semibold text-dozeblue">Dozzze</p>
            <p className="text-sm text-[var(--foreground)] leading-tight">
              Soluciones de alojamiento, reservas y gestión profesional
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex justify-center gap-4 border-b border-gray-200 dark:border-white/10 mb-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-2  font-medium border-b-2 transition ${
              activeTab === 'info'
                ? 'border-dozeblue text-dozeblue'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-dozeblue'
            }`}
          >
            <Info size={16} />
            Empresa
          </button>
          <button
            onClick={() => setActiveTab('tpv')}
            className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'tpv'
                ? 'border-dozeblue text-dozeblue'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-dozeblue'
            }`}
          >
            <ShieldCheck size={16} />
            TPV Virtual
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'contact'
                ? 'border-dozeblue text-dozeblue'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-dozeblue'
            }`}
          >
            <Contact2 size={16} />
            Contacto
          </button>
        </div>

        {/* CONTENIDO SEGÚN TAB */}
        {activeTab === 'info' && (
          <div
            className={`bg-white dark:bg-dozebg1 rounded-2xl p-6 md:p-10 shadow-lg space-y-6 text-sm md:text-base ${textColor}`}
          >
            <h2 className="text-xl font-semibold text-dozeblue">
              Explotaciones Hosteleras Infantas S.L
            </h2>
            <p>
              <strong>CIF:</strong> B88590989
              <br />
              <strong>Dirección:</strong> Calle las Palmas 44 1B, Móstoles,
              Madrid (CP 28938)
            </p>
          </div>
        )}

        {activeTab === 'tpv' && (
          <div
            className={`bg-white dark:bg-dozebg1 rounded-2xl p-6 md:p-10 shadow-lg border-l-4 border-dozeblue relative space-y-4 ${textColor}`}
          >
            <ShieldCheck
              className="absolute top-4 right-4 text-dozeblue"
              size={28}
            />
            <h3 className="text-xl font-semibold text-dozeblue">
              Requisitos Legales para el TPV Virtual
            </h3>
            <p>
              Le recordamos que para dar de alta de forma ágil el TPV virtual
              (pasarela de pagos segura), su web debe cumplir con los siguientes
              requisitos:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Ser accesible. Si la web está en construcción, le rogamos nos
                facilite acceso al entorno de pruebas.
              </li>
              <li>
                Cumplir con la legislación aplicable y normativa requerida por
                las Marcas de Tarjetas (VISA, MasterCard, etc.).
              </li>
              <li>
                <strong>Aviso Legal:</strong> debe contener nombre comercial,
                identificación (CIF), domicilio social y datos de contacto del
                comercio.
              </li>
              <li>
                <strong>Términos y Condiciones:</strong> incluir la política de
                compra y devoluciones de los pagos.
              </li>
              <li>
                El domicilio y país del establecimiento deben aparecer en la
                pantalla donde se muestra el importe final de la transacción o
                durante el proceso de pago.
              </li>
              <li>
                Si utiliza servicios de un Proveedor de Servicios de Pago, este
                deberá estar autorizado por Banco Sabadell.
              </li>
              <li>
                Según la directiva <strong>PSD2 de la Unión Europea</strong>,
                los cobros con tarjetas europeas solo se podrán realizar a
                través de terminales CES. Si desea acogerse a alguna excepción,
                infórmenos para su valoración.
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-dozeblue text-center">
              Contacto
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-white dark:bg-dozebg1 shadow-md border border-gray-200 dark:border-white/10">
                <Mail className="text-dozeblue mb-2" size={28} />
                <p className="text-sm text-center font-medium break-all text-[var(--foreground)]">
                  reservas@empresa.com
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-white dark:bg-dozebg1 shadow-md border border-gray-200 dark:border-white/10">
                <Phone className="text-dozeblue mb-2" size={28} />
                <p className="text-sm text-center font-medium text-[var(--foreground)]">
                  +34 919 540 882
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-white dark:bg-dozebg1 shadow-md border border-gray-200 dark:border-white/10">
                <MessageCircleMore className="text-dozeblue mb-2" size={28} />
                <p className="text-sm text-center font-medium text-[var(--foreground)]">
                  +34 613 415 444
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
      <footer className="bg-white dark:bg-dozebg1 border-t border-gray-200 dark:border-white/10 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
          {/* Columna izquierda */}
          <div className="text-center text-dozeblue md:text-left">
            <p>
              © {new Date().getFullYear()} Dozzze. Todos los derechos
              reservados.
            </p>
            <p className="text-xs text-[var(--foreground)]">
              Soluciones de alojamiento, reservas y gestión profesional
            </p>
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center text-[var(--foreground)] md:text-right">
            <p className="text-sm">
              <strong>Email:</strong>{' '}
              <a
                href="mailto:reservas@empresa.com"
                className="text-dozeblue hover:underline"
              >
                reservas@empresa.com
              </a>
            </p>
            <p className="text-sm">
              <strong>Tel:</strong>{' '}
              <a
                href="tel:+34919540882"
                className="text-dozeblue hover:underline"
              >
                +34 919 540 882
              </a>
            </p>
            <p className="text-sm">
              <strong>WhatsApp:</strong>{' '}
              <a
                href="https://wa.me/34613415444"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dozeblue hover:underline"
              >
                +34 613 415 444
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
