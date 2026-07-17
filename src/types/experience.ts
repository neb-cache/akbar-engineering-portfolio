import type {
  ExperienceHighlightRow,
  ExperienceRow,
  ExperienceTechnologyRow,
} from "./database";

export type Experience = ExperienceRow & {
  experience_highlights: ExperienceHighlightRow[];
  experience_technologies: ExperienceTechnologyRow[];
};
