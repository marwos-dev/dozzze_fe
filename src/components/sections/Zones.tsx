import ZoneCard from "../ui/cards/ZoneCard";

export default function ZoneSection() {
    return (
        <div className="flex flex-wrap justify-center bg-dozebg1 min-h-screen py-10">
            <ZoneCard
                country="Zona A"
                destination="Madris"
                hotel="Surfer's Home"
                duration="3 Days - 2 Nights"
                price="£750"
                imageUrl="https://31.media.tumblr.com/9e9ba532a3174811c79e07bc4a61ebdc/tumblr_n92w6iRSjY1r5gmiko1_500.jpg"
            />
            <ZoneCard
                country="zona b"
                destination="Barcelona"
                hotel="Farmer's Walk"
                duration="4 Days - 3 Nights"
                price="£950"
                imageUrl="http://www.asianventure.com/images/country/vietnam.jpg"
            />
            <ZoneCard
                country="JAPAN"
                destination="Tokyo"
                hotel="Mandarin Oriental"
                duration="3 Days - 2 Nights"
                price="£1250"
                imageUrl="https://media-cdn.tripadvisor.com/media/photo-s/06/c7/ba/92/salah-satu-bangunan-di.jpg"
            />
        </div>
    );
}
