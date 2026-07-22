import { z } from "zod";

const keySchema = z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Gunakan huruf kecil, angka, dan tanda hubung.");
const sortOrderSchema = z.number().int().min(0).max(100000);

export const caseStudySectionTypes = ["summary","context","challenge","constraint","responsibility","architecture","approach","decision","tradeoff","coordination","outcome","lesson","confidentiality","custom"] as const;
export const caseStudySectionSchema = z.object({
  projectId: z.uuid(), sectionKey: keySchema, sectionType: z.enum(caseStudySectionTypes),
  title: z.string().trim().min(2).max(180), content: z.string().trim().min(10).max(20000),
  isPublic: z.boolean(), sortOrder: sortOrderSchema,
});

export const projectMetricSchema = z.object({
  projectId: z.uuid(), metricKey: keySchema, label: z.string().trim().min(2).max(100),
  value: z.string().trim().min(1).max(100), context: z.string().trim().max(500),
  isPublic: z.boolean(), sortOrder: sortOrderSchema,
});

const diagramText = z.string().trim().min(1).max(160);
export const diagramNodeSchema = z.object({ id: keySchema, label: diagramText, group: keySchema.optional(), description: z.string().trim().max(500).optional() }).strict();
export const diagramEdgeSchema = z.object({ from: keySchema, to: keySchema, label: z.string().trim().max(160).optional() }).strict();
export const diagramGroupSchema = z.object({ id: keySchema, label: diagramText }).strict();
export const diagramDataSchema = z.object({
  nodes: z.array(diagramNodeSchema).min(1).max(40), edges: z.array(diagramEdgeSchema).max(80), groups: z.array(diagramGroupSchema).max(12),
}).strict().superRefine((data, context) => {
  const nodeIds = new Set(data.nodes.map((node) => node.id));
  const groupIds = new Set(data.groups.map((group) => group.id));
  if (nodeIds.size !== data.nodes.length) context.addIssue({ code: "custom", path: ["nodes"], message: "ID node harus unik." });
  if (groupIds.size !== data.groups.length) context.addIssue({ code: "custom", path: ["groups"], message: "ID group harus unik." });
  data.nodes.forEach((node, index) => { if (node.group && !groupIds.has(node.group)) context.addIssue({ code: "custom", path: ["nodes", index, "group"], message: "Group node tidak ditemukan." }); });
  data.edges.forEach((edge, index) => { if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) context.addIssue({ code: "custom", path: ["edges", index], message: "Edge harus merujuk node yang tersedia." }); });
});

export const projectDiagramSchema = z.object({
  projectId: z.uuid(), diagramKey: keySchema, title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(1000), diagramType: z.enum(["flow","layered","integration","architecture","sequence-summary"]),
  diagramData: diagramDataSchema, textAlternative: z.string().trim().min(20).max(4000),
  isPublic: z.boolean(), sortOrder: sortOrderSchema,
});

export const mentorshipRecordSchema = z.object({
  recordKey: keySchema, title: z.string().trim().min(2).max(180),
  category: z.enum(["candidate-assessment","private-mentorship","intern-development","referral","team-formation","technical-guidance"]),
  summary: z.string().trim().min(20).max(3000), method: z.string().trim().max(3000), outcome: z.string().trim().max(3000),
  isPublic: z.boolean(), sortOrder: sortOrderSchema,
});

export const projectImageMetadataSchema = z.object({
  projectId: z.uuid(), imageUrl: z.url(), altText: z.string().trim().min(5).max(300), caption: z.string().trim().max(1000),
  imageCategory: z.enum(["interface","mobile","architecture","workflow","infrastructure","report","code","documentation","other"]),
  isPublic: z.boolean(), sortOrder: sortOrderSchema,
});

export const reorderSchema = z.object({
  projectId: z.uuid().optional(), items: z.array(z.object({ id: z.uuid(), sortOrder: sortOrderSchema })).min(1).max(200),
});

export const authoritySettingsSchema = z.object({
  professionalName: z.string().trim().min(2).max(120), fullName: z.string().trim().min(2).max(120), title: z.string().trim().min(2).max(160),
  secondaryIdentity: z.string().trim().min(2).max(160), heroHeadline: z.string().trim().min(20).max(300), heroDescription: z.string().trim().min(20).max(1200),
  email: z.union([z.literal(""), z.email()]), location: z.string().trim().min(2).max(160), availability: z.string().trim().min(2).max(300),
  githubUrl: z.union([z.literal(""), z.url()]), linkedinUrl: z.union([z.literal(""), z.url()]), resumeUrl: z.union([z.literal(""), z.url()]),
  builderStatement: z.string().trim().min(20).max(1200), systemsPillar: z.string().trim().min(20).max(1200), peoplePillar: z.string().trim().min(20).max(1200), executionPillar: z.string().trim().min(20).max(1200), recruiterCta: z.string().trim().min(10).max(500),
  incidentTitle: z.string().trim().min(5).max(180), incidentSummary: z.string().trim().min(20).max(2000), incidentMetricLabel: z.string().trim().min(2).max(100), incidentMetricValue: z.string().trim().min(1).max(100), incidentMetricContext: z.string().trim().min(2).max(300),
});

export type CaseStudySectionInput = z.infer<typeof caseStudySectionSchema>;
export type ProjectMetricInput = z.infer<typeof projectMetricSchema>;
export type ProjectDiagramInput = z.infer<typeof projectDiagramSchema>;
export type MentorshipRecordInput = z.infer<typeof mentorshipRecordSchema>;
export type ProjectImageMetadataInput = z.infer<typeof projectImageMetadataSchema>;
export type ReorderInput = z.infer<typeof reorderSchema>;
export type AuthoritySettingsInput = z.infer<typeof authoritySettingsSchema>;
