import type { Metadata } from "next";
import Link from "next/link";
import { Rail, TopNav } from "@/components/Nav";
import { Socials } from "@/components/Socials";
import { resume } from "@/lib/resume";
import { getAllProjects } from "@/lib/projects";
import { renderInlineMarkdown } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Resume — Lloyd Alba",
  description: "Lloyd Alba's full resume: education, skills, experience, projects.",
};

export default function ResumePage() {
  const projects = getAllProjects();
  const { education, skills, experience } = resume;

  return (
    <div className="page">
      <Rail current="resume" />
      <main className="column">
        <TopNav current="resume" />

        <header className="masthead">
          <div className="title-row">
            <h1 className="title">
              {resume.name}<span> · {resume.title}</span>
            </h1>
            <Socials />
          </div>
          <ul className="masthead-line">
            <li>
              <a href={`mailto:${resume.email}`}>{resume.email}</a>
            </li>
          </ul>
          <p
            className="statement"
            dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(resume.summary) }}
          />
        </header>

        <div className="lede">
          <p className="label">Education</p>
          <dl className="rules">
            <dt>School</dt>
            <dd>
              {education.school} · {education.location}
            </dd>
            <dt>Degree</dt>
            <dd>{education.degree}</dd>
            <dt>Expected</dt>
            <dd>{education.expected}</dd>
            <dt>Coursework</dt>
            <dd>{education.coursework.join(", ")}</dd>
          </dl>

          <p className="label">Technical Skills</p>
          <ul className="skills">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>

          <p className="label">Experience</p>
          {experience.map((exp) => (
            <section className="cv-block" key={exp.start + exp.title}>
              <div className="cv-head">
                <span>
                  <strong>{exp.title}</strong> · {exp.company}
                </span>
                <span className="t">{exp.period}</span>
              </div>
              <ul className="cv-bullets">
                {exp.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </section>
          ))}

          <p className="label">Projects</p>
          {projects.map((project) => (
            <section className="cv-block" key={project.slug}>
              <div className="cv-head">
                <span>
                  <strong>
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </strong>
                  {project.stack.length > 0 && <> · {project.stack.join(", ")}</>}
                </span>
                <span className="t">{project.period}</span>
              </div>
              <ul className="cv-bullets">
                {project.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </section>
          ))}

          <p className="foot">
            Also as <a href="/resume.md">resume.md</a>, <a href="/resume.json">resume.json</a>, and{" "}
            <a href="/documents/LloydAlba_Resume.pdf">PDF</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
