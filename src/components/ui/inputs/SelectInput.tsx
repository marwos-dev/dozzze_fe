import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface SelectInputProps {
    label: string;
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
    min?: number;
    max?: number;
}

const SelectInput: React.FC<SelectInputProps> = ({
    label,
    value,
    setValue,
    min = 1,
    max = 10
}) => {
    const decrease = () => setValue(prev => Math.max(min, prev - 1));
    const increase = () => setValue(prev => Math.min(max, prev + 1));

    return (
        <div className="col-span-full sm:col-span-2 lg:col-span-1">
            <label className="text-dozeblue font-medium block mb-1">{label}</label>
            <div className="flex items-center justify-between border border-dozegray/30 bg-white rounded-xl px-4 py-2 shadow-sm">
                <button
                    type="button"
                    onClick={decrease}
                    className="p-1 text-dozeblue hover:text-black disabled:text-gray-300"
                    disabled={value <= min}
                >
                    <Minus className="w-5 h-5" />
                </button>
                <span className="text-dozeblue text-sm font-medium">{value}</span>
                <button
                    type="button"
                    onClick={increase}
                    className="p-1 text-dozeblue hover:text-black disabled:text-gray-300"
                    disabled={value >= max}
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default SelectInput;
