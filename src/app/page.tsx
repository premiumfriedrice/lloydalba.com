import { Github, Linkedin, Mail } from "lucide-react";
import { Rail, TopNav } from "@/components/Nav";
import { education, skills, experience, projects } from "@/lib/resume";

const socials = [
  { href: "https://github.com/premiumfriedrice", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/lloydalba/", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:lloyddalba@gmail.com", icon: Mail, label: "Email" },
];

export default function Home() {
  return (
    <div className="page">
      <Rail current="home" />
      <main className="column">
        <TopNav current="home" />

        <header className="masthead">
          <div className="title-row">
            <h1 className="title">
              Lloyd Alba<span> · software engineer</span>
            </h1>
            <ul className="social">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.label !== "Email" ? "_blank" : undefined}
                    rel={s.label !== "Email" ? "noopener noreferrer" : undefined}
                    aria-label={s.label}
                  >
                    <s.icon size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="statement">
            My name is Lloyd. I study Computer Science at Texas A&amp;M
            University. I love designing things such as websites and mobile
            apps, and I like building software automations.
          </p>
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
            <dd>{education.coursework}</dd>
          </dl>

          <p className="label">Technical Skills</p>
          <ul className="skills">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>

          <p className="label">Experience</p>
          <table className="table">
            <tbody>
              {experience.map((exp) => (
                <tr key={exp.time + exp.role}>
                  <th scope="row">{exp.time}</th>
                  <td>
                    {exp.role} · {exp.company}
                  </td>
                  <td>{exp.highlight}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="label">Projects</p>
          <table className="table">
            <tbody>
              {projects.map((project) => (
                <tr key={project.name}>
                  <th scope="row">{project.name}</th>
                  <td>{project.description}</td>
                  <td>{project.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
