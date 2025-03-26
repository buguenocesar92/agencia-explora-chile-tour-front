export interface PaymentPayload {
    amount: number;
    payment_date: string;
    transaction_id: string;
    receipt: File | null;
  }
  