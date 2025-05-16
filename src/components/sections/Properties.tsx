'use client'
import PropertiesCard from "../ui/cards/PropertiesCard/ProperitesCard";

export default function Properties() {
    return (
        <section className="max-w-6xl bg-greenlight mx-auto mt-10">
            <PropertiesCard
                title="W Doha Hotel and Residences"
                location="Midtown East Grand Central"
                description="Ezdan Hotel & Suites offers a variety of suites and apartments for long and short stays in Doha. It overlooks the Arabian Gulf and is nearby the Corniche."
                stars={4}
                tripRating={5}
                images={[
                    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
                    'https://images.unsplash.com/photo-1501117716987-c8e1ecb2100d?w=800',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
                    'https://images.unsplash.com/photo-1559599078-5ccfe6c937f7?w=800',
                ]}
                link="#"
            />
        </section>
    );
}

