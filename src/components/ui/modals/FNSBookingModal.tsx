'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import FNSBooking from '@/components/FNSBooking'

interface ModalBookingProps {
  isOpen: boolean
  onClose: () => void
}

export default function ModalBooking({ isOpen, onClose }: ModalBookingProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center bg-black/40 backdrop-blur-sm overflow-visible"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ alignItems: 'flex-start', paddingTop: '5vh' }}
        >
          <motion.div
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 overflow-visible"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>

            <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
              Encontrá lo que buscas con FSNBooking
            </h2>
            <FNSBooking containerId="#fns_booking_modal" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
