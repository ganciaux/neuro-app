import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthMode } from '../../model/auth.model';
import { AuthFormComponent } from '../shared/auth-form/auth-form.component';
@Component({
  selector: 'app-register-form',
  imports: [AuthFormComponent, RouterLink, RouterModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {
  readonly AuthMode = AuthMode;

  private router = inject(Router);
  private authService = inject(AuthService);
  
  onLogin(credentials: any) {
    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
