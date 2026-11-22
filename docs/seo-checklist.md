# SEO checklist for new articles

Works for any topic (C++, Java, Python, DSA, web). The site handles the technical
side automatically; this list covers what only the author can decide.

## What the site does for every post automatically

- `<title>`: `seoTitle` (or `title`), plus " | Shafin Chowdhury" only when it still fits in 60 characters.
- Meta description, self-referencing canonical, `index, follow` robots, sitemap entry.
- Open Graph + Twitter Card tags with a generated 1200×630 preview image (`/posts/<slug>/index.png`).
- JSON-LD: `BlogPosting` (dates, author, word count, tags), `BreadcrumbList`, `WebSite`, `Person`.
- One H1 (the `title`); any `#` heading inside the Markdown is demoted to H2.
- Images from `cdn.shafinchowdhury.dev` are converted to WebP with width/height and lazy-loaded.
- Related Articles: your `related` picks first, then posts from the same topic-hub group, then shared tags.

## Frontmatter

```yaml
---
title: "Stack Using Array in C++: Fixed-Size Implementation, Overflow & Dry Run" # H1, can be long
seoTitle: "Stack Using Array in C++: Push, Pop, Overflow & Dry Run" # optional, <= 60 chars
keyword: "stack using array in C++" # the one phrase this article should rank for
description: "Implement a stack using an array in C++: ..." # 120-160 chars, unique
pubDatetime: 2026-10-30T12:00:00+06:00
modDatetime: 2026-11-22T12:00:00+06:00 # only when the content meaningfully changes
tags: [cpp, data-structures, stack]
related: # optional, 2-4 slugs of genuinely related posts
  - stack-using-vector-in-cpp
  - queue-using-array-in-cpp
---
```

The file name is the URL slug: short, lowercase, hyphenated, keyword first
(`stack-using-array-in-cpp.md`). Never rename a published post without a redirect.

## Before writing

1. **Search intent.** Write down the question the reader typed. Learning a concept, copying working code,
   fixing an error, or comparing options? Shape the article around that.
2. **Keyword.** Pick one primary phrase (what people actually type, e.g. "queue using linked list in C++")
   and 2-4 related questions. Check Google's autocomplete and "People also ask" for real wording.
   Use these as directions, not phrases to repeat.

## While writing

3. **Title and description.** `seoTitle` leads with the keyword and says what the reader gets.
   The description is a promise: what they will learn or be able to do, in plain words.
4. **Answer early.** The first paragraph answers the main question in 2-3 sentences. Details follow.
5. **Headings.** H2 for each main section, H3 inside them. Headings say what the section answers
   ("Why does top start at -1?"), not just "Section 3".
6. **Code.** Every snippet compiles/runs as shown; show the output when it helps.
7. **Internal links.** 3-6 contextual links with descriptive anchor text ("stack using a linked list",
   not "click here"). Link the previous/next post in the series and the topic hub. Then add a link back
   to this post from at least one related older post. Add the post to its group in `src/data/topics.ts`.
8. **Images.** Descriptive file name before uploading (`stack-push-diagram.png`, not `image1.png`).
   Alt text describes what the image shows, as you would to someone who can't see it. No keyword lists.
9. **FAQ.** Only questions readers really ask that the article hasn't already answered.

## Before publishing

10. Run `pnpm build && pnpm seo:check`. Fix every error; read the warnings for your post
    (title/description length, keyword placement, alt text, broken links).
11. After deploy: Search Console → URL Inspection → Request indexing for the new URL. Optionally run
    the [Rich Results Test](https://search.google.com/test/rich-results) on it.
