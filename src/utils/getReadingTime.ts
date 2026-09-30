/**
 * Calculates estimated reading time for a given text or markdown string.
 * Uses an average reading speed of 200 words per minute.
 */
export function getReadingTime(content: string | undefined): string {
  if (!content) return "1 min read";

  // Clean frontmatter if present
  const cleaned = content.replace(/^---[\s\S]*?---/, "");

  // Strip code blocks to avoid inflating word count excessively
  const withoutCode = cleaned.replace(/```[\s\S]*?```/g, "");

  // Strip html tags
  const textOnly = withoutCode.replace(/<[^>]+>/g, " ");

  // Count words
  const words = textOnly.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min read`;
}
