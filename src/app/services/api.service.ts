import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly PUBLIC_URL = `${environment.apiUrl}/public`;

  // === RUTAS PÚBLICAS ===
  getAgents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.PUBLIC_URL}/agents`);
  }

  getAgentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.PUBLIC_URL}/agents/${id}`);
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    // Si la ruta ya incluye http, la devolvemos tal cual
    if (path.startsWith('http')) return path;
    
    // Asumimos que environment.apiUrl es 'http://localhost:8080/api'
    // Extraemos la URL base (http://localhost:8080)
    const baseUrl = environment.apiUrl.replace('/api', '');
    
    // Aseguramos que path empiece con barra para adjuntarlo a baseUrl
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${baseUrl}${normalizedPath}`;
  }

  getWEngines(): Observable<any[]> {
    return this.http.get<any[]>(`${this.PUBLIC_URL}/wengines`);
  }

  getBangboos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.PUBLIC_URL}/bangboos`);
  }

  getDiscoSets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.PUBLIC_URL}/discosets`);
  }
}
