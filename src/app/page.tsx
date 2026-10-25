import Rail from "@/components/Rail";
import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Section from "@/components/Section";
import Objects from "@/components/Objects";
import ExperienceTable from "@/components/ExperienceTable";
import Rules from "@/components/Rules";
import Recognition from "@/components/Recognition";
import Colophon from "@/components/Colophon";

export default function Home() {
  return (
    <div className="page">
      <Rail />
      <main className="column">
        <TopBar />
        <Masthead />

        <div className="lede">
          <p>
            I&apos;m a software engineer in Texas, three summers into building
            platform tooling at Arrive Logistics — CI/CD pipelines as code,
            .NET migrations, cloud governance — and the rest of the time
            shipping side projects of my own.
          </p>
          <p>
            The through-line in everything I build is the same:{" "}
            <em>the thing should work, and you should be able to see why</em>.
            A pipeline you can read, a tool that saves a sprint, an app that
            feels considered down to the last screen.
          </p>
        </div>

        <Section id="projects">
          <p>
            Selected work. Each project solves a real problem, teaches me
            something new, or both.
          </p>
          <Objects />
        </Section>

        <Section id="experience">
          <p>
            Three summers on the same platform team, each one deeper than the
            last.
          </p>
          <ExperienceTable />
        </Section>

        <Section id="about">
          <p>The short version. A longer about page is coming.</p>
          <Rules />
        </Section>

        <Section id="recognition">
          <p>Competitions and hackathons.</p>
          <Recognition />
        </Section>

        <Colophon />
      </main>
    </div>
  );
}
