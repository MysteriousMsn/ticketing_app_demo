import { z } from 'zod';

export const createLocationSchema = z.object({
  name: z.string({ required_error: 'Location name is required' }),
});

export type CreateLocationDto = z.infer<typeof createLocationSchema>;

export const updateLocationSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  status: z.number({ required_error: 'Status is required' }),
});

export type UpdateLocationDto = z.infer<typeof updateLocationSchema>;
