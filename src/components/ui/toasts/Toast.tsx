'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  color: 'red' | 'green' | 'blue' | 'yellow';
  duration?: number; // ms
}

export default function Toast({ message, color, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const colorMap = {
    red: 'bg-red-600 text-white',
    green: 'bg-green-600 text-white',
    blue: 'bg-blue-600 text-white',
    yellow: 'bg-yellow-500 text-black',
  };

  const iconMap = {
    red: <AlertTriangle className="w-4 h-4" />,
    green: <CheckCircle className="w-4 h-4" />,
    blue: <Info className="w-4 h-4" />,
    yellow: <AlertTriangle className="w-4 h-4" />,
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 rounded-lg px-4 py-2 shadow-lg flex items-center gap-2 ${colorMap[color]}`}
    >
      {iconMap[color]}
      <span className="text-sm">{message}</span>
    </div>
  );
}
