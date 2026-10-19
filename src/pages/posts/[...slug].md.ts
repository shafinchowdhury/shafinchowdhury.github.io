import type { APIRoute } from "astro";
import { type CollectionEntry, getCollection } from "astro:content";
import config from "@/config";
import { getPostSlug } from "@/utils/getPostPaths";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getReadingTime } from "@/utils/getReadingTime";

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  const sortedPosts = getSortedPosts(posts);

  return sortedPosts.map(post => ({
    params: { slug: getPostSlug(post.id, post.filePath) },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props, site }) => {
  const baseUrl = (site?.href ?? config.site.url).replace(/\/+$/, "");
  const { post } = props as { post: CollectionEntry<"posts"> };
  const slug = getPostSlug(post.id, post.filePath);
  const pubDate = post.data.pubDatetime.toISOString();
  const modDate = post.data.modDatetime
    ? post.data.modDatetime.toISOString()
    : pubDate;
  const readingTime = getReadingTime(post.body);
  const tags = (post.data.tags ?? []).join(", ");

  const md = [
    `# ${post.data.title}`,
    "",
    `> ${post.data.description}`,
    "",
    `- Canonical URL: ${baseUrl}/posts/${slug}/`,
    `- Author: ${post.data.author ?? config.site.author} (${baseUrl}/about/)`,
    `- Published: ${pubDate}`,
    `- Updated: ${modDate}`,
    ...(readingTime ? [`- Reading Time: ${readingTime}`] : []),
    ...(tags ? [`- Tags: ${tags}`] : []),
    "",
    "---",
    "",
    post.body ?? "",
    "",
  ].join("\n");

  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
