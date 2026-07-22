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
  image_category: ProjectImageCategory | null;
  is_public: boolean;
  created_at: string;
};
export type ProjectImageCategory = "interface" | "mobile" | "architecture" | "workflow" | "infrastructure" | "report" | "code" | "documentation" | "other";
export type CaseStudySectionType = "summary" | "context" | "challenge" | "constraint" | "responsibility" | "architecture" | "approach" | "decision" | "tradeoff" | "coordination" | "outcome" | "lesson" | "confidentiality" | "custom";
export type ProjectCaseStudySectionRow = ChildRow & {
  project_id: string;
  section_key: string;
  section_type: CaseStudySectionType;
  title: string;
  content: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};
export type ProjectMetricRow = ChildRow & {
  project_id: string;
  metric_key: string;
  label: string;
  value: string;
  context: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};
export type DiagramType = "flow" | "layered" | "integration" | "architecture" | "sequence-summary";
export type ProjectDiagramRow = ChildRow & {
  project_id: string;
  diagram_key: string;
  title: string;
  description: string | null;
  diagram_type: DiagramType;
  diagram_data: Json;
  text_alternative: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};
export type MentorshipCategory = "candidate-assessment" | "private-mentorship" | "intern-development" | "referral" | "team-formation" | "technical-guidance";
export type MentorshipRecordRow = {
  id: string;
  record_key: string;
  title: string;
  category: MentorshipCategory;
  summary: string;
  method: string | null;
  outcome: string | null;
  is_public: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PublicCaseStudySectionRow = Omit<ProjectCaseStudySectionRow, "is_public" | "created_at" | "updated_at">;
export type PublicProjectMetricRow = Omit<ProjectMetricRow, "is_public" | "created_at" | "updated_at">;
export type PublicProjectDiagramRow = Omit<ProjectDiagramRow, "is_public" | "created_at" | "updated_at">;
export type PublicProjectImageRow = Omit<ProjectImageRow, "is_public" | "created_at">;
export type PublicMentorshipRecordRow = Omit<MentorshipRecordRow, "is_public" | "created_at" | "updated_at">;
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
      project_case_study_sections: Table<ProjectCaseStudySectionRow>;
      project_metrics: Table<ProjectMetricRow>;
      project_diagrams: Table<ProjectDiagramRow>;
      mentorship_records: Table<MentorshipRecordRow>;
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
      public_project_case_study_sections: Table<PublicCaseStudySectionRow>;
      public_project_metrics: Table<PublicProjectMetricRow>;
      public_project_diagrams: Table<PublicProjectDiagramRow>;
      public_project_images: Table<PublicProjectImageRow>;
      public_mentorship_records: Table<PublicMentorshipRecordRow>;
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
