import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  private http = inject(HttpClient);
  private readonly ROSTER_URL = `${environment.apiUrl}/users/me/roster`;

  // --- ROSTER (UsuarioAgente) ---
  
  getMyRoster(): Observable<any[]> {
    return this.http.get<any[]>(this.ROSTER_URL);
  }

  addAgentToRoster(agenteId: number): Observable<any> {
    return this.http.post<any>(this.ROSTER_URL, { agenteId });
  }

  updateRosterAgent(rosterId: number, updates: any): Observable<any> {
    return this.http.put<any>(`${this.ROSTER_URL}/${rosterId}`, updates);
  }

  removeAgentFromRoster(rosterId: number): Observable<any> {
    return this.http.delete<any>(`${this.ROSTER_URL}/${rosterId}`);
  }

  // --- BUILDS (UsuarioBuild) ---

  getBuilds(rosterId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.ROSTER_URL}/${rosterId}/builds`);
  }

  addBuild(rosterId: number, buildData: any): Observable<any> {
    return this.http.post<any>(`${this.ROSTER_URL}/${rosterId}/builds`, buildData);
  }

  deleteBuild(rosterId: number, buildId: number): Observable<any> {
    return this.http.delete<any>(`${this.ROSTER_URL}/${rosterId}/builds/${buildId}`);
  }
}
