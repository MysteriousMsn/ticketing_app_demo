// event.dto.ts
import { z } from 'zod';

export const CreateEventSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  date: z.date({ required_error: 'Date is required' }),
  description: z.string({ required_error: 'Description is required' }),
  venueId: z.number({ required_error: 'Venue ID is required' }),
});
export type CreateEventDto = z.infer<typeof CreateEventSchema>;

export const UpdateEventSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).optional(),
  date: z.date({ required_error: 'Date is required' }).optional(),
  description: z.string({ required_error: 'Description is required' }).optional(),
  venueId: z.number({ required_error: 'Venue ID is required' }).optional(),
});

export type UpdateEventDto = z.infer<typeof UpdateEventSchema>;