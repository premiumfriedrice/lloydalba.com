import Link from "next/link";
import { Rail, TopNav } from "@/components/Nav";
import { Socials } from "@/components/Socials";
import { resume } from "@/lib/resume";
import { getAllProjects } from "@/lib/projects";
import { getAllWritings } from "@/lib/writings";
import { homeLists } from "@/lib/home";
import { renderInlineMarkdown } from "@/lib/markdown";

export default function Home() {
  const { projects, writings } = homeLists(getAllProjects(), getAllWritings());

  return (
    <div className="page">
      <Rail current="home" />
      <main className="column">
        <TopNav current="home" />

        <header className="masthead">
          <div className="title-row">
            <h1 className="title">
              {resume.name}<span> · {resume.title}</span>
            </h1>
            <Socials />
          </div>
          <p
            className="statement"
            dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(resume.summary) }}
          />
        </header>

        {projects.length > 0 && (
          <>
            <p className="label index-label">
              <span>Recent projects</span>
              <Link href="/projects">all projects →</Link>
            </p>
            <ul className="index">
              {projects.map((project) => (
                <li key={project.slug}>
                  <span className="k">
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </span>
                  <span className="v" dangerouslySetInnerHTML={{ __html: project.taglineHtml }} />
                </li>
              ))}
            </ul>
          </>
        )}

        {writings && (
          <>
            <p className="label index-label">
              <span>Recent writing</span>
              <Link href="/writings">all writing →</Link>
            </p>
            <ul className="index">
              {writings.map((writing) => (
                <li key={writing.slug}>
                  <span className="k t">{writing.date}</span>
                  <span className="v">
                    <Link href={`/writings/${writing.slug}`}>{writing.title}</Link>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="foot">
          Full resume → <Link href="/resume">Resume</Link>. Also as <a href="/resume.md">resume.md</a> and{" "}
          <a href="/resume.json">resume.json</a> for agents.
        </p>
      </main>
    </div>
  );
}
