// Interfaces genéricas que mapean con nuestros DTOs de Java

export interface JwtResponse {
  token: string;
  id: number;
  email: string;
  rol: string;
}

export interface MessageResponse {
  message?: string;
  error?: string;
}

export interface Usuario {
  id: number;
  email: string;
  rol: string;
}
