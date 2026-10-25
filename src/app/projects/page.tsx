import Link from "next/link";
import Rail from "@/components/Rail";
import TopBar from "@/components/TopBar";
import Colophon from "@/components/Colophon";

export default function ProjectsIndexPage() {
  return (
    <div className="page">
      <Rail />
      <main className="column">
        <TopBar />

        <header className="masthead">
          <h1 className="title">
            Projects<span> · Lloyd Alba</span>
          </h1>
          <p className="statement">
            A redesigned project index is on the way. You can still open
            individual project pages from the homepage.
          </p>
        </header>

        <p>
          <Link href="/">Back home</Link>
        </p>

        <Colophon />
      </main>
    </div>
  );
}
