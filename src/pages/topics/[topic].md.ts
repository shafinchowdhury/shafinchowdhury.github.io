import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import config from "@/config";
import { TOPIC_HUBS } from "@/data/topics";
import { postFilter } from "@/utils/postFilter";

export function getStaticPaths() {
  return Object.keys(TOPIC_HUBS).map(topic => ({
    params: { topic },
  }));
}

export const GET: APIRoute = async ({ params, site }) => {
  const baseUrl = (site?.href ?? config.site.url).replace(/\/+$/, "");
  const topicSlug = params.topic as string;
  const topicData = TOPIC_HUBS[topicSlug];

  if (!topicData) {
    return new Response("Not Found", { status: 404 });
  }

  const posts = await getCollection("posts", postFilter);
  const findPostBySlug = (slug: string) =>
    posts.find(
      p => p.id.replace(/\.(md|mdx)$/, "").toLowerCase() === slug.toLowerCase()
    );

  const lines: string[] = [
    `# ${topicData.title}`,
    "",
    `> ${topicData.description}`,
    "",
    `- Canonical URL: ${baseUrl}/topics/${topicData.slug}/`,
    `- Author: ${config.site.author} (${baseUrl}/about/)`,
    "",
    topicData.intro,
    "",
    "## Curated Learning Path",
    "",
    ...topicData.learningPath.map(step => {
      const stepPost = findPostBySlug(step.postSlug);
      const link = stepPost
        ? `[${step.title}](${baseUrl}/posts/${step.postSlug}/) ([Markdown](${baseUrl}/posts/${step.postSlug}.md))`
        : step.title;
      return `${step.step}. **[${step.level}]** ${link} — ${step.description}`;
    }),
    "",
    "## Articles by Category",
    "",
  ];

  for (const group of topicData.groups) {
    const groupPosts = group.postSlugs
      .map(slug => findPostBySlug(slug))
      .filter(Boolean);
    if (groupPosts.length === 0) continue;

    lines.push(`### ${group.name}`, "", group.description, "");
    for (const post of groupPosts) {
      if (!post) continue;
      const slug = post.id.replace(/\.(md|mdx)$/, "");
      lines.push(
        `- [${post.data.title}](${baseUrl}/posts/${slug}/): ${post.data.description} ([Markdown](${baseUrl}/posts/${slug}.md))`
      );
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
