export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Table<Row, Insert = Partial<Row>, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "admin";
  created_at: string;
  updated_at: string;
};

export type ProjectStatus = "draft" | "published" | "archived";
export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  role: string | null;
  company: string | null;
  client_name: string | null;
  project_type: string | null;
  status: ProjectStatus;
  year_start: number | null;
  year_end: number | null;
  featured: boolean;
  confidential: boolean;
  cover_image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  case_study_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PublicProjectRow = Omit<ProjectRow, "description"> & {
  description: string | null;
};

export type ExperienceRow = {
  id: string;
  company: string;
  title: string;
  employment_type: string | null;
  location: string | null;
  work_mode: "remote" | "hybrid" | "on-site" | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  summary: string | null;
  company_url: string | null;
  company_logo_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SkillRow = {
  id: string;
  name: string;
  category: string;
  proficiency: number | null;
  years_experience: number | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ContactMessageStatus = "new" | "read" | "replied" | "archived";
export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  source: string;
  created_at: string;
  updated_at: string;
};

type ChildRow = { id: string; sort_order: number };
export type ProjectTechnologyRow = ChildRow & {
  project_id: string;
  name: string;
  category: string | null;
};
export type ProjectHighlightRow = ChildRow & { project_id: string; content: string };
export type ProjectImageRow = ChildRow & {
  project_id: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  created_at: string;
};
export type ExperienceHighlightRow = ChildRow & {
  experience_id: string;
  content: string;
};
export type ExperienceTechnologyRow = ChildRow & {
  experience_id: string;
  name: string;
};
export type SiteSettingRow = {
  id: string;
  key: string;
  value: Json;
  created_at: string;
  updated_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: Table<ProfileRow>;
      projects: Table<ProjectRow>;
      project_technologies: Table<ProjectTechnologyRow>;
      project_highlights: Table<ProjectHighlightRow>;
      project_images: Table<ProjectImageRow>;
      experiences: Table<ExperienceRow>;
      experience_highlights: Table<ExperienceHighlightRow>;
      experience_technologies: Table<ExperienceTechnologyRow>;
      skills: Table<SkillRow>;
      contact_messages: Table<ContactMessageRow>;
      site_settings: Table<SiteSettingRow>;
    };
    Views: {
      public_projects: {
        Row: PublicProjectRow;
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
