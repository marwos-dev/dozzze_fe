import Home from "./Home";
import Seeker from "./Seeker";

const Sections = () => {
    return (
        <main>
            <Home />
            <section className="bg-greenlight py-2" id="seeker">
                <Seeker />
            </section>
        </main>
    );
};
export default Sections;