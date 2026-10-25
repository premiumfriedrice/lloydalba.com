import Rail from "@/components/Rail";
import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Section from "@/components/Section";
import Objects from "@/components/Objects";
import Rules from "@/components/Rules";
import Colophon from "@/components/Colophon";

export default function Home() {
  return (
    <div className="page">
      <Rail />
      <main className="column">
        <TopBar />
        <Masthead />

        <Section index="01" title="Projects" id="projects">
          <p className="text-muted">
            Selected work. Each project is built to solve a real problem, learn
            something new, or both.
          </p>
          <Objects />
        </Section>

        <Section index="02" title="About" id="about">
          <p className="text-muted">
            A short summary. A longer about page is coming soon.
          </p>
          <Rules />
        </Section>

        <Section index="03" title="Contact" id="contact">
          <p className="text-muted">
            Open to interesting projects and conversations.
          </p>
          <p>
            <a href="mailto:lloyddalba@gmail.com">lloyddalba@gmail.com</a>
          </p>
        </Section>

        <Colophon />
      </main>
    </div>
  );
}
