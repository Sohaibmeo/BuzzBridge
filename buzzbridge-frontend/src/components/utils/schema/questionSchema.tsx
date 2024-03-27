import { ZodType, z } from "zod";
import { CreateQuestion, UpdateQuestion } from "../../../types/QuestionTypes";

export const CreateQuestionSchema: ZodType<CreateQuestion> = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Question cannot exceed 400 characteres")
    .regex(
      /^(?:.*\?|what|where|when|why|how|which|who|whose|whom|whomst|whence|whither|whether|can|could|should|would|will|is|are|am|do|does|did|have|has|had|cant|wont|arent|isnt|can't|won't|shall|isn't|aren't|was|were|couldn't|shouldn't|wouldn't|isn't|aren't|doesn't|hasn't|haven't)$/i,
      "Title must include a question word or a question mark"
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
      /^(?:.*\?|what|where|when|why|how|which|who|whose|whom|whomst|whence|whither|whether|can|could|should|would|will|is|are|am|do|does|did|have|has|had|cant|wont|arent|isnt|can't|won't|shall|isn't|aren't|was|were|couldn't|shouldn't|wouldn't|isn't|aren't|doesn't|hasn't|haven't)$/i,
      "Title must include a question word or a question mark"
    )
    .optional(),
  assignedTopics: z
    .array(z.number())
    .min(1, "Please select at least one topic")
    .optional(),
});
