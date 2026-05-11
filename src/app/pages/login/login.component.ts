import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  isLoading = false;
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // Éxito: Guardado por el AuthService, redirigimos al inicio
        // Por ahora redirige a / (en el futuro será el Catálogo o el Roster)
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error && err.error.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = 'Credenciales inválidas o servidor inactivo.';
        }
      }
    });
  }
}
