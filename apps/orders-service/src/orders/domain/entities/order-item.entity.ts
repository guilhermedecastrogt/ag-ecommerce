export class OrderItemEntity {
  constructor(
    public readonly id: number,
    public readonly orderId: number,
    public readonly productId: string,
    public readonly name: string,
    public readonly price: number,
    public readonly quantity: number,
  ) {}

  get lineTotal(): number {
    return this.price * this.quantity;
  }
}
