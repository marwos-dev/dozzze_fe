'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Percent } from 'lucide-react'
import { Range } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import TextInput from '../ui/inputs/TextInput'
import DateInput from '../ui/inputs/DateInput'
import SelectInput from '../ui/inputs/SelectInput'

export default function Seeker() {
    const [destination, setDestination] = useState('')
    const [dateRange, setDateRange] = useState<Range[]>([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ])
    const [rooms, setRooms] = useState(1)
    const [guests, setGuests] = useState(2)
    const [promoCode, setPromoCode] = useState('')
    const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false)

    const calendarRef = useRef<HTMLDivElement>(null)

    const handleDateChange = (item: any) => {
        setDateRange([item.selection])
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isDatePopoverOpen && calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsDatePopoverOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isDatePopoverOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const requestData = { destination, dateRange, rooms, guests, promoCode }
        console.log('Datos a enviar:', requestData)
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto w-full max-w-5xl rounded-2xl bg-dozebg1 shadow-xl px-4 py-6 sm:px-6 lg:px-10 mt-10"
        >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dozeblue mb-6 text-center">
                Encontrá tu alojamiento ideal
            </h2>
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_2fr_1fr_1fr_2fr_auto] gap-4 items-end"
            >
                <TextInput
                    label="Destino"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Ciudad, País"
                    Icon={MapPin}
                />
                <DateInput
                    dateRange={dateRange}
                    onDateChange={handleDateChange}
                    isPopoverOpen={isDatePopoverOpen}
                    setIsPopoverOpen={setIsDatePopoverOpen}
                    calendarRef={calendarRef}
                />
                <SelectInput label="Habitaciones" value={rooms} setValue={setRooms} />
                <SelectInput label="Personas" value={guests} setValue={setGuests} />
                <TextInput
                    label="Código promocional"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Introduce tu código"
                    Icon={Percent}
                />
                <button
                    type="submit"
                    className="bg-dozeblue text-white rounded-xl py-3 px-4 font-semibold text-sm sm:text-base hover:bg-dozeblue/90 transition-all w-full"
                >
                    Buscar
                </button>
            </form>
        </motion.section>
    )
}
