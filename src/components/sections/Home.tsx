'use client'
import HomeSlider from '@/components/sliders/HomeSlider'
import AnimatedButton from '../ui/buttons/AnimatedButton'

export default function Home() {
    return (
        <div className="py-10 px-6 lg:px-24 flex flex-col-reverse lg:flex-row items-center justify-between gap-10">

            {/* Texto a la izquierda en pantallas grandes */}
            <div className="max-w-xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#1E3A8A]">
                    Descubrí el hospedaje ideal para tu estadía
                </h1>
                <p className="text-lg text-dozegray mb-12">
                    Espacios cómodos, naturales y flexibles. Reservá por días y personas fácilmente.
                </p>
                <AnimatedButton
                    text="Reservar ahora"
                    sectionId="#reservar"
                />
            </div>

            {/* Slider a la derecha */}
            <div className="w-full lg:w-[600px]">
                <HomeSlider />
            </div>

        </div>
    )
}
