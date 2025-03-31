import type { ClientPayload } from './ClientType';
import type { TripPayload } from './TripType';
import type { PaymentPayload } from './PaymentType';

export interface ReservationPayload {
  id: number;
  client: ClientPayload;
  trip: TripPayload;
  payment: PaymentPayload;
  status: 'not paid' | 'pass' | 'paid';
  date: string;
  description: string;
}
