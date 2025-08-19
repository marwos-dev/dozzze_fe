'use client';
import { useState } from 'react';
import { useLanguage, Lang } from '@/i18n/LanguageContext';
import { ChevronDown } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((o) => !o);
  const selectLang = (l: Lang) => {
    setLang(l);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
      type="button"
        onClick={toggle}
        className="uppercase text-sm flex items-center gap-1 focus:outline-none"
      >
        {lang}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 bg-white dark:bg-dozebg1 rounded-md shadow-md">
          <button
            type="button"
            onClick={() => selectLang('es')}
            className="block px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-dozebg2 w-full text-left uppercase"
          >
            ES
          </button>
          <button
            type="button"
            onClick={() => selectLang('en')}
            className="block px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-dozebg2 w-full text-left uppercase"
          >
            EN
          </button>
        </div>
      )}
    </div>
  );
}
