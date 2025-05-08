'use client'

import { ArrowDown } from 'lucide-react'
import { MouseEventHandler, TouchEventHandler } from 'react'

interface AnimatedButtonProps {
    text: string
    sectionId: string
    className?: string
}

const AnimatedButton = ({
    text,
    sectionId,
    className = '',
}: AnimatedButtonProps) => {
    const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
        const section = document.querySelector(sectionId)
        if (section) section.scrollIntoView({ behavior: 'smooth' })
    }

    const handleTouch: TouchEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        handleClick(e as any)
    }

    return (
        <button
            onClick={handleClick}
            onTouchStart={handleTouch}
            className={`group flex items-center border-2 border-dozeblue gap-3 font-semibold py-2 pl-4 pr-3 rounded-full transition-colors bg-greenlight text-dozeblue hover:bg-dozeblue hover:text-greenlight focus:outline-none focus:ring-2 focus:ring-greenlight ${className}`}
        >
            {text}
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-dozeblue group-hover:bg-greenlight group-focus:ring-2 group-focus:ring-greenlight`}
            >
                <ArrowDown
                    className={`w-4 h-4 transition-transform group-hover:translate-y-1 text-greenlight group-hover:text-dozeblue`}
                />
            </div>
        </button>
    )
}

export default AnimatedButton
