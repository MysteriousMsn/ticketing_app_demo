import { Role } from 'src/enums/roles.enum';
import { z } from 'zod';

export const createUserSchema = z
  .object({
    id: z.string().optional(),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
    roles: z.array(z.number())
  });

export type CreateCatDto = z.infer<typeof createUserSchema>;