export class ProductEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly slug: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly description: string,
    public readonly imageUrl: string,
    public readonly categoryId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
