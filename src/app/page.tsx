import ContactLinks, { CONTACT_EMAIL } from "@/components/ContactLinks";
import { projects } from "@/lib/projects";
import {
  experiences,
  education,
  achievements,
  skills,
} from "@/lib/experience";
import type { Project } from "@/types";

function List({ items }: { items: Project[] }) {
  return (
    <ul className="projects">
      {items.map((project) => (
        <li key={project.slug}>
          <span className="k">{project.name}</span>
          <span className="v">{project.skills.join(" · ")}</span>
          {project.period && <span className="n">{project.period}</span>}
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const current = projects.filter((p) => p.status === "current");
  const past = projects.filter((p) => p.status !== "current");

  return (
    <main>
      {/* Lloyd Alba */}
      <section id="home" className="section section--home">
        <div className="inner">
          <p className="bio">
            I&apos;m a computer science student at Texas A&amp;M. I build AI
            agents, iOS apps, and tools that make engineers faster — and right
            now I&apos;m an agentic AI engineering intern at Fable Innovations.
          </p>
          <div className="home-contact">
            <p className="line">
              <a className="link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </p>
            <p className="line">
              <ContactLinks />
            </p>
          </div>
        </div>
      </section>

      {/* Projects — scroll horizontally to explore */}
      <section id="projects" className="section section--projects">
        <div className="deck" data-deck>
          <div className="panel subsec" id="current">
            <div className="inner">
              <p className="label">Current</p>
              <List items={current} />
            </div>
          </div>

          <div className="panel subsec" id="past">
            <div className="inner">
              <p className="label">Past</p>
              <List items={past} />
            </div>
          </div>
        </div>
      </section>

      {/* About — scroll horizontally to explore */}
      <section id="about" className="section section--about">
        <div className="deck" data-deck>
          <div className="panel subsec" id="experience">
            <div className="inner">
              <p className="label">Experience</p>
              <ul className="list">
                {experiences.map((exp) => (
                  <li key={exp.time + exp.position}>
                    <span className="k">{exp.time}</span>
                    <span className="v">
                      {exp.position} · {exp.company}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="panel subsec" id="education">
            <div className="inner">
              <p className="label">Education</p>
              <ul className="list">
                <li>
                  <span className="k">{education.school}</span>
                  <span className="v">{education.degree}</span>
                  <span className="n">{education.time}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="panel subsec" id="skills">
            <div className="inner">
              <p className="label">Skills</p>
              <ul className="skills">
                {skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="panel subsec" id="recognition">
            <div className="inner">
              <p className="label">Recognition</p>
              <ul className="list">
                {achievements.map((a) => (
                  <li key={a.title}>
                    <span className="k">{a.title}</span>
                    <span className="v">{a.event}</span>
                  </li>
                ))}
              </ul>

              <footer className="footer">
                <div className="footer-contact">
                  <p className="foot-label">Contact</p>
                  <p className="line">
                    <a className="link" href={`mailto:${CONTACT_EMAIL}`}>
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                  <p className="line">
                    <ContactLinks />
                  </p>
                </div>
                <p className="foot-label">Lloyd Alba</p>
                <p>© 2026 · College Station, Texas</p>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
