import { resumeJson } from "@/lib/resume-export";
import { resume } from "@/lib/resume";
import { getAllProjects } from "@/lib/projects";
import { getAllWritings } from "@/lib/writings";

export const dynamic = "force-static";

export function GET() {
  const body = resumeJson({ resume, projects: getAllProjects(), writings: getAllWritings() });
  return new Response(JSON.stringify(body, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
