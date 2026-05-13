import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-tier-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tier-list.component.html',
  styleUrls: ['./tier-list.component.css']
})
export class TierListComponent implements OnInit {
  public apiService = inject(ApiService);
  
  agents: any[] = [];
  
  // Categorías
  atacantes: any[] = [];
  anomalos: any[] = [];
  utilidad: any[] = [];

  isLoading = true;

  // Los niveles de tier que queremos mostrar
  tiers = ['SS', 'S', 'A', 'B'];

  ngOnInit(): void {
    this.apiService.getAgents().subscribe({
      next: (data) => {
        this.agents = data;
        this.distributeAgents();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando agentes:', err);
        this.isLoading = false;
      }
    });
  }

  distributeAgents(): void {
    // Grupo 1: Atacantes y Disruptivos
    this.atacantes = this.agents.filter(a => a.rol === 'ATACANTE' || a.rol === 'DISRUPTIVO');
    
    // Grupo 2: Anómalos
    this.anomalos = this.agents.filter(a => a.rol === 'ANOMALO');
    
    // Grupo 3: Utilidad (Aturdidores, Apoyos y Defensores)
    this.utilidad = this.agents.filter(a => a.rol === 'ATURDIDOR' || a.rol === 'APOYO' || a.rol === 'DEFENSIVO');
  }

  getAgentsByTier(list: any[], tier: string): any[] {
    return list.filter(a => a.tier === tier);
  }
}
