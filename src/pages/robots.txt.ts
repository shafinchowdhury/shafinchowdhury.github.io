import type { APIRoute } from "astro";

const CONTENT_SIGNAL = "Content-Signal: search=yes, ai-input=yes, ai-train=no";

const getRobotsTxt = (sitemapURL: URL) => `# robots.txt for ${sitemapURL.origin}
# RFC 9309 compliant groups with explicit AI search, user-agent, and training policies.

User-agent: *
${CONTENT_SIGNAL}
Allow: /

# AI Search & Citation Crawlers (explicitly allowed for answer engine visibility)
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Googlebot
User-agent: Applebot
${CONTENT_SIGNAL}
Allow: /

# AI Model Training Crawlers & Control Tokens
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
${CONTENT_SIGNAL}
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
