import Image from "next/image";

interface ZoneCardProps {
    country: string;
    destination: string;
    hotel: string;
    duration: string;
    price: string;
    imageUrl: string;
}

export default function TravelCard({
    country,
    destination,
    hotel,
    duration,
    price,
    imageUrl,
}: ZoneCardProps) {
    return (
        <div className="w-full max-w-sm bg-greenlight  shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all text-center m-4">
            <h1 className="text-xl font-light tracking-widest font-sans text-gray-800 py-4">{country}</h1>

            <div className="relative w-[85%] h-[250px] mx-auto -mb-40 rounded shadow-md hover:shadow-2xl transform transition-all">
                <Image
                    src={imageUrl}
                    alt={destination}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded"
                />
            </div>

            <div className="relative z-10 bg-dozebg1 mt-44 py-6 px-4 shadow-md hover:shadow-xl transition-all">
                <h1 className="text-lg text-dozegray">{destination}</h1>
                <p className="text-lg text-dozegray">{duration}</p>
            </div>

            <h1 className="text-xl font-light tracking-widest py-4 text-gray-800">{price}</h1>
        </div>
    );
}
