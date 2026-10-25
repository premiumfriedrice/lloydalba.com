export default function Colophon() {
  const year = new Date().getFullYear();

  return (
    <footer className="colophon">
      <p>© {year} Lloyd Alba. Built with Next.js & Tailwind.</p>
      <p>
        <a href="https://github.com/premiumfriedrice">GitHub</a>
        {" · "}
        <a href="https://www.linkedin.com/in/lloydalba/">LinkedIn</a>
        {" · "}
        <a href="mailto:lloyddalba@gmail.com">Email</a>
      </p>
    </footer>
  );
}
