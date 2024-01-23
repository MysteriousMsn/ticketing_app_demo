// event.dto.ts
import { z } from 'zod';

export const CreateVenueSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
});
export type CreateVenueDto = z.infer<typeof CreateVenueSchema>;

export const UpdateVenueSchema = z.object({
  name: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
});

export type UpdateVenueDto = z.infer<typeof UpdateVenueSchema>;