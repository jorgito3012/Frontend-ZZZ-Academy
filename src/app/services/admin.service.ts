import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly ADMIN_URL = `${environment.apiUrl}/admin`;

  // SUBIR IMAGEN
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.ADMIN_URL}/upload-image`, formData);
  }

  // CREAR AGENTE
  createAgent(agentData: any): Observable<any> {
    return this.http.post<any>(`${this.ADMIN_URL}/agentes`, agentData);
  }

  // CREAR W-ENGINE
  createWEngine(wengineData: any): Observable<any> {
    return this.http.post<any>(`${this.ADMIN_URL}/wengines`, wengineData);
  }

  // CREAR DISCO
  createDisco(discoData: any): Observable<any> {
    return this.http.post<any>(`${this.ADMIN_URL}/discosets`, discoData);
  }

  // CREAR BANGBOO
  createBangboo(bangbooData: any): Observable<any> {
    return this.http.post<any>(`${this.ADMIN_URL}/bangboos`, bangbooData);
  }
}
