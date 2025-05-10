import Home from "./Home";
import Seeker from "./Seeker";
import ZoneSection from "./Zones";

const Sections = () => {
    return (
        <main>
            <Home />
            <ZoneSection />
            <section className="bg-greenlight py-2" id="seeker">
                <Seeker />
            </section>
        </main>
    );
};
export default Sections;