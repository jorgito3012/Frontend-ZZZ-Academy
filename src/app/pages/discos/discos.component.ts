import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-discos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discos.component.html',
  styleUrl: './discos.component.css'
})
export class DiscosComponent implements OnInit {
  private apiService = inject(ApiService);
  
  discos: any[] = [];
  apiUrl = environment.apiUrl.replace('/api', '');

  ngOnInit() {
    this.apiService.getDiscoSets().subscribe({
      next: (data) => {
        this.discos = data;
      },
      error: (err) => console.error('Error fetching discos', err)
    });
  }
}
