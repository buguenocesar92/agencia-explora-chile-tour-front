// src/types/TripType.ts
export interface TripPayload {
  id: number;          // ID del viaje
  tour_id: number;       // ID del tour (plantilla) seleccionado
  trip_date_id: number;  // ID de la programación (fecha) seleccionada
  // Puedes agregar otros campos si fueran necesarios (como service_type)
}
