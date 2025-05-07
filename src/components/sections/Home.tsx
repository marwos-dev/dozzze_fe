'use client'

import HomeSlider from '@/components/sliders/HomeSlider'

export default function Home() {
    return (
        <div className="py-20 px-6 lg:px-24 flex flex-col-reverse lg:flex-row items-center justify-between gap-10">

            {/* Texto a la izquierda en pantallas grandes */}
            <div className="max-w-xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#1E3A8A]">
                    Descubrí el hospedaje ideal para tu estadía
                </h1>
                <p className="text-lg text-[#808080] mb-6">
                    Espacios cómodos, naturales y flexibles. Reservá por días y personas fácilmente.
                </p>
                <button className="bg-[#FBBF24] text-[#808080] hover:bg-[#e0a800] px-6 py-3 text-lg rounded-xl transition">
                    Reservar ahora
                </button>
            </div>

            {/* Slider a la derecha */}
            <div className="w-full lg:w-[600px]">
                <HomeSlider />
            </div>

        </div>
    )
}
