import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  private apiService = inject(ApiService);
  
  agents: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.apiService.getAgents().subscribe({
      next: (data) => {
        this.agents = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando agentes:', err);
        this.isLoading = false;
      }
    });
  }
}
