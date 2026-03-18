import { z } from 'zod';

import { ProductStatus } from './product.types';

const requiredTextSchema = (field: string) =>
  z
    .string()
    .trim()
    .min(1, { message: `${field} is required` });

const skuSchema = z
  .string()
  .trim()
  .min(1, { message: 'commercialReference is required' })
  .transform((value) => value.toUpperCase().replace(/\s+/g, '-'))
  .refine((value) => /^[A-Z0-9-]{3,64}$/.test(value), {
    message: 'commercialReference must be alphanumeric, 3-64 chars',
  });

const slugSchema = z
  .string()
  .trim()
  .min(1, { message: 'slug is required' })
  .transform((value) =>
    value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, ''),
  )
  .refine((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), {
    message: 'slug must contain only lowercase letters, numbers and hyphens',
  });

const tagSchema = z
  .string()
  .trim()
  .min(1, { message: 'tag is required' })
  .transform((value) => value.toLowerCase().replace(/\s+/g, '-'))
  .refine((value) => /^[a-z0-9-]{2,32}$/.test(value), {
    message: 'tag must be alphanumeric, 2-32 chars',
  });

export const productImageSchema = z.object({
  url: z
    .string()
    .trim()
    .url({ message: 'image.url must be a valid URL' })
    .refine((value) => /^https?:\/\//i.test(value), {
      message: 'image.url must be a valid http or https URL',
    }),
  alt: z.string().trim().min(1).optional(),
  position: z.number().int().nonnegative().optional(),
});

export const productAttributeSchema = z.object({
  name: requiredTextSchema('attribute.name'),
  value: requiredTextSchema('attribute.value'),
});

export const productVariationSchema = z.object({
  sku: skuSchema,
  reference: skuSchema.optional(),
  attributes: z.array(productAttributeSchema),
});

export const productDimensionsSchema = z.object({
  widthCm: z.number().positive(),
  heightCm: z.number().positive(),
  lengthCm: z.number().positive(),
});

export const productStatusSchema = z.nativeEnum(ProductStatus);

const imagesSchema = z.array(productImageSchema).transform((images) => {
  const normalized = images.map((image, index) => ({
    ...image,
    position: image.position ?? index,
  }));

  const urls = new Set<string>();
  for (const image of normalized) {
    if (urls.has(image.url)) {
      throw new Error('images cannot contain duplicate URLs');
    }
    urls.add(image.url);
  }

  return normalized.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
});

const attributesSchema = z
  .array(productAttributeSchema)
  .superRefine((attrs, ctx) => {
    const names = new Set<string>();
    attrs.forEach((attr, index) => {
      const key = attr.name.toLowerCase();
      if (names.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'attributes cannot contain duplicate names',
          path: [index, 'name'],
        });
      }
      names.add(key);
    });
  });

const variationsSchema = z
  .array(productVariationSchema)
  .superRefine((variations, ctx) => {
    const skus = new Set<string>();
    variations.forEach((variation, index) => {
      if (skus.has(variation.sku)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'variations cannot contain duplicate SKUs',
          path: [index, 'sku'],
        });
      }
      skus.add(variation.sku);
    });
  });

const tagsSchema = z
  .array(tagSchema)
  .transform((tags) => [...new Set(tags)])
  .superRefine((tags, ctx) => {
    if (tags.length > 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'tags cannot exceed 20 items',
      });
    }
  });

export const createProductSchema = z.object({
  id: requiredTextSchema('id'),
  name: requiredTextSchema('name').refine(
    (value) => value.length >= 3 && value.length <= 140,
    { message: 'name must be between 3 and 140 characters' },
  ),
  description: requiredTextSchema('description').refine(
    (value) => value.length >= 10 && value.length <= 3000,
    { message: 'description must be between 10 and 3000 characters' },
  ),
  brand: requiredTextSchema('brand'),
  category: requiredTextSchema('category'),
  images: imagesSchema.default([]),
  attributes: attributesSchema.default([]),
  variations: variationsSchema.default([]),
  commercialReference: skuSchema,
  weightKg: z
    .number()
    .positive()
    .transform((value) => Number(value.toFixed(3))),
  dimensions: productDimensionsSchema.transform((dimensions) => ({
    widthCm: Number(dimensions.widthCm.toFixed(2)),
    heightCm: Number(dimensions.heightCm.toFixed(2)),
    lengthCm: Number(dimensions.lengthCm.toFixed(2)),
  })),
  status: productStatusSchema.default(ProductStatus.DRAFT),
  tags: tagsSchema.default([]),
  slug: slugSchema.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const productPropsSchema = createProductSchema.extend({
  images: imagesSchema,
  attributes: attributesSchema,
  variations: variationsSchema,
  status: productStatusSchema,
  tags: tagsSchema,
  slug: slugSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const productNameSchema = createProductSchema.shape.name;
export const productDescriptionSchema = createProductSchema.shape.description;
export const productBrandSchema = createProductSchema.shape.brand;
export const productCategorySchema = createProductSchema.shape.category;
export const productReferenceSchema =
  createProductSchema.shape.commercialReference;
export const productWeightSchema = createProductSchema.shape.weightKg;
export const productDimensionsChangeSchema =
  createProductSchema.shape.dimensions;
export const productImagesChangeSchema = createProductSchema.shape.images;
export const productAttributesChangeSchema =
  createProductSchema.shape.attributes;
export const productVariationsChangeSchema =
  createProductSchema.shape.variations;
export const productTagSchema = tagSchema;
export const productSlugSchema = slugSchema;
