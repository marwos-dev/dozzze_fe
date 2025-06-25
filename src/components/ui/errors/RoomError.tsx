'use client';

import { AlertTriangle } from 'lucide-react';

export default function RoomError({ message }: { message: string }) {
  return (
    <div className="border border-gray-300 dark:border-white/10 rounded-2xl bg-[var(--background)] shadow-sm overflow-hidden transition-colors">
      <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr]">
        <div className="p-6 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dozegray/10 flex items-center justify-center">
          <div className="flex items-center gap-2 text-dozeblue">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Sin disponibilidad</h3>
          </div>
        </div>
        <div className="p-6 flex items-center justify-center">
          <p className="text-sm text-[var(--foreground)] text-center">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
