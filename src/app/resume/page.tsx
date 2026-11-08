import type { Metadata } from "next";
import { Rail, TopNav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Resume — Lloyd Alba",
  description: "Lloyd Alba's resume.",
};

const PDF = "/documents/LloydAlba_Resume.pdf";
const IMAGE = "/documents/LloydAlba_Resume.png";

export default function ResumePage() {
  return (
    <div className="page">
      <Rail current="resume" />
      <main className="column">
        <TopNav current="resume" />

        <header className="masthead">
          <div className="title-row">
            <h1 className="title">Resume</h1>
          </div>
          <ul className="masthead-line">
            <li>
              <a href={PDF} download>
                Download PDF ↓
              </a>
            </li>
            <li>
              <a href="/resume.md">resume.md</a>
            </li>
            <li>
              <a href="/resume.json">resume.json</a>
            </li>
          </ul>
        </header>

        <div className="film">
          <a href={PDF} aria-label="Open the resume PDF">
            {/* Pre-rendered page image: no client JS, works on every phone. Regenerate with scripts/render-resume.sh. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGE} width={1632} height={2112} alt="Lloyd Alba's one-page resume" />
          </a>
        </div>
      </main>
    </div>
  );
}
