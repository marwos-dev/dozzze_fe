'use client';
import HomeSlider from '@/components/sliders/HomeSlider';
import AnimatedButton from '../ui/buttons/AnimatedButton';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="relative max-w-6xl mt-10 bg-dozebg1/90 backdrop-blur-lg mx-auto py-14 px-6 mb-10 lg:px-16 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 rounded-2xl shadow-2xl overflow-hidden">
      <span className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-dozeblue/40 via-greenlight/40 to-transparent rounded-full blur-3xl" />
      <span className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tr from-greenlight/30 via-dozeblue/30 to-transparent rounded-full blur-2xl" />
      {/* Texto a la izquierda en pantallas grandes */}
      <div className="max-w-xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-6 text-dozeblue"
        >
          {t('home.discoverStay')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-[var(--foreground)] mb-12"
        >
          {t('home.description')}
        </motion.p>
        <AnimatedButton text={t('home.searchPlace')} sectionId="#seeker" />
      </div>

      {/* Slider a la derecha */}
      <div className="w-full lg:w-[600px]">
        <HomeSlider />
      </div>
    </div>
  );
}
