import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://shafinchowdhury.github.io/",
    title: "Shafin Chowdhury",
    description:
      "Blog and portfolio of Shafin Chowdhury — CSE student writing about code, learning, and projects.",
    author: "Shafin Chowdhury",
    profile: "https://github.com/shafinchowdhury",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Asia/Bangkok",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/satnaing/astro-paper/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/shafinchowdhury", linkTitle: "Shafin on GitHub" },
    { name: "linkedin", url: "https://www.linkedin.com/in/md-shafin-mahmud-chowdhury-11b732316/", linkTitle: "Shafin on LinkedIn" },
    { name: "mail",     url: "mailto:shafinchowdhury2003@gmail.com", linkTitle: "Email Shafin" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});