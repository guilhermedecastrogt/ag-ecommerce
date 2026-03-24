export class CategoryEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly slug: string,
  ) {}
}
