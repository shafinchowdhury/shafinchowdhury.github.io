import type { APIRoute } from "astro";
import { getEntry } from "astro:content";
import config from "@/config";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site?.href ?? config.site.url).replace(/\/+$/, "");
  const about = await getEntry("pages", "about");

  const md = [
    `# ${about?.data.title ?? `About ${config.site.author}`}`,
    "",
    `> ${about?.data.description ?? config.site.description}`,
    "",
    `- Canonical URL: ${baseUrl}/about/`,
    `- Author: ${config.site.author}`,
    "",
    about?.body?.trim() ?? "",
    "",
  ].join("\n");

  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
