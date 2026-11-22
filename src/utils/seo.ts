import config from "@/config";

export const TITLE_LIMIT = 60;

/** Page <title>: adds the site name only when the result still fits in search results. */
export function getSeoTitle(title: string) {
  const branded = `${title} | ${config.site.title}`;
  return branded.length <= TITLE_LIMIT ? branded : title;
}
