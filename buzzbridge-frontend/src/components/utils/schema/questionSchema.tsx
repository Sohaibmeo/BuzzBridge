import { ZodType, z } from "zod";
import { CreateQuestion, UpdateQuestion } from "../../../types/QuestionTypes";

export const CreateQuestionSchema: ZodType<CreateQuestion> = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Question cannot exceed 400 characteres")
    .regex(
      /^(?:.*\?|what|where|when|why|how|which|who)/,
      "Title must start with a question word or end with a question mark"
    ),
  assignedTopics: z
    .array(z.number())
    .min(1, "Please select at least one topic"),
});

export const UpdateQuestionSchema: ZodType<UpdateQuestion> = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Question cannot exceed 400 characters")
    .regex(
      /^(?:.*\?|what|where|when|why|how|which|who)/,
      "Title must start with a question word or end with a question mark"
    )
    .optional(),
  assignedTopics: z
    .array(z.number())
    .min(1, "Please select at least one topic")
    .optional(),
})
