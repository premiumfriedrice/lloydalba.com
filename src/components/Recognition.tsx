import { achievements } from "@/lib/experience";

export default function Recognition() {
  return (
    <ul className="said">
      {achievements.map((a) => (
        <li key={a.title}>
          <strong>{a.title}</strong>
          <q>{a.event}</q>
        </li>
      ))}
    </ul>
  );
}
