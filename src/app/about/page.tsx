import Link from "next/link";
import Rail from "@/components/Rail";
import TopBar from "@/components/TopBar";
import Colophon from "@/components/Colophon";

export default function AboutPage() {
  return (
    <div className="page">
      <Rail />
      <main className="column">
        <TopBar />

        <header className="masthead">
          <h1 className="title">
            About<span> · Lloyd Alba</span>
          </h1>
          <p className="statement">
            A refreshed about page is on the way. In the meantime, you can view
            my work on the homepage or download my resume.
          </p>
        </header>

        <p>
          <a
            href="/documents/LloydAlba_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            View resume
          </a>
          {" · "}
          <Link href="/">Back home</Link>
        </p>

        <Colophon />
      </main>
    </div>
  );
}
