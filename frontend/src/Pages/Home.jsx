import Header from '../components/home/Header';
import Header2 from '../components/home/2Header';
import HeroSection from '../components/home/HeroSection';
import WelcomeSection from '../components/home/WelcomeSection';
import ToursSection from '../components/home/ToursSection';
import FeaturesSection from '../components/home/FeaturesSection';
import ActivitiesSection from '../components/home/ActivitiesSection';
import AboutSection from '../components/home/AboutSection';
import ResponsibleTourismSection from '../components/home/ResponsibleTourismSection';
import ContactSection from '../components/home/ContactSection';
import Footer from '../components/home/Footer';

function Home() {
  return (
    <main>
      <Header />
      <Header2/>
      <HeroSection />
      <WelcomeSection />
      <ToursSection />
      <FeaturesSection />
      <ActivitiesSection />
      <AboutSection />
      <ResponsibleTourismSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

export default Home;
