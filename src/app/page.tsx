import ActNow from "@/components/ActNow";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import OnSet from "@/components/OnSet";
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
        <TrustedBy />
        <Reels />
        <Services />
        <Process />
        <Results />
        <OnSet />
        <ActNow />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
