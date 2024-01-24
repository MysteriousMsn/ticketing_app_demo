// event.dto.ts
import { VenueEntity } from 'src/entity/venue.entity';
import { z } from 'zod';

export const MovieSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  releaseDate: z.string(),
  venues: z.array(z.number())
});
export type MovieDto = z.infer<typeof MovieSchema>;