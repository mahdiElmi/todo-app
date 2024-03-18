import { z } from "zod";

export const todoSchema = z.record(
  z.object({
    value: z.string(),
    isDone: z.boolean(),
  }),
);
