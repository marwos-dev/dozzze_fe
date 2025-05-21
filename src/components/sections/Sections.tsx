"use client";

import Home from "./Home";
import Properties from "./Properties";
import Seeker from "./Seeker";
import ZoneSection from "./Zones";

const Sections = () => {
  return (
    <main>
      <Home />
      <ZoneSection />
      <section className=" pb-5">
        <Properties />
      </section>
      <section className=" p-5" id="seeker">
        <Seeker />
      </section>
    </main>
  );
};
export default Sections;
