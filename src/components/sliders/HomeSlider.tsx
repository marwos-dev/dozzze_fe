'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const images = [
    '/images/homesection/img1.jpg',
    '/images/homesection/img2.jpg',
    '/images/homesection/img3.jpg',
]

export default function HomeSlider() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative w-full max-w-xl h-[400px] sm:h-[500px] mx-auto overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
                {images.map((src, index) => {
                    const isActive = index === currentIndex
                    const isPrev =
                        index === (currentIndex - 1 + images.length) % images.length
                    const isNext = index === (currentIndex + 1) % images.length

                    const baseClass =
                        'absolute transition-all duration-700 ease-in-out rounded-2xl shadow-xl overflow-hidden'

                    const className = isActive
                        ? `${baseClass} w-full h-full z-30 scale-100 opacity-100 blur-0`
                        : isPrev || isNext
                            ? `${baseClass} w-3/4 h-4/5 z-20 scale-90 opacity-60 blur-sm ${isPrev ? '-translate-x-1/2 left-0' : 'translate-x-1/2 right-0'
                            }`
                            : 'hidden'

                    return (
                        <div className={className} key={index}>
                            <Image
                                src={src}
                                alt={`Slide ${index + 1}`}
                                fill
                                className="object-cover"
                                priority={isActive}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
