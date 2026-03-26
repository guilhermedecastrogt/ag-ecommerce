import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const RegisterUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class RegisterUserDto extends createZodDto(RegisterUserSchema) {}
