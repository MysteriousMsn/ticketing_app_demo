import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }).trim().toLowerCase(),
    password: z.string({ required_error: 'Password is required' }),
    roles: z.array(z.number())
  });

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const signupUserSchema = z
  .object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }).trim().toLowerCase(),
    password: z.string({ required_error: 'Password is required' })
  });

export type SignupUserDto = z.infer<typeof signupUserSchema>;