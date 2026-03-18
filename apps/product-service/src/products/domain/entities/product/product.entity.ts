import {
  createProductSchema,
  productAttributesChangeSchema,
  productBrandSchema,
  productCategorySchema,
  productDescriptionSchema,
  productDimensionsChangeSchema,
  productImagesChangeSchema,
  productNameSchema,
  productPropsSchema,
  productReferenceSchema,
  productSlugSchema,
  productTagSchema,
  productVariationsChangeSchema,
  productWeightSchema,
} from './product.schemas';
import {
  CreateProductProps,
  ProductAttribute,
  ProductDimensions,
  ProductImage,
  ProductProps,
  ProductStatus,
  ProductVariation,
} from './product.types';

export class ProductEntity {
  private props: ProductProps;

  private constructor(props: ProductProps) {
    this.props = props;
  }

  static create(input: CreateProductProps): ProductEntity {
    const parsed = createProductSchema.parse(input);
    const now = new Date();
    const props = productPropsSchema.parse({
      ...parsed,
      slug: parsed.slug ?? ProductEntity.generateSlug(parsed.name),
      createdAt: parsed.createdAt ?? now,
      updatedAt: parsed.updatedAt ?? now,
    });

    ProductEntity.assertPublishRules(props);
    return new ProductEntity(props);
  }

  static reconstitute(props: ProductProps): ProductEntity {
    const parsed = productPropsSchema.parse(props);
    ProductEntity.assertPublishRules(parsed);
    return new ProductEntity(parsed);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get brand(): string {
    return this.props.brand;
  }

  get category(): string {
    return this.props.category;
  }

  get images(): ProductImage[] {
    return [...this.props.images];
  }

  get attributes(): ProductAttribute[] {
    return [...this.props.attributes];
  }

  get variations(): ProductVariation[] {
    return [...this.props.variations];
  }

  get commercialReference(): string {
    return this.props.commercialReference;
  }

  get weightKg(): number {
    return this.props.weightKg;
  }

  get dimensions(): ProductDimensions {
    return { ...this.props.dimensions };
  }

  get status(): ProductStatus {
    return this.props.status;
  }

  get tags(): string[] {
    return [...this.props.tags];
  }

  get slug(): string {
    return this.props.slug;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  rename(name: string): void {
    this.props.name = productNameSchema.parse(name);
    this.props.slug = ProductEntity.generateSlug(this.props.name);
    this.touch();
  }

  changeDescription(description: string): void {
    this.props.description = productDescriptionSchema.parse(description);
    this.touch();
  }

  changeBrand(brand: string): void {
    this.props.brand = productBrandSchema.parse(brand);
    this.touch();
  }

  changeCategory(category: string): void {
    this.props.category = productCategorySchema.parse(category);
    this.touch();
  }

  changeCommercialReference(reference: string): void {
    this.props.commercialReference = productReferenceSchema.parse(reference);
    this.touch();
  }

  changeWeightAndDimensions(
    weightKg: number,
    dimensions: ProductDimensions,
  ): void {
    this.props.weightKg = productWeightSchema.parse(weightKg);
    this.props.dimensions = productDimensionsChangeSchema.parse(dimensions);
    this.touch();
  }

  changeImages(images: ProductImage[]): void {
    this.props.images = productImagesChangeSchema.parse(images);
    ProductEntity.assertPublishRules(this.props);
    this.touch();
  }

  changeAttributes(attributes: ProductAttribute[]): void {
    this.props.attributes = productAttributesChangeSchema.parse(attributes);
    this.touch();
  }

  changeVariations(variations: ProductVariation[]): void {
    this.props.variations = productVariationsChangeSchema.parse(variations);
    ProductEntity.assertPublishRules(this.props);
    this.touch();
  }

  addTag(tag: string): void {
    const normalizedTag = productTagSchema.parse(tag);
    if (!this.props.tags.includes(normalizedTag)) {
      this.props.tags = [...this.props.tags, normalizedTag];
      if (this.props.tags.length > 20) {
        throw new Error('tags cannot exceed 20 items');
      }
      this.touch();
    }
  }

  removeTag(tag: string): void {
    const normalizedTag = productTagSchema.parse(tag);
    this.props.tags = this.props.tags.filter(
      (existing) => existing !== normalizedTag,
    );
    this.touch();
  }

  activate(): void {
    this.props.status = ProductStatus.ACTIVE;
    ProductEntity.assertPublishRules(this.props);
    this.touch();
  }

  deactivate(): void {
    if (this.props.status === ProductStatus.DISCONTINUED) {
      throw new Error('Discontinued product cannot be deactivated');
    }
    this.props.status = ProductStatus.INACTIVE;
    this.touch();
  }

  discontinue(): void {
    this.props.status = ProductStatus.DISCONTINUED;
    this.touch();
  }

  sendToDraft(): void {
    if (this.props.status === ProductStatus.DISCONTINUED) {
      throw new Error('Discontinued product cannot return to draft');
    }
    this.props.status = ProductStatus.DRAFT;
    this.touch();
  }

  toJSON(): ProductProps {
    return {
      ...this.props,
      images: [...this.props.images],
      attributes: [...this.props.attributes],
      variations: [...this.props.variations],
      tags: [...this.props.tags],
      dimensions: { ...this.props.dimensions },
    };
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  private static assertPublishRules(props: ProductProps): void {
    if (props.status !== ProductStatus.ACTIVE) {
      return;
    }

    if (props.images.length === 0) {
      throw new Error('Active product must contain at least one image');
    }

    if (props.commercialReference.length < 3) {
      throw new Error(
        'Active product must contain a valid commercial reference',
      );
    }

    if (props.weightKg <= 0) {
      throw new Error('Active product must have positive weight');
    }
  }

  private static generateSlug(name: string): string {
    return productSlugSchema.parse(name);
  }
}
