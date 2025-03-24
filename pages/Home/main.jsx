import React from "react";
import Navbar from "../../components/Navbar/main";
import Hero from "../../components/Hero/main";
import CardsSection from "../../components/ProductsSection/main";
import AboutUsSection from "../../components/AboutSection/main";
import AboutUs from "../../components/AboutUs/AboutUs";
import ScrollingX from "../../components/ScrollingX/main";
import KitsSection from "../../components/KitsSection/index";
import Footer from "../../components/footer/main";
import MobileCarousel from "../../components/MobileCarousel/main";
import InformativeCorporate from "../../components/InformativeCorporate/InformativeCorporate";
import MapSection from "../../components/MapSection/MapSection";

const Home = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Hero></Hero>
            <InformativeCorporate></InformativeCorporate>
            <AboutUs></AboutUs>
            <MapSection></MapSection>
            <CardsSection></CardsSection>
            <KitsSection></KitsSection>
            <ScrollingX></ScrollingX>
            <MobileCarousel></MobileCarousel>
            <AboutUsSection id='aboutUs'></AboutUsSection>
            <Footer id='contact'></Footer>

        </div>
    )
}

export default Home;