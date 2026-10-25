import { experiences } from "@/lib/experience";

const highlights: Record<string, string> = {
  "Summer 2025":
    ".NET 8 migration with centralized exception handling and New Relic telemetry.",
  "Summer 2024":
    "Pipelines as code: three services moved from GUI configs to YAML.",
  "Summer 2023":
    "Python CLI that automated manual workflows, $38,400 in annual savings.",
};

export default function ExperienceTable() {
  return (
    <table className="table">
      <tbody>
        {experiences.map((exp) => (
          <tr key={exp.time}>
            <th scope="row">{exp.time}</th>
            <td>
              {exp.position} · <a href={exp.companyUrl}>{exp.company}</a>
            </td>
            <td>{highlights[exp.time] ?? exp.bullets[0]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
