import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-wengines',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wengines.component.html',
  styleUrl: './wengines.component.css'
})
export class WenginesComponent implements OnInit {
  private apiService = inject(ApiService);
  
  wengines: any[] = [];
  filteredWEngines: any[] = [];
  
  // Filters
  selectedRarity: string | null = null;
  selectedSpecialty: string | null = null;
  
  apiUrl = environment.apiUrl.replace('/api', '');

  ngOnInit() {
    this.apiService.getWEngines().subscribe({
      next: (data) => {
        this.wengines = data;
        this.filteredWEngines = data;
      },
      error: (err) => console.error('Error fetching wengines', err)
    });
  }

  setRarityFilter(rarity: string | null) {
    this.selectedRarity = this.selectedRarity === rarity ? null : rarity;
    this.applyFilters();
  }

  setSpecialtyFilter(specialty: string | null) {
    this.selectedSpecialty = this.selectedSpecialty === specialty ? null : specialty;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredWEngines = this.wengines.filter(w => {
      const matchRarity = this.selectedRarity ? w.rareza === this.selectedRarity : true;
      const matchSpecialty = this.selectedSpecialty ? w.especialidad === this.selectedSpecialty : true;
      return matchRarity && matchSpecialty;
    });
  }
}
