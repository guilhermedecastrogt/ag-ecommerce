export class OrderEntity {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly total: number,
    public readonly createdAt: Date,
  ) {}
}
