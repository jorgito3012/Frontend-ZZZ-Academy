import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-agent-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.css']
})
export class AgentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  public apiService = inject(ApiService);
  
  agentId: number | null = null;
  agent: any = null;
  isLoading = true;

  skillOrder = ['ataque_basico', 'evasion', 'asistencia', 'tecnica_especial', 'tecnica_cadena', 'habilidad_core'];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.agentId = +idParam;
        this.loadAgent(this.agentId);
      }
    });
  }

  loadAgent(id: number): void {
    this.isLoading = true;
    this.apiService.getAgentById(id).subscribe({
      next: (data) => {
        this.agent = data;
        
        // Actualizamos el título de la pestaña
        if (this.agent && this.agent.nombre) {
          this.titleService.setTitle(`ZZZAcademy - ${this.agent.nombre}`);
        }
        
        // Parse JSON strings if needed
        try {
          if (typeof this.agent.estadisticasLvl60 === 'string') {
            this.agent.estadisticasLvl60 = JSON.parse(this.agent.estadisticasLvl60);
          }
          if (typeof this.agent.habilidades === 'string') {
            this.agent.habilidades = JSON.parse(this.agent.habilidades);
          }
          if (typeof this.agent.mindscapes === 'string') {
            this.agent.mindscapes = JSON.parse(this.agent.mindscapes);
          }
        } catch (e) {
          console.error("Error parsing JSON strings from backend", e);
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando agente:', err);
        this.isLoading = false;
      }
    });
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  formatSkillLabel(key: string): string {
    const labels: { [key: string]: string } = {
      'ataque_basico': 'Ataque Básico',
      'evasion': 'Evasión',
      'asistencia': 'Asistencia',
      'tecnica_especial': 'Técnica Especial',
      'tecnica_cadena': 'Cadena',
      'habilidad_core': 'Core'
    };
    return labels[key] || key.replace(/_/g, ' ');
  }

  getSortedKeys(obj: any): string[] {
    if (!obj) return [];
    // Sort keys alphabetically/numerically (works perfectly for "1. ", "2. ", etc.)
    return Object.keys(obj).sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
  }
}
