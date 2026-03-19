export type CheckoutAddress = {
  zipCode: string;
  street: string;
  number: string;
  city: string;
  state: string;
};

export type CheckoutDraft = {
  email: string;
  document: string;
  shippingAddress: CheckoutAddress;
};
