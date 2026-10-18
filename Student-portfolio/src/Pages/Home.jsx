import Hero from "../components/Hero";
import About from "../components/About";
import Skill from "../components/Skill";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Education from "../components/Education";
import Achievements from "../components/Achievements";
import ContactSection from "../components/ContactSection";

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skill />
      <Projects />
      <Experience />
      <Education />
      <Achievements />
      <ContactSection />
    </>
  );
}

export default Home;