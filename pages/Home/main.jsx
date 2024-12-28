import React from "react";
import Navbar from "../../components/Navbar/main";
import Hero from "../../components/Hero/main";
import Esencias from "../../components/Esencias/main";
import CardsSection from "../../components/Card/main";
import AboutUsSection from "../../components/AboutSection/main";

import Footer from "../../components/footer/main";

const Home = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Hero></Hero>
            <CardsSection></CardsSection>
            <Esencias></Esencias>
            <AboutUsSection></AboutUsSection>
            <Footer></Footer>

        </div>
    )
}

export default Home;