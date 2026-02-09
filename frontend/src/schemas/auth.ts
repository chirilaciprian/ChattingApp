import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string().nonempty({ message: 'Username is required' }).min(6, { message: 'Username must be at least 6 characters' }).max(50, { message: 'Username must not exceed 50 characters' }),
  password: z.string().nonempty({ message: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters' }),
});

export const RegisterSchema = z.object({
  username: z.string().nonempty({ message: 'Username is required' }).min(6, { message: 'Username must be at least 6 characters' }).max(50, { message: 'Username must not exceed 50 characters' }),
  email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Invalid email format' }),
  password: z.string().nonempty({ message: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().nonempty({ message: 'Confirm password is required' }),
}).refine((data) => data.password === data.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
