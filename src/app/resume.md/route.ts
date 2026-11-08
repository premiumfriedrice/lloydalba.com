import { resumeMarkdown } from "@/lib/resume-export";
import { resume } from "@/lib/resume";
import { getAllProjects } from "@/lib/projects";
import { getAllWritings } from "@/lib/writings";

export const dynamic = "force-static";

export function GET() {
  const body = resumeMarkdown({ resume, projects: getAllProjects(), writings: getAllWritings() });
  return new Response(body, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
