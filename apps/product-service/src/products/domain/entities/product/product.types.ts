export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED',
}

export type ProductImage = {
  url: string;
  alt?: string;
  position?: number;
};

export type ProductAttribute = {
  name: string;
  value: string;
};

export type ProductVariation = {
  sku: string;
  reference?: string;
  attributes: ProductAttribute[];
};

export type ProductDimensions = {
  widthCm: number;
  heightCm: number;
  lengthCm: number;
};

export type CreateProductProps = {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  images?: ProductImage[];
  attributes?: ProductAttribute[];
  variations?: ProductVariation[];
  commercialReference: string;
  weightKg: number;
  dimensions: ProductDimensions;
  status?: ProductStatus;
  tags?: string[];
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ProductProps = {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  images: ProductImage[];
  attributes: ProductAttribute[];
  variations: ProductVariation[];
  commercialReference: string;
  weightKg: number;
  dimensions: ProductDimensions;
  status: ProductStatus;
  tags: string[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};
