import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css'] // Reutilizamos estilos del login
})
export class RegisterComponent {
  userData = { email: '', password: '' };
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = '¡Cuenta creada! Redirigiendo al login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error && err.error.error) {
          this.errorMessage = err.error.error;
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Error al crear la cuenta. Inténtalo de nuevo.';
        }
      }
    });
  }
}
