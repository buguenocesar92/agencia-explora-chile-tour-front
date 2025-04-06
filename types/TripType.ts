export interface TripPayload {
  id: number;
  tour_id: number;
  trip_date_id: number;
  tour_template?: {
    name: string;
    destination: string;
    description: string;
  };
  departure_date?: string;
  return_date?: string;
}