import Link from "next/link";
import { Rail, TopNav } from "@/components/Nav";
import { Socials } from "@/components/Socials";
import { resume } from "@/lib/resume";
import { getAllProjects } from "@/lib/projects";
import { getAllWritings } from "@/lib/writings";
import { homeLists } from "@/lib/home";
import { renderInlineMarkdown } from "@/lib/markdown";
import { PeekList } from "@/components/PeekList";

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
            <PeekList
              items={projects.map((p) => ({
                href: `/projects/${p.slug}`,
                title: p.title,
                subHtml: p.taglineHtml,
                html: p.html,
              }))}
            />
          </>
        )}

        {writings && (
          <>
            <p className="label index-label">
              <span>Recent writing</span>
              <Link href="/writings">all writing →</Link>
            </p>
            <PeekList
              items={writings.map((w) => ({
                href: `/writings/${w.slug}`,
                title: w.title,
                note: w.date,
                html: w.html,
              }))}
            />
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
