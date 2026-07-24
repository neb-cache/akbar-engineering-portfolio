export const publicCacheTags = {
  profile: "public-site-profile",
  projects: "public-projects",
  experiences: "public-experiences",
  skills: "public-skills",
  authority: "public-project-authority",
  mentorship: "public-mentorship",
} as const;

export const PUBLIC_CACHE_REVALIDATE_SECONDS = 60 * 60;
