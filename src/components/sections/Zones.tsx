// app/components/ZoneSection.tsx
'use client';
import ZoneCard from "../ui/cards/ZoneCard/ZoneCard";

const imageUrlsBarcelona = [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
    "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800"
];

const imageUrlsMexicoCity = [
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
];

const imageUrlsBuenosAires = [
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"
];

export default function ZoneSection() {
    return (
        <div className="relative py-10">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,_theme(colors.dozebg1)_65%,_theme(colors.greenlight)_75%)]" />
            <div className="flex flex-wrap justify-center gap-6">
                <ZoneCard
                    country="Barcelona, España"
                    imageUrls={imageUrlsBarcelona}
                    zoneCoordinates={[
                        [41.4689, 2.1234],
                        [41.4675, 2.2286],
                        [41.3809, 2.2286],
                        [41.3551, 2.1395],
                        [41.3870, 2.1076],
                        [41.4689, 2.1234],
                    ]}
                    pointsCoordinates={[
                        {
                            position: [-34.6250, -58.3900],
                            images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800']
                        },
                        {
                            position: [-34.6100, -58.4000]
                        }
                    ]}
                />
                <ZoneCard
                    country="Ciudad de México, México"
                    imageUrls={imageUrlsMexicoCity}
                    zoneCoordinates={[
                        [19.4352, -99.1456],
                        [19.4572, -99.1000],
                        [19.4200, -99.0700],
                        [19.3900, -99.1100],
                        [19.4000, -99.1600],
                        [19.4352, -99.1456],
                    ]}
                    pointsCoordinates={[
                        {
                            position: [-34.6250, -58.3900],
                            images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800']
                        },
                        {
                            position: [-34.6100, -58.4000]
                        }
                    ]}
                />
                <ZoneCard
                    country="Buenos Aires, Argentina"
                    imageUrls={imageUrlsBuenosAires}
                    zoneCoordinates={[
                        [-34.6037, -58.3816],
                        [-34.6095, -58.3700],
                        [-34.6200, -58.3720],
                        [-34.6250, -58.3900],
                        [-34.6100, -58.4000],
                        [-34.6037, -58.3816],
                    ]}
                    pointsCoordinates={[
                        {
                            position: [-34.6250, -58.3900],
                            images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800']
                        },
                        {
                            position: [-34.6100, -58.4000]
                        }
                    ]}
                />
            </div>
        </div>
    );
}
