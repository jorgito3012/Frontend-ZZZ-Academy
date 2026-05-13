import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  public apiService = inject(ApiService);
  
  agents: any[] = [];
  filteredAgents: any[] = [];
  isLoading = true;

  // Filtros
  searchTerm: string = '';
  selectedElement: string = '';
  selectedRole: string = '';
  selectedRango: string = '';

  // Opciones de filtros
  elementos = ['FUEGO', 'HIELO', 'FISICO', 'ELECTRICO', 'ETER', 'HOJA_AFILADA', 'TINTA_AURICA', 'GELIDO'];
  roles = ['ATACANTE', 'ATURDIDOR', 'DISRUPTIVO', 'ANOMALO', 'APOYO', 'DEFENSIVO'];
  rangos = ['S', 'A'];

  ngOnInit(): void {
    this.apiService.getAgents().subscribe({
      next: (data) => {
        this.agents = data;
        this.filteredAgents = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando agentes:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredAgents = this.agents.filter(agent => {
      const matchName = agent.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchElement = this.selectedElement ? agent.elemento === this.selectedElement : true;
      const matchRole = this.selectedRole ? agent.rol === this.selectedRole : true;
      const matchRango = this.selectedRango ? agent.rango === this.selectedRango : true;
      
      return matchName && matchElement && matchRole && matchRango;
    });
  }
}
