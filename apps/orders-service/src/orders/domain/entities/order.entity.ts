import { OrderItemEntity } from './order-item.entity';
import { OrderStatus } from './order-status.enum';

export class OrderEntity {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly status: OrderStatus,
    public readonly subTotal: number,
    public readonly shippingFee: number,
    public readonly discount: number,
    public readonly total: number,
    public readonly items: OrderItemEntity[],
    public readonly addressSnapshot: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static calculateTotals(
    items: { price: number; quantity: number }[],
    shippingFee: number,
    discount: number,
  ): { subTotal: number; total: number } {
    const subTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const total = Math.max(subTotal + shippingFee - discount, 0);
    return { subTotal, total };
  }

  get isPending(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  get canBeCancelled(): boolean {
    return this.status === OrderStatus.PENDING;
  }
}
