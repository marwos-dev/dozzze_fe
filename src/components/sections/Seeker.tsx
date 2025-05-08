'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, MapPin, Users, Percent, Minus, Plus, X } from 'lucide-react'
import { DateRange, Range } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { format } from 'date-fns'

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
    const [isRoomsPopoverOpen, setIsRoomsPopoverOpen] = useState(false)

    const calendarRef = useRef<HTMLDivElement>(null)
    const roomsRef = useRef<HTMLDivElement>(null)

    const handleDateChange = (item: any) => {
        setDateRange([item.selection])
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isDatePopoverOpen &&
                calendarRef.current &&
                !calendarRef.current.contains(event.target as Node)
            ) {
                setIsDatePopoverOpen(false)
            }
            if (
                isRoomsPopoverOpen &&
                roomsRef.current &&
                !roomsRef.current.contains(event.target as Node)
            ) {
                setIsRoomsPopoverOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isDatePopoverOpen, isRoomsPopoverOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const requestData = {
            destination,
            dateRange,
            rooms,
            guests,
            promoCode,
        }
        try {
            console.log(requestData)
        } catch (error) {
            console.error('Error al enviar los datos:', error)
        }
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
            >
                {/* Destino */}
                <div className="col-span-full sm:col-span-2 flex flex-col gap-2">
                    <label className="text-dozeblue font-medium">Destino</label>
                    <div className="flex items-center gap-2 border border-dozegray/30 bg-white rounded-xl px-4 py-2 shadow-sm">
                        <MapPin className="text-dozeblue w-5 h-5" />
                        <input
                            type="text"
                            value={destination}
                            onChange={e => setDestination(e.target.value)}
                            placeholder="Ciudad, alojamiento..."
                            className="flex-1 outline-none text-dozeblue placeholder-dozegray text-sm bg-transparent"
                        />
                    </div>
                </div>

                {/* Fechas */}
                <div className="relative col-span-full sm:col-span-2">
                    <label className="text-dozeblue font-medium block mb-1">Fechas</label>
                    <button
                        type="button"
                        className="w-full flex items-center gap-2 border border-dozegray/30 bg-white rounded-xl px-4 py-2 shadow-sm"
                        onClick={() => setIsDatePopoverOpen(prev => !prev)}
                    >
                        <CalendarDays className="text-dozeblue w-5 h-5" />
                        <span className="text-sm text-dozeblue">
                            {`${format(dateRange[0].startDate!, 'dd/MM/yyyy')} - ${format(dateRange[0].endDate!, 'dd/MM/yyyy')}`}
                        </span>
                    </button>
                    {isDatePopoverOpen && (
                        <motion.div
                            ref={calendarRef}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-50 mt-2 bg-white p-2 sm:p-4 rounded-xl shadow-lg w-[90vw] max-w-md max-h-[70vh] overflow-y-auto"
                            style={{
                                top: 'auto',
                                bottom: '100%',
                            }}
                        >
                            <div className="flex justify-end mb-2">
                                <button
                                    type="button"
                                    onClick={() => setIsDatePopoverOpen(false)}
                                    className="text-dozeblue hover:text-red-500 transition-colors"
                                    aria-label="Cerrar calendario"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <DateRange
                                editableDateInputs={true}
                                onChange={handleDateChange}
                                moveRangeOnFirstSelection={false}
                                ranges={dateRange}
                                minDate={new Date()}
                            />
                        </motion.div>
                    )}
                </div>

                {/* Habitaciones y Personas */}
                <div className="relative col-span-full sm:col-span-2 lg:col-span-1">
                    <label className="text-dozeblue font-medium block mb-1">Habitaciones</label>
                    <button
                        type="button"
                        className="w-full flex items-center gap-2 border border-dozegray/30 bg-white rounded-xl px-4 py-2 shadow-sm"
                        onClick={() => setIsRoomsPopoverOpen(prev => !prev)}
                    >
                        <Users className="text-dozeblue w-5 h-5" />
                        <span className="text-sm text-dozeblue">{`${rooms} hab, ${guests} pers`}</span>
                    </button>
                    {isRoomsPopoverOpen && (
                        <div
                            ref={roomsRef}
                            className="absolute z-50 mt-2 w-64 p-4 bg-white rounded-xl shadow-lg"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span>Habitaciones</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setRooms(r => Math.max(1, r - 1))}>
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span>{rooms}</span>
                                    <button onClick={() => setRooms(r => r + 1)}>
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Personas</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setGuests(g => Math.max(1, g - 1))}>
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span>{guests}</span>
                                    <button onClick={() => setGuests(g => g + 1)}>
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Código Promocional */}
                <div className="flex flex-col gap-2 col-span-full sm:col-span-2 lg:col-span-3">
                    <label className="text-dozeblue font-medium">Código promocional</label>
                    <div className="flex items-center gap-2 border border-dozegray/30 bg-white rounded-xl px-4 py-2 shadow-sm">
                        <Percent className="text-dozeblue w-5 h-5" />
                        <input
                            type="text"
                            value={promoCode}
                            onChange={e => setPromoCode(e.target.value)}
                            placeholder="Ej: VERANO2025"
                            className="flex-1 outline-none text-dozeblue placeholder-dozegray text-sm bg-transparent"
                        />
                    </div>
                </div>

                {/* Botón */}
                <div className="flex items-end justify-end sm:justify-center col-span-full">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        className="bg-dozeblue text-greenlight font-semibold px-6 py-3 rounded-full shadow-md hover:bg-greenlight hover:text-dozeblue transition-colors"
                    >
                        Buscar alojamiento
                    </motion.button>
                </div>
            </form>
        </motion.section>
    )
}
