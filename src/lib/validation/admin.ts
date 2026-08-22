import { z } from "zod";

export const leadWorkflowUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "closed", "spam"]),
  internal_notes: z.string().trim().max(5000).optional(),
}).strict();

export const moderationWorkflowUpdateSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "spam"]),
}).strict();
