// event.dto.ts
import { z } from 'zod';

export const venueSchema = z.object({
  name: z.string().min(1),
  location: z.number().min(1),
  movies: z.array(z.number()).optional(),
});
export type VenueDto = z.infer<typeof venueSchema>;