import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  private adminService = inject(AdminService);
  
  // Gestión de pestañas (Tabs)
  activeTab: 'agentes' | 'wengines' | 'discos' | 'bangboos' = 'agentes';

  // --- MODELOS DE DATOS ---
  newAgent = {
    nombre: '',
    rango: 'S',
    elemento: 'FUEGO',
    rol: 'ATACANTE',
    descripcion: '',
    imagenUrl: ''
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

  // Cambiar de Pestaña
  switchTab(tab: 'agentes' | 'wengines' | 'discos' | 'bangboos') {
    this.activeTab = tab;
    this.resetState();
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
    this.adminService.createAgent(this.newAgent).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.showSuccess('¡Agente creado exitosamente!');
        this.newAgent.nombre = '';
        this.newAgent.descripcion = '';
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
