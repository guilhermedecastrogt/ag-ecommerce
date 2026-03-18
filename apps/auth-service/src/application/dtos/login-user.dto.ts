import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export class LoginUserDto extends createZodDto(loginUserSchema) {}
