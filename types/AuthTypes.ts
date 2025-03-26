// Auth Types
export interface AuthPayload {
  email: string;
  password: string;
}

// Respuesta del login
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

// Alias para semántica, opcional
export type LoginPayload = AuthPayload;

// Registro de usuario: se extiende para incluir información adicional para profesionales.
export type RegisterUser = AuthPayload & { 
  name: string;
};
