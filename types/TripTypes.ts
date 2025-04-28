// src/types/TripTypes.ts
export interface TripPayload {
    id: number;
    tour_template_id: number;
    departure_date: string;
    return_date: string;
    pdf_file?: File;
    pdf_url?: string;
  }
  