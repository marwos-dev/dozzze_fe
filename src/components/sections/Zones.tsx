'use client';
import ZoneCard from "../ui/cards/ZoneCard/ZoneCard";

export default function ZoneSection() {
    return (
        <div className="flex flex-wrap justify-center bg-dozebg1 py-10">
            <ZoneCard
                country="España"
                destination="Barcelona"
                duration="7 días"
                imageUrl="https://media-cdn.tripadvisor.com/media/photo-s/06/c7/ba/92/salah-satu-bangunan-di.jpg"
                coordinates={[
                    [41.4689, 2.1234], // Zona norte (Nou Barris)
                    [41.4675, 2.2286], // Zona noreste (Sant Martí)
                    [41.3809, 2.2286], // Zona sureste (Barceloneta)
                    [41.3551, 2.1395], // Zona suroeste (Zona Franca / Montjuïc)
                    [41.3870, 2.1076], // Zona oeste (Les Corts)
                    [41.4689, 2.1234]  // Cierre del polígono
                ]}

            />
        </div>
    );
}
