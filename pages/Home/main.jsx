import React from "react";
import Navbar from "../../components/Navbar/main";
import Hero from "../../components/Hero/main";
import CardsSection from "../../components/ProductsSection/main";
import AboutUsSection from "../../components/AboutSection/main";
import AboutUs from "../../components/AboutUs/AboutUs";
import KitsSection from "../../components/KitsSection/index";
import Footer from "../../components/footer/main";
import ComoComprar from "../../components/ComoComprar/ComoComprar";
import Faqs from "../../components/Faqs/Faqs";
import WhatsAppFab from "../../components/WhatsAppFab/WhatsAppFab";

const Home = () => {
    return (
        <div>
            <Navbar />
            <Hero />

            {/* Lo que se vende, antes que el relato de marca */}
            <CardsSection />
            <ComoComprar />
            <KitsSection />
            <Faqs />

            {/* "Consume más esencia" y "Nosotros" unificados en una sola sección */}
            <section id="nosotros">
                <AboutUs />
                <AboutUsSection />
            </section>

            <Footer />
            <WhatsAppFab />
        </div>
    )
}

export default Home;
