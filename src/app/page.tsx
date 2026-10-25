import Link from "next/link";
import Side from "@/components/Side";
import Credit from "@/components/Credit";

export default function Home() {
  return (
    <div className="shell">
      <Side page="Home" />
      <main className="content">
        <p className="bio">
          <strong>Lloyd Alba</strong> is a software engineer in Texas,
          finishing a computer science degree at Texas A&amp;M and three
          summers into building platform tooling at Arrive Logistics — CI/CD
          pipelines as code, .NET migrations, and cloud governance that other
          engineers don&apos;t have to think about.
        </p>
        <p className="bio">
          Away from work I ship side projects of my own — an agentic AI
          framework, iOS apps, scrapers — and the rest of the time I&apos;m
          reading, riding, or taking something apart to see why it works.
        </p>
        <p className="bio">
          The through-line in everything I build is the same: the thing should
          work, and you should be able to <strong>see why it works</strong>. A
          pipeline you can read. A tool that saves a sprint. An app that feels
          considered down to the last screen.
        </p>
        <p className="bio">
          Selected work lives on the{" "}
          <Link className="link" href="/projects">
            projects page
          </Link>
          .
        </p>
      </main>
      <Credit />
    </div>
  );
}
