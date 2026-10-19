import config from "@/config";

export const SITE_URL = config.site.url.replace(/\/+$/, "");
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PERSON_ID = `${SITE_URL}/#person`;

export const AUTHOR_SAME_AS = config.socials
  .filter(s => s.url.startsWith("http"))
  .map(s => s.url);

export function getPersonEntity() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: config.site.author,
    alternateName: "Md. Shafin Mahmud Chowdhury",
    jobTitle: "Software Developer & Computer Science Student",
    description: config.site.description,
    url: `${SITE_URL}/about/`,
    image: `${SITE_URL}/assets/shafin.jpg`,
    affiliation: {
      "@type": "EducationalOrganization",
      name: "North South University",
      url: "https://www.northsouth.edu/",
    },
    sameAs: AUTHOR_SAME_AS,
    knowsAbout: [
      "C++",
      "Python",
      "Java",
      "Object-Oriented Programming",
      "Data Structures and Algorithms",
      "Software Engineering",
      "Discrete Mathematics",
    ],
  };
}

export function getWebsiteEntity() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: config.site.title,
    description: config.site.description,
    inLanguage: config.site.lang ?? "en",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
