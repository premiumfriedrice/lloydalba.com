import Side from "@/components/Side";
import Credit from "@/components/Credit";
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
    <ul className="list">
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
    <div className="shell">
      <Side />
      <main className="content">
        <section id="home" className="section">
          <p className="bio">
            I&apos;m a computer science student at Texas A&amp;M. I build AI
            agents, iOS apps, and tools that make engineers faster — and
            right now I&apos;m an agentic AI engineering intern at Fable
            Innovations.
          </p>
        </section>

        <section id="projects" className="section">
          <p className="line">What I&apos;m building now, and what has shipped.</p>

          <div className="subsec" id="current">
            <p className="label">Current</p>
            <List items={current} />
          </div>

          <div className="subsec" id="past">
            <p className="label">Past</p>
            <List items={past} />
          </div>
        </section>

        <section id="about" className="section">
          <div className="subsec" id="experience">
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

          <div className="subsec" id="education">
            <p className="label">Education</p>
            <ul className="list">
              <li>
                <span className="k">{education.school}</span>
                <span className="v">{education.degree}</span>
                <span className="n">{education.time}</span>
              </li>
            </ul>
          </div>

          <div className="subsec" id="skills">
            <p className="label">Skills</p>
            <ul className="skills">
              {skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>

          <div className="subsec" id="recognition">
            <p className="label">Recognition</p>
            <ul className="list">
              {achievements.map((a) => (
                <li key={a.title}>
                  <span className="k">{a.title}</span>
                  <span className="v">{a.event}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <footer className="footer">
        <p className="foot-label">Lloyd Alba</p>
        <p>© 2026 · College Station, Texas</p>
      </footer>
      <Credit />
    </div>
  );
}
