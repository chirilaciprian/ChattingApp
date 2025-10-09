import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Invalid email format' }),
  password: z.string().nonempty({ message: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters' }),
});

export const RegisterSchema = z.object({
  username: z.string().nonempty({ message: 'Username is required' }).min(3, { message: 'Username must be at least 3 characters' }).max(20, { message: 'Username must not exceed 20 characters' }).regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),
  email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Invalid email format' }),
  password: z.string().nonempty({ message: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().nonempty({ message: 'Confirm password is required' }),
}).refine((data) => data.password === data.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
