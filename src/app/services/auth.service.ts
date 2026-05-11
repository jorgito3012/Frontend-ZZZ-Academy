import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JwtResponse, MessageResponse } from '../models/models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly AUTH_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'zzz_token';
  private readonly ROLE_KEY = 'zzz_role';

  // LOGIN
  login(credentials: any): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.AUTH_URL}/login`, credentials).pipe(
      tap(response => {
        this.saveToken(response.token);
        this.saveRole(response.rol);
      })
    );
  }

  // REGISTRO
  register(userData: any): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.AUTH_URL}/register`, userData);
  }

  // RECUPERAR DATOS DEL USUARIO (F5 / Recarga)
  getMe(): Observable<JwtResponse> {
    return this.http.get<JwtResponse>(`${this.AUTH_URL}/me`);
  }

  // LÓGICA DE ALMACENAMIENTO (LocalStorage)
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  saveRole(rol: string): void {
    if(rol) localStorage.setItem(this.ROLE_KEY, rol);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN' || this.getRole() === 'ROLE_ADMIN';
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
