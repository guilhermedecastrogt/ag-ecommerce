import { OrderEntity } from './order.entity';

describe('OrderEntity.calculateTotals', () => {
  it('calculates subTotal as sum of price × quantity', () => {
    const items = [{ price: 10, quantity: 2 }];
    const { subTotal } = OrderEntity.calculateTotals(items, 0, 0);
    expect(subTotal).toBe(20);
  });

  it('calculates total = subTotal + shippingFee - discount', () => {
    const items = [{ price: 50, quantity: 1 }];
    const { total } = OrderEntity.calculateTotals(items, 10, 5);
    expect(total).toBe(55);
  });

  it('total is never negative when discount exceeds subTotal + shippingFee', () => {
    const items = [{ price: 10, quantity: 1 }];
    const { total } = OrderEntity.calculateTotals(items, 0, 50);
    expect(total).toBe(0);
  });

  it('works with a single item', () => {
    const items = [{ price: 100, quantity: 1 }];
    const { subTotal, total } = OrderEntity.calculateTotals(items, 0, 0);
    expect(subTotal).toBe(100);
    expect(total).toBe(100);
  });

  it('works with multiple items', () => {
    const items = [
      { price: 20, quantity: 3 },
      { price: 5, quantity: 4 },
    ];
    const { subTotal } = OrderEntity.calculateTotals(items, 0, 0);
    expect(subTotal).toBe(80);
  });

  it('total equals subTotal when shippingFee and discount are both 0', () => {
    const items = [{ price: 30, quantity: 2 }];
    const { subTotal, total } = OrderEntity.calculateTotals(items, 0, 0);
    expect(total).toBe(subTotal);
  });
});
