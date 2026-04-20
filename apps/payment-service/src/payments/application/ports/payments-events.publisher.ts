export interface PaymentsEventsPublisher {
  publishPaymentInitiated(data: {
    paymentId: number;
    orderId: number;
    method: string;
    amount: number;
  }): Promise<void>;

  publishPaymentApproved(data: {
    orderId: number;
    externalId: string;
    paidAt: string;
  }): Promise<void>;

  publishPaymentFailed(data: {
    orderId: number;
    reason: string;
  }): Promise<void>;
}
