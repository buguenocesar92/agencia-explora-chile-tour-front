import type { ClientPayload } from './ClientType';
import type { TripPayload } from './TripType';
import type { PaymentPayload } from './PaymentType';

export interface ReservationPayload {
  client: ClientPayload;
  trip: TripPayload;
  payment: PaymentPayload;
  status: string;
}
