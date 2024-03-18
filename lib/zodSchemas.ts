import { z } from "zod";

export const todoSchema = z.array(
  z.object({ value: z.string(), isDone: z.boolean(), cratedAt: z.number() }),
);
