'use client';
import { useLanguage, Lang } from '@/i18n/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as Lang)}
      className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white dark:bg-dozebg1"
    >
      <option value="es">ES</option>
      <option value="en">EN</option>
    </select>
  );
}
