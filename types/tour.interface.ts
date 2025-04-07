/**
 * Interfaz para Tour
 */
export interface ITour {
  id: number;
  name: string;
  description?: string;
  destination?: string;
  price?: number;
  duration?: number;
  difficulty?: string;
  capacity?: number;
  included?: string[];
  not_included?: string[];
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Interfaz para fecha de tour
 */
export interface ITourDate {
  id: number;
  tour_id: number;
  departure_date: string;
  arrival_date?: string;
  return_date?: string;
  price?: number;
  available_spots?: number;
  status?: 'available' | 'full' | 'canceled';
  created_at?: string;
  updated_at?: string;
}

/**
 * Interfaz para reserva de viaje
 */
export interface ITrip {
  tourId: number | null;
  dateId: number | null;
  trip_date_id?: number | null;
  departureDate?: string;
  arrivalDate?: string;
  clientCount?: number;
  totalPrice?: number;
}

/**
 * Tipo para opciones de selección en formato nuevo
 */
export interface SelectOption {
  text: string;
  value: string;
}

/**
 * Tipo para opciones de selección en formato antiguo
 */
export interface LegacyOption {
  id: number;
  name: string;
}

/**
 * Tipo unión para cualquier formato de opción
 */
export type AnySelectOption = SelectOption | LegacyOption; 