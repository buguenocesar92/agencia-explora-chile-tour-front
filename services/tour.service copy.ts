import axios from 'axios';
import { API_URL } from '@/config/constants';

/**
 * Servicio para manejar las operaciones relacionadas con tours
 */
export class TourService {
  /**
   * Obtiene todos los tours disponibles
   * @returns Promise con la lista de tours
   */
  static async getAllTours() {
    try {
      console.log('Obteniendo tours desde:', `${API_URL}/tours`);
      const response = await axios.get(`${API_URL}/tours`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener tours:', error);
      return [];
    }
  }

  /**
   * Obtiene las fechas disponibles para un tour específico
   * @param tourId ID del tour
   * @returns Promise con la lista de fechas disponibles
   */
  static async getTourDates(tourId: string) {
    try {
      console.log('Obteniendo fechas desde:', `${API_URL}/tours/${tourId}/dates`);
      const response = await axios.get(`${API_URL}/tours/${tourId}/dates`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener fechas para el tour ${tourId}:`, error);
      return [];
    }
  }

  /**
   * Obtiene detalles de un tour específico
   * @param tourId ID del tour
   * @returns Promise con los detalles del tour
   */
  static async getTourById(tourId: string) {
    try {
      console.log('Obteniendo detalles desde:', `${API_URL}/tours/${tourId}`);
      const response = await axios.get(`${API_URL}/tours/${tourId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener detalles del tour ${tourId}:`, error);
      return null;
    }
  }
} 