export default function Credit() {
  return (
    <div className="credit">
      <p className="label">Contact</p>
      <p className="line">
        <a className="link" href="mailto:lloyddalba@gmail.com">
          lloyddalba@gmail.com
        </a>
      </p>
      <p className="line">
        <a
          className="link"
          href="https://github.com/premiumfriedrice"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        {" · "}
        <a
          className="link"
          href="https://www.linkedin.com/in/lloydalba/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        {" · "}
        <a
          className="link"
          href="/documents/LloydAlba_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>
      </p>
    </div>
  );
}
