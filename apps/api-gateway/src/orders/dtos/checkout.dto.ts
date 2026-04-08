import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CheckoutItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
});

const CheckoutSchema = z.object({
  items: z.array(CheckoutItemSchema),
  shippingFee: z.number().optional(),
  discount: z.number().optional(),
  addressSnapshot: z.string().optional(),
});

export class CheckoutItemDto extends createZodDto(CheckoutItemSchema) {}
export class CheckoutDto extends createZodDto(CheckoutSchema) {}

