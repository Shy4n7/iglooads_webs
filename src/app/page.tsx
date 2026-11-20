import ActNow from "@/components/ActNow";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Process from "@/components/Process";
import Reels from "@/components/Reels";
import Results from "@/components/Results";
import Services from "@/components/Services";
import TrustedBy from "@/components/TrustedBy";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Intro />
        <TrustedBy />
        <Reels />
        <Services />
        <Process />
        <Results />
        <ActNow />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
