import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  private adminService = inject(AdminService);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  currentUserId: number | null = null;
  
  // Listas para selectores
  agents: any[] = [];
  wEngines: any[] = [];
  discoSets: any[] = [];
  
  selectedAgentId: number | string = '';
  activeTab: 'agentes' | 'wengines' | 'discos' | 'bangboos' | 'usuarios' = 'agentes';

  skillOrder = ['ataque_basico', 'evasion', 'asistencia', 'tecnica_especial', 'tecnica_cadena', 'habilidad_core'];

  // --- MODELO DE AGENTE COMPLETO ---
  newAgent: any = {
    nombre: '',
    rango: 'S',
    elemento: 'FUEGO',
    rol: 'ATACANTE',
    tier: 'S',
    descripcion: '',
    imagenUrl: '',
    estadisticasLvl60: this.getEmptyStats(),
    habilidades: this.getEmptySkills(),
    mindscapes: this.getEmptyMindscapes(),
    wengineRecomendado: null,
    discoRecomendado4pc: null,
    discoRecomendado2pc: null
  };

  newWEngine = {
    nombre: '',
    rareza: 'S',
    especialidad: 'ATACANTE',
    descripcion: '',
    statPrincipal: '',
    ataqueBase: 0,
    imagenUrl: ''
  };

  newDisco = {
    nombre: '',
    efecto2pc: '',
    efecto4pc: '',
    imagenUrl: ''
  };

  newBangboo = {
    nombre: '',
    rango: 'S',
    habilidades: {
      activa: { nombre: '', descripcion: '' },
      adicional: { nombre: '', descripcion: '' },
      cadena: { nombre: '', descripcion: '' }
    },
    imagenUrl: ''
  };

  // --- ESTADO GLOBAL ---
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  
  isUploading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  // Gestión de Usuarios
  users: any[] = [];

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUserId();
    this.loadInitialData();
  }

  loadInitialData() {
    this.apiService.getAgents().subscribe(data => this.agents = data);
    this.apiService.getWEngines().subscribe(data => this.wEngines = data);
    this.apiService.getDiscoSets().subscribe(data => this.discoSets = data);
  }

  // --- LÓGICA DE FORMULARIO DE AGENTES ---
  
  onAgentSelected() {
    if (this.selectedAgentId === '') {
      this.resetAgentForm();
      return;
    }
    const agent = this.agents.find(a => a.id == this.selectedAgentId);
    if (agent) {
      // Clonamos para evitar modificar la lista original directamente
      this.newAgent = JSON.parse(JSON.stringify(agent));
      
      // Mapeamos objetos de relación a IDs para los selectores
      if (this.newAgent.wengineRecomendado) this.newAgent.wengineRecomendado = this.newAgent.wengineRecomendado.id;
      if (this.newAgent.discoRecomendado4pc) this.newAgent.discoRecomendado4pc = this.newAgent.discoRecomendado4pc.id;
      if (this.newAgent.discoRecomendado2pc) this.newAgent.discoRecomendado2pc = this.newAgent.discoRecomendado2pc.id;

      // Aseguramos que las estructuras existan
      if (!this.newAgent.estadisticasLvl60) this.newAgent.estadisticasLvl60 = this.getEmptyStats();
      if (!this.newAgent.habilidades) this.newAgent.habilidades = this.getEmptySkills();
      if (!this.newAgent.mindscapes) this.newAgent.mindscapes = this.getEmptyMindscapes();
    }
  }

  resetAgentForm() {
    this.selectedAgentId = '';
    this.newAgent = {
      nombre: '',
      rango: 'S',
      elemento: 'FUEGO',
      rol: 'ATACANTE',
      tier: 'S',
      descripcion: '',
      imagenUrl: '',
      estadisticasLvl60: this.getEmptyStats(),
      habilidades: this.getEmptySkills(),
      mindscapes: this.getEmptyMindscapes(),
      wengineRecomendado: null,
      discoRecomendado4pc: null,
      discoRecomendado2pc: null
    };
    this.imagePreview = null;
    this.selectedFile = null;
  }

  getEmptyStats() {
    return {
      'PV': null, 'Ataque': null, 'Defensa': null, 'Impacto': null,
      'Probabilidad de Crítico': 5, 'Daño Crítico': 50,
      'Tasa de Anomalía': null, 'Maestría de Anomalía': null,
      'Tasa de Perforación': null, 'Recuperación de Energía': 1.2
    };
  }

  getEmptySkills() {
    return {
      ataque_basico: [{ nombre: '', descripcion: '' }],
      evasion: [{ nombre: '', descripcion: '' }],
      asistencia: [{ nombre: '', descripcion: '' }],
      tecnica_especial: [{ nombre: '', descripcion: '' }],
      tecnica_cadena: [{ nombre: '', descripcion: '' }],
      habilidad_core: [{ nombre: '', descripcion: '' }]
    };
  }

  getEmptyMindscapes() {
    return { '1': '', '2': '', '3': '', '4': '', '5': '', '6': '' };
  }

  addSubSkill(category: string) {
    this.newAgent.habilidades[category].push({ nombre: '', descripcion: '' });
  }

  removeSubSkill(category: string, index: number) {
    if (this.newAgent.habilidades[category].length > 1) {
      this.newAgent.habilidades[category].splice(index, 1);
    }
  }

  objectKeys(obj: any) {
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

  // Cambiar de Pestaña
  switchTab(tab: 'agentes' | 'wengines' | 'discos' | 'bangboos' | 'usuarios') {
    this.activeTab = tab;
    this.resetState();
    if (tab === 'usuarios') {
      this.loadUsers();
    }
  }

  loadUsers() {
    this.adminService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => this.errorMessage = 'No se pudieron cargar los usuarios.'
    });
  }

  toggleAdmin(user: any) {
    if (user.id === this.currentUserId) {
      this.errorMessage = 'No puedes cambiar tu propio rol de administrador.';
      return;
    }
    const newRole = user.rol === 'ADMIN' ? 'USER' : 'ADMIN';
    this.adminService.updateUserRole(user.id, newRole).subscribe({
      next: (updatedUser) => {
        user.rol = updatedUser.rol;
        this.successMessage = `Rol de ${user.email} actualizado a ${newRole}`;
      },
      error: (err) => this.errorMessage = 'Error al cambiar el rol.'
    });
  }

  deleteUserAccount(userId: number) {
    if (userId === this.currentUserId) {
      this.errorMessage = 'No puedes eliminar tu propia cuenta de administrador.';
      return;
    }
    if (confirm('¿Estás seguro de que quieres borrar esta cuenta? Esta acción no se puede deshacer.')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== userId);
          this.successMessage = 'Usuario eliminado correctamente.';
        },
        error: (err) => this.errorMessage = 'Error al eliminar el usuario.'
      });
    }
  }

  // Previsualizar Imagen
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  // Enviar el formulario actual
  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.selectedFile) {
      this.isUploading = true;
      this.adminService.uploadImage(this.selectedFile).subscribe({
        next: (res) => {
          this.isUploading = false;
          // Guardar en la entidad correspondiente según la pestaña activa
          if (this.activeTab === 'agentes') {
            this.newAgent.imagenUrl = '/uploads/' + res.fileName;
            this.saveAgent();
          } else if (this.activeTab === 'wengines') {
            this.newWEngine.imagenUrl = '/uploads/' + res.fileName;
            this.saveWEngine();
          } else if (this.activeTab === 'discos') {
            this.newDisco.imagenUrl = '/uploads/' + res.fileName;
            this.saveDisco();
          } else if (this.activeTab === 'bangboos') {
            this.newBangboo.imagenUrl = '/uploads/' + res.fileName;
            this.saveBangboo();
          }
        },
        error: (err) => {
          this.isUploading = false;
          this.errorMessage = 'Error al subir la imagen al servidor.';
        }
      });
    } else {
      // Si no hay archivo
      if (this.activeTab === 'agentes') this.saveAgent();
      else if (this.activeTab === 'wengines') this.saveWEngine();
      else if (this.activeTab === 'discos') this.saveDisco();
      else if (this.activeTab === 'bangboos') this.saveBangboo();
    }
  }

  // --- MÉTODOS DE GUARDADO ESPECÍFICOS ---

  saveAgent() {
    this.isSaving = true;
    
    // Si wengineRecomendado es un ID, lo convertimos a objeto para JPA
    const agentToSave = JSON.parse(JSON.stringify(this.newAgent));
    if (agentToSave.wengineRecomendado && typeof agentToSave.wengineRecomendado === 'number') {
      agentToSave.wengineRecomendado = { id: agentToSave.wengineRecomendado };
    }
    if (agentToSave.discoRecomendado4pc && typeof agentToSave.discoRecomendado4pc === 'number') {
      agentToSave.discoRecomendado4pc = { id: agentToSave.discoRecomendado4pc };
    }
    if (agentToSave.discoRecomendado2pc && typeof agentToSave.discoRecomendado2pc === 'number') {
      agentToSave.discoRecomendado2pc = { id: agentToSave.discoRecomendado2pc };
    }

    const request = agentToSave.id 
      ? this.adminService.updateAgent(agentToSave.id, agentToSave)
      : this.adminService.createAgent(agentToSave);

    request.subscribe({
      next: (res) => {
        this.isSaving = false;
        this.showSuccess(agentToSave.id ? '¡Agente actualizado!' : '¡Agente creado!');
        this.loadInitialData(); // Recargar lista
        if (!agentToSave.id) this.resetAgentForm();
      },
      error: (err) => this.showError()
    });
  }

  saveWEngine() {
    this.isSaving = true;
    this.adminService.createWEngine(this.newWEngine).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.showSuccess('¡W-Engine creado exitosamente!');
        this.newWEngine.nombre = '';
        this.newWEngine.descripcion = '';
        this.newWEngine.statPrincipal = '';
        this.newWEngine.ataqueBase = 0;
      },
      error: (err) => this.showError()
    });
  }

  saveDisco() {
    this.isSaving = true;
    this.adminService.createDisco(this.newDisco).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.showSuccess('¡Set de Disco creado exitosamente!');
        this.newDisco.nombre = '';
        this.newDisco.efecto2pc = '';
        this.newDisco.efecto4pc = '';
      },
      error: (err) => this.showError()
    });
  }

  saveBangboo() {
    this.isSaving = true;
    this.adminService.createBangboo(this.newBangboo).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.showSuccess('¡Bangboo creado exitosamente!');
        this.newBangboo.nombre = '';
        this.newBangboo.habilidades.activa.nombre = '';
        this.newBangboo.habilidades.activa.descripcion = '';
        this.newBangboo.habilidades.adicional.nombre = '';
        this.newBangboo.habilidades.adicional.descripcion = '';
        this.newBangboo.habilidades.cadena.nombre = '';
        this.newBangboo.habilidades.cadena.descripcion = '';
      },
      error: (err) => this.showError()
    });
  }

  // Helpers
  showSuccess(msg: string) {
    this.successMessage = msg;
    this.selectedFile = null;
    this.imagePreview = null;
  }

  showError() {
    this.isSaving = false;
    this.errorMessage = 'Error al insertar en la Base de Datos.';
  }

  resetState() {
    this.successMessage = '';
    this.errorMessage = '';
    this.selectedFile = null;
    this.imagePreview = null;
  }
}
