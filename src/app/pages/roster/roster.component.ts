import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RosterService } from '../../services/roster.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

export interface UserDisc {
  setId: number | null;
  mainStat: string;
  level: number;
}

export interface UserBuild {
  nombreBuild: string;
  wEngineId: number | null;
  wEngineNivel: number;
  discos: { [key: number]: UserDisc };
}

@Component({
  selector: 'app-roster',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css']
})
export class RosterComponent implements OnInit {
  private rosterService = inject(RosterService);
  private apiService = inject(ApiService);
  public authService = inject(AuthService);

  myAgents: any[] = [];
  allAgents: any[] = [];
  allWEngines: any[] = [];
  allDiscoSets: any[] = [];
  
  isLoading = true;
  showAddModal = false;
  selectedAgentForBuild: any = null;

  // UI States para Pickers
  activePicker: 'wengine' | 'disc' | null = null;
  activeDiscSlot: number | null = null;

  // Formulario para añadir
  newRosterAgentId: number | null = null;

  // Formulario para editar build
  buildForm: UserBuild = {
    nombreBuild: 'Build Principal',
    wEngineId: null,
    wEngineNivel: 60,
    discos: {}
  };

  // Configuración de estadísticas por slot
  slotStats: { [key: number]: string[] } = {
    1: ['PV'],
    2: ['Ataque'],
    3: ['Defensa'],
    4: ['% Ataque', '% PV', 'Probabilidad de Crítico', 'Daño Crítico', 'Maestría de Anomalía'],
    5: ['% PV', '% Defensa', 'Bono Daño Físico', 'Bono Daño Ígneo', 'Bono Daño Glacial', 'Bono Daño Eléctrico', 'Bono Daño Etéreo'],
    6: ['% Ataque', '% PV', '% Defensa', 'Tasa de Anomalía', 'Impacto', 'Recuperación de Energía']
  };

  ngOnInit(): void {
    this.loadRoster();
    this.loadCatalogData();
  }

  loadRoster(): void {
    this.rosterService.getMyRoster().subscribe({
      next: (data: any[]) => {
        this.myAgents = data;
        this.isLoading = false;
      },
      error: (err: any) => console.error('Error al cargar roster:', err)
    });
  }

  loadCatalogData(): void {
    this.apiService.getAgents().subscribe((data: any[]) => this.allAgents = data);
    this.apiService.getWEngines().subscribe((data: any[]) => this.allWEngines = data);
    this.apiService.getDiscoSets().subscribe((data: any[]) => this.allDiscoSets = data);
  }

  addAgent(): void {
    if (!this.newRosterAgentId) return;
    this.rosterService.addAgentToRoster(this.newRosterAgentId).subscribe({
      next: () => {
        this.loadRoster();
        this.showAddModal = false;
        this.newRosterAgentId = null;
      },
      error: (err: any) => alert(err.error?.message || 'Error al añadir agente')
    });
  }

  removeAgent(id: number): void {
    if (confirm('¿Seguro que quieres eliminar este agente de tu roster?')) {
      this.rosterService.removeAgentFromRoster(id).subscribe(() => this.loadRoster());
    }
  }

  updateAgentData(agent: any): void {
    const updates = {
      nivel: agent.nivel,
      mindscapesDesbloqueados: agent.mindscapesDesbloqueados
    };
    this.rosterService.updateRosterAgent(agent.id, updates).subscribe();
  }

  // --- Lógica de Builds ---
  
  openBuildEditor(agent: any): void {
    this.selectedAgentForBuild = agent;
    
    // Inicializar slots vacíos con stats por defecto
    this.buildForm.discos = {};
    for (let i = 1; i <= 6; i++) {
      this.buildForm.discos[i] = { setId: null, mainStat: this.slotStats[i][0], level: 15 };
    }

    this.rosterService.getBuilds(agent.id).subscribe((builds: any[]) => {
      if (builds && builds.length > 0) {
        const b = builds[0]; 
        this.buildForm.wEngineId = b.wengine ? b.wengine.id : null;
        this.buildForm.wEngineNivel = b.wengineNivel || 60;
        
        // Cargar discos si existen
        if (b.discosEquipados) {
          Object.keys(b.discosEquipados).forEach(slotKey => {
            const slot = parseInt(slotKey);
            const d = b.discosEquipados[slotKey];
            this.buildForm.discos[slot] = {
              setId: d.setId,
              mainStat: d.mainStat,
              level: d.level || 15
            };
          });
        }
      } else {
        this.buildForm.wEngineId = null;
        this.buildForm.wEngineNivel = 60;
      }
    });
  }

  saveBuild(): void {
    if (!this.selectedAgentForBuild) return;
    
    const buildData = {
      nombreBuild: this.buildForm.nombreBuild,
      wEngineId: this.buildForm.wEngineId,
      wEngineNivel: this.buildForm.wEngineNivel,
      discosEquipados: this.buildForm.discos
    };

    this.rosterService.addBuild(this.selectedAgentForBuild.id, buildData).subscribe({
      next: () => {
        this.selectedAgentForBuild = null;
        this.loadRoster();
      },
      error: (err: any) => console.error('Error al guardar build:', err)
    });
  }

  // --- Helpers para Pickers ---
  selectWEngine(w: any) {
    this.buildForm.wEngineId = w.id;
    this.activePicker = null;
  }

  selectDiscSet(set: any) {
    if (this.activeDiscSlot) {
      this.buildForm.discos[this.activeDiscSlot].setId = set.id;
    }
    this.activePicker = null;
    this.activeDiscSlot = null;
  }

  getSetById(id: number | null): any {
    if (!id) return null;
    return this.allDiscoSets.find(s => s.id == id);
  }

  getWEngineById(id: number | null): any {
    if (!id) return null;
    return this.allWEngines.find(w => w.id == id);
  }

  getImageUrl(path: string): string {
    return this.apiService.getImageUrl(path);
  }

  getAvailableAgents(): any[] {
    return this.allAgents.filter(a => !this.myAgents.some(ma => ma.agente.id === a.id));
  }
}
