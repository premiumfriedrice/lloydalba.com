import type { Metadata } from "next";
import {
  experiences,
  education,
  achievements,
  skills,
} from "@/lib/experience";
import ContactLinks, { CONTACT_EMAIL } from "@/components/ContactLinks";

export const metadata: Metadata = {
  title: "About — Lloyd Alba",
  description: "Lloyd Alba — experience, education, skills, and recognition.",
};

export default function AboutPage() {
  return (
    <main className="content">
      <section className="section">
        <div className="inner">
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
      </section>
    </main>
  );
}
