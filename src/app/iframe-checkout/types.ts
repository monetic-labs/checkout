// Types for iframe-checkout payment flow

export type BillingAddress = {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
};

export type NewCardPayment = {
  method: 'CARD';
  saveCard?: boolean;
  card: {
    holderName: string;
    number: string;
    expiryDate: {
      month: number;
      year: number;
    };
    cvc: string;
  };
  billingAddress: BillingAddress;
}; 