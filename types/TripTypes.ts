// src/types/TripTypes.ts
export interface TourTemplate {
  id: number;
  name: string;
  destination?: string | null;
  description?: string | null;
}

export interface TripPayload {
  id: number;
  tour_template_id: number;
  departure_date: string;
  return_date: string;
  programa?: string | null;
  pdf_file?: File;
  pdf_url?: string;
  tour_template?: TourTemplate;
}
  