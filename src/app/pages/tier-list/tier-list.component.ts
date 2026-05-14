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
  private apiService = inject(ApiService);
  
  agents: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.apiService.getAgents().subscribe({
      next: (data: any[]) => {
        this.agents = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading agents for tier list', err);
        this.isLoading = false;
      }
    });
  }

  getAgentsByTier(tier: string, roleGroup: string): any[] {
    return this.agents.filter(a => {
      const matchesTier = a.tier === tier;
      let matchesRole = false;

      if (roleGroup === 'DPS') {
        matchesRole = a.rol === 'ATACANTE' || a.rol === 'DISRUPTIVO';
      } else if (roleGroup === 'ANOMALO') {
        matchesRole = a.rol === 'ANOMALO';
      } else if (roleGroup === 'SUPPORT') {
        matchesRole = a.rol === 'ATURDIDOR' || a.rol === 'APOYO' || a.rol === 'DEFENSIVO';
      }

      return matchesTier && matchesRole;
    });
  }

  getImageUrl(path: string): string {
    return this.apiService.getImageUrl(path);
  }
}
