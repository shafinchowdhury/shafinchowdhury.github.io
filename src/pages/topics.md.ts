import type { APIRoute } from "astro";
import config from "@/config";
import { TOPIC_HUBS } from "@/data/topics";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site?.href ?? config.site.url).replace(/\/+$/, "");
  const topics = Object.values(TOPIC_HUBS);

  const lines: string[] = [
    `# Topic Hubs & Learning Paths | ${config.site.title}`,
    "",
    "> Explore curated pillar pages and structured learning paths covering C++, Python, Java, Data Structures & Algorithms, and Mathematics.",
    "",
    `- Canonical URL: ${baseUrl}/topics/`,
    "",
  ];

  for (const topic of topics) {
    lines.push(
      `## [${topic.title}](${baseUrl}/topics/${topic.slug}/)`,
      "",
      topic.description,
      "",
      `- Hub URL: ${baseUrl}/topics/${topic.slug}/`,
      `- Markdown URL: ${baseUrl}/topics/${topic.slug}.md`,
      `- Key Sections: ${topic.groups.map(g => g.name).join(", ")}`,
      ""
    );
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
