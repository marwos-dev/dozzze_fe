'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MessageCircleMore,
  Info,
  Contact2,
  FileText,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export default function AboutUsPage() {
  const [activeTab, setActiveTab] = useState<'info' | 'billing' | 'contact'>(
    'info'
  );
  const textColor = 'text-[var(--foreground)]';
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="max-w-5xl mx-auto px-4 py-20 space-y-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-dozeblue">
          {t('about.title')}
        </h1>

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
              {t('about.slogan')}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 border-b border-gray-200 dark:border-white/10 mb-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'info'
                ? 'border-dozeblue text-dozeblue'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-dozeblue'
            }`}
          >
            <Info size={16} />
            {t('about.company')}
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'billing'
                ? 'border-dozeblue text-dozeblue'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-dozeblue'
            }`}
          >
            <FileText size={16} />
            {t('about.billing')}
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
            {t('about.contact')}
          </button>
        </div>

        {/* Info */}
        {activeTab === 'info' && (
          <div
            className={`bg-white dark:bg-dozebg1 rounded-2xl p-6 md:p-10 shadow-lg space-y-6 text-sm md:text-base ${textColor}`}
          >
            <h2 className="text-xl font-semibold text-dozeblue">
              {t('about.companyName')}
            </h2>
            <p>
              <strong>CIF:</strong> B88590989
              <br />
              <strong>Dirección:</strong> Calle las Palmas 44 1B, Móstoles,
              Madrid (CP 28938)
            </p>
          </div>
        )}

        {/* Facturación */}
        {activeTab === 'billing' && (
          <div
            className={`bg-white dark:bg-dozebg1 rounded-2xl p-6 md:p-10 shadow-lg border-l-4 border-dozeblue relative space-y-4 ${textColor}`}
          >
            <FileText
              className="absolute top-4 right-4 text-dozeblue"
              size={28}
            />
            <h3 className="text-xl font-semibold text-dozeblue">
              {t('about.billingData')}
            </h3>
            <p>
              <strong>Explotaciones Hosteleras Infantas S.L</strong>
              <br />
              <strong>CIF:</strong> B88590989
              <br />
              <strong>Dirección:</strong> Calle las Palmas 44 1B, Móstoles,
              Madrid (CP 28938)
            </p>

            <h4 className="text-lg font-semibold mt-4">
              Condiciones de Facturación
            </h4>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Las facturas se emitirán únicamente a nombre de Explotaciones
                Hosteleras Infantas S.L, con CIF B88590989.
              </li>
              <li>
                Por favor, asegúrate de proporcionar todos los datos necesarios
                para la correcta emisión de tu factura durante el proceso de
                compra o contratación de servicios.
              </li>
              <li>
                Si detectas algún error en los datos de la factura, tienes un
                plazo de 7 días hábiles desde la recepción de la misma para
                solicitar su rectificación.
              </li>
              <li>
                En caso de devoluciones o cancelaciones, los reembolsos se
                realizarán utilizando el mismo método de pago original dentro de
                un plazo de 14 días hábiles.
              </li>
            </ul>

            <h4 className="text-lg font-semibold mt-4">Envío de Facturas</h4>
            <p>{t('about.billingInfo')}</p>
            <p>
              Si necesitas recibir una factura en formato físico, puedes
              solicitarlo{' '}
              <button
                onClick={() => setActiveTab('contact')}
                className="text-dozeblue underline hover:text-dozeblue/80 transition font-medium"
              >
                {t('about.consultContact')}
              </button>
              .
            </p>

            <h4 className="text-lg font-semibold mt-4">Requisitos Legales</h4>
            <p>
              Todas nuestras facturas cumplen con la normativa fiscal vigente en
              España, según los estándares establecidos por la Agencia
              Tributaria.
            </p>
          </div>
        )}

        {/* Contacto */}
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
          <div className="text-center text-dozeblue md:text-left">
            <p>
              © {new Date().getFullYear()} Dozzze. Todos los derechos
              reservados.
            </p>
            <p className="text-xs text-[var(--foreground)]">
              Soluciones de alojamiento, reservas y gestión profesional
            </p>
          </div>

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
