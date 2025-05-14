'use client';
import Image from "next/image";

interface ZoneCardFooterProps {
    imageUrls: string[];
    selectedImage: string;
    setSelectedImage: (url: string) => void;
    setShowMap: (value: boolean) => void;
}

export default function ZoneCardFooter({
    imageUrls,
    selectedImage,
    setSelectedImage,
    setShowMap
}: ZoneCardFooterProps) {
    return (
        <div className="bg-dozebg1 mt-1 mb-4 px-4 shadow-md rounded-b-lg">
            {/* Miniaturas */}
            <div className="flex overflow-x-auto gap-2 pt-2 scrollbar-hide">
                {imageUrls.map((url, index) => (
                    <div
                        key={index}
                        className={`relative w-20 h-14 rounded-md cursor-pointer overflow-hidden border-2 ${url === selectedImage ? 'border-dozeblue' : 'border-transparent'}`}
                        onClick={() => {
                            setSelectedImage(url);
                            setShowMap(false);
                        }}
                    >
                        <Image
                            src={url}
                            alt={`Miniatura ${index + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                ))}
            </div>

            {/* Botón */}
            <div className="mt-2 pb-4">
                <button
                    onClick={() => alert('Explorar zona (futuro redireccionamiento)')}
                    className="bg-dozeblue text-greenlight text-sm px-4 py-2 rounded hover:bg-opacity-90 transition-all ease-in-out duration-300 w-full"
                >
                    Explorar zona
                </button>
            </div>
        </div>
    );
}
