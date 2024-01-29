import { z } from 'zod';

export const createLocationSchema = z.object({
  name: z.string({ required_error: 'Location name is required' }),
});

export type CreateLocationDto = z.infer<typeof createLocationSchema>;
