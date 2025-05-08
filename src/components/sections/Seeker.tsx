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
import { map } from 'framer-motion/client'

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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end"
            >
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                    <TextInput
                        label="Destino"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Ingrese su destino" Icon={MapPin}
                    />
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                    <DateInput
                        dateRange={dateRange}
                        onDateChange={handleDateChange}
                        isPopoverOpen={isDatePopoverOpen}
                        setIsPopoverOpen={setIsDatePopoverOpen}
                        calendarRef={calendarRef}
                    />
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                    <SelectInput
                        label="Habitaciones"
                        value={rooms}
                        setValue={setRooms}
                        min={1}
                        max={10}
                    />
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                    <SelectInput
                        label="Huéspedes"
                        value={guests}
                        setValue={setGuests}
                        min={1}
                        max={10}
                    />
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                    <TextInput
                        label="Código promocional"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Ingrese su código promocional" Icon={Percent} />
                </div>
                <button
                    type="submit"
                    className="bg-dozeblue text-white py-2 px-4 rounded-full hover:bg-dozeblue-dark"
                >
                    Buscar
                </button>
            </form>
        </motion.section>
    )
}
