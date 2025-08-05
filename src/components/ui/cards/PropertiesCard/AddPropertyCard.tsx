'use client';

import { Plus } from 'lucide-react';

interface Props {
  onAdd: () => void;
}

export default function AddPropertyCard({ onAdd }: Props) {
  return (
    <div
      onClick={onAdd}
      className="group relative rounded-xl border border-dashed border-dozeblue flex flex-col items-center justify-center p-6 cursor-pointer min-h-[180px] hover:bg-dozeblue/10 transition"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dozeblue/20 group-hover:bg-dozeblue/30 transition">
        <Plus className="text-dozeblue" size={28} />
      </div>
      <p className="mt-2 text-dozeblue font-medium text-sm text-center">
        Añadir propiedad
      </p>
    </div>
  );
}
