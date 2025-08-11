import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginSchema = z.infer<typeof loginSchema>;
//# sourceMappingURL=loginSchema.d.ts.map