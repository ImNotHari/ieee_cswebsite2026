import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Time must be HH:MM or HH:MM:SS"),
  location: z.string().optional(),
  description: z.string().optional(),
}).strict(); // Explicitly reject unknown fields like poster_path
