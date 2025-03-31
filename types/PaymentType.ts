export interface PaymentPayload {
    id: number;
    amount: number;
    payment_date: string;
    transaction_id: string;
    receipt: File | null;
    receipt_url: string | null;
  }
  