import type { Metadata } from "next";
import Side from "@/components/Side";
import Credit from "@/components/Credit";
import { experiences, achievements } from "@/lib/experience";

export const metadata: Metadata = {
  title: "About - Lloyd Alba",
  description: "Lloyd Alba — software engineer. Experience and recognition.",
};

export default function AboutPage() {
  return (
    <div className="shell">
      <Side page="About" />
      <main className="content">
        <p className="bio">
          <strong>About</strong> — the short version, with the receipts.
        </p>

        <p className="line">
          <a
            className="link"
            href="/documents/LloydAlba_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            View resume
          </a>
        </p>

        <p className="label">Experience</p>
        <ul className="list">
          {experiences.map((exp) => (
            <li key={exp.time + exp.position}>
              <span className="k">{exp.time}</span>
              <span className="v">
                {exp.position} ·{" "}
                <a
                  className="link"
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {exp.company}
                </a>
              </span>
              <span className="n">{exp.bullets[0]}</span>
            </li>
          ))}
        </ul>

        <p className="label">Recognition</p>
        <ul className="list">
          {achievements.map((a) => (
            <li key={a.title}>
              <span className="k">{a.title}</span>
              <span className="v">{a.event}</span>
            </li>
          ))}
        </ul>
      </main>
      <Credit />
    </div>
  );
}
