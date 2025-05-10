'use client';

interface ZoneCardFooterProps {
    destination: string;
    duration: string;
}

export default function ZoneCardFooter({ destination, duration }: ZoneCardFooterProps) {
    return (
        <>
            <div className="bg-dozebg1 py-4 px-4 shadow-md">
                <h1 className="text-lg text-black">{destination}</h1>
                <p className="text-lg text-dozegray">{duration}</p>
            </div>
            <div className="py-4 px-4 flex justify-between items-center">
                <button
                    onClick={() => alert('Explorar zona (futuro redireccionamiento)')}
                    className="bg-dozeblue text-greenlight text-sm px-4 py-2 rounded hover:bg-opacity-90 transition-all ease-in-out duration-300 w-full mr-2"
                >
                    Explorar zona
                </button>
            </div>
        </>
    );
}
