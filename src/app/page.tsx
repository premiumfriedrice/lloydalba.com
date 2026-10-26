import ContactLinks, { CONTACT_EMAIL } from "@/components/ContactLinks";

export default function Home() {
  return (
    <main className="content">
      <section className="section">
        <div className="inner">
          <p className="bio">
            I&apos;m a computer science student at Texas A&amp;M. I build AI
            agents, iOS apps, and tools that make engineers faster — and right
            now I&apos;m an agentic AI engineering intern at Fable Innovations.
          </p>
          <div className="home-contact">
            <p className="line">
              <a className="link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </p>
            <p className="line">
              <ContactLinks />
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
