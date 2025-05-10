'use client';
import ZoneCard from "../ui/cards/ZoneCard";

export default function ZoneSection() {
    return (
        <div className="flex flex-wrap justify-center bg-dozebg1 py-10">
            <ZoneCard
                country="España"
                destination="Barcelona"
                hotel="Hotel Catalonia"
                duration="7 días"
                imageUrl="https://media-cdn.tripadvisor.com/media/photo-s/06/c7/ba/92/salah-satu-bangunan-di.jpg"
                coordinates={[
                    [41.3874, 2.1686],
                    [41.3902, 2.1540],
                    [41.4036, 2.1744],
                    [41.3874, 2.1686]
                ]}
            />
        </div>
    );
}
