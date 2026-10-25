import Hero from "./sections/Hero";
import FeaturedObject from "./sections/FeaturedObject";
import ProjectGrid from "./sections/ProjectGrid";
import AboutTeaser from "./sections/AboutTeaser";
import ContactColophon from "./sections/ContactColophon";

export default async function Home() {
  return (
    <div className="max-w-2xl mx-auto px-6 pb-24">
      <Hero />
      <FeaturedObject />
      <ProjectGrid />
      <AboutTeaser />
      <ContactColophon />
    </div>
  );
}
