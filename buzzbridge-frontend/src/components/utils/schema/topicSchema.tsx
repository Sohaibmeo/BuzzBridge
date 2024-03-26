import { ZodType, z } from "zod";
import { CreateTopic, UpdateTopic } from "../../../types/TopicTypes";

export const TopicSchema: ZodType<CreateTopic> = z.object({
  title: z
    .string()
    .min(1, "Title must be at least 1 character")
    .max(30, "Title length cannot exceed 30 characters"),
  description: z
    .string()
    .max(350, "Description length cannot exceed 350 characters")
    .optional(),
});

export const UpdateTopicSchema: ZodType<UpdateTopic> = z.object({
  title: z
    .string()
    .min(1, "Title must be at least 1 character")
    .max(30, "Title length cannot exceed 30 characters")
    .optional(),
  description: z
    .string()
    .max(350, "Description length cannot exceed 350 characters")
    .optional(),
});
