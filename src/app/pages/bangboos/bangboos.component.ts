import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-bangboos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bangboos.component.html',
  styleUrls: ['./bangboos.component.css']
})
export class BangboosComponent implements OnInit {
  private apiService = inject(ApiService);
  
  bangboos: any[] = [];
  filteredBangboos: any[] = [];
  apiUrl = environment.apiUrl.replace('/api', ''); // <--- AÑADE ESTA LÍNEA AQUÍ

  // Filtros activos
  selectedRango: string = 'TODOS';

  ngOnInit() {
    this.apiService.getBangboos().subscribe({
      next: (data) => {
        // Ordenamos por rango (S primero, luego A)
        this.bangboos = data.sort((a, b) => {
          if (a.rango === 'S' && b.rango !== 'S') return -1;
          if (a.rango !== 'S' && b.rango === 'S') return 1;
          return 0;
        });
        this.filteredBangboos = [...this.bangboos];
      },
      error: (err) => console.error('Error fetching bangboos', err)
    });
  }

  filterByRango(rango: string) {
    this.selectedRango = rango;
    if (rango === 'TODOS') {
      this.filteredBangboos = this.bangboos;
    } else {
      this.filteredBangboos = this.bangboos.filter(b => b.rango === rango);
    }
  }
}
