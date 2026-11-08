import { Github, Linkedin, Mail } from "lucide-react";
import { Rail, TopNav } from "@/components/Nav";
import { resume } from "@/lib/resume";

const { education, skills, experience } = resume;

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
            <dd>{education.coursework.join(", ")}</dd>
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
                <tr key={exp.start + exp.title}>
                  <th scope="row">{exp.period}</th>
                  <td>
                    {exp.title} · {exp.company}
                  </td>
                  <td>{exp.bullets[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </main>
    </div>
  );
}
