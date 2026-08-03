import { z } from "zod";

export const ChatRoleSchema = z.enum(["user", "assistant"]);
export type ChatRole = z.infer<typeof ChatRoleSchema>;

export const ChatMessageSchema = z.object({
  role: ChatRoleSchema,
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

/**
 * Snapshot published by the currently active section — the only source of
 * truth the assistant is allowed to cite numbers from.
 */
export const PageContextSchema = z.object({
  page: z.string(),
  data: z.record(z.string(), z.unknown()),
  updatedAt: z.number(),
});
export type PageContext = z.infer<typeof PageContextSchema>;

export const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  page: z.string(),
  context: z.record(z.string(), z.unknown()).optional(),
  history: z.array(ChatMessageSchema).max(20).optional(),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const ChatResponseSchema = z.object({
  reply: z.string(),
  degraded: z.boolean().optional(),
  /** Messages left today under the per-IP rate limit, so the client can stay in sync with the server's count. */
  remaining: z.number().optional(),
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
