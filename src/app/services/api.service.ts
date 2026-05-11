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
