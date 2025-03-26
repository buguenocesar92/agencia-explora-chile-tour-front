// Archivo: types/ReservationTypes.ts

export interface ReservationPayload {
    id: number | string;  // dependiendo de cómo llegue el id
    name: string;
    date: string;         // Por ejemplo, en formato 'YYYY-MM-DD'
    time: string;         // Por ejemplo, 'HH:mm'
    duration?: number;    // opcional, ya que defines un valor por defecto de 60
    email?: string;
    message?: string;
  }
  