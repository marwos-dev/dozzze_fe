import React, { RefObject } from 'react';
import { CalendarDays, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange, Range } from 'react-date-range';
import { motion } from 'framer-motion';

interface DateInputProps {
    dateRange: Range[];
    onDateChange: (item: any) => void;
    isPopoverOpen: boolean;
    setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
    calendarRef: RefObject<HTMLDivElement | null>
}

const DateInput: React.FC<DateInputProps> = ({ dateRange, onDateChange, isPopoverOpen, setIsPopoverOpen, calendarRef }) => {
    return (
        <div className="relative col-span-full sm:col-span-2">
            <label className="text-dozeblue font-medium block mb-1">Fechas</label>
            <button
                type="button"
                className="w-full flex items-center gap-2 border border-dozegray/30 bg-white rounded-xl px-4 py-2 shadow-sm"
                onClick={() => setIsPopoverOpen(prev => !prev)}
            >
                <CalendarDays className="text-dozeblue w-5 h-5" />
                <span className="text-sm text-dozeblue">
                    {`${format(dateRange[0].startDate!, 'dd/MM/yyyy')} - ${format(dateRange[0].endDate!, 'dd/MM/yyyy')}`}
                </span>
            </button>
            {isPopoverOpen && (
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
                            onClick={() => setIsPopoverOpen(false)}
                            className="text-dozeblue hover:text-red-500 transition-colors"
                            aria-label="Cerrar calendario"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <DateRange
                        editableDateInputs={true}
                        onChange={onDateChange}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                        minDate={new Date()}
                    />
                </motion.div>
            )}
        </div>
    );
};

export default DateInput;
