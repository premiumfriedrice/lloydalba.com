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
