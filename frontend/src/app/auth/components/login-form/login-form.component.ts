import { Component, inject } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthMode } from '../../model/auth.model';
import { AuthFormComponent } from '../shared/auth-form/auth-form.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [RouterLink, 
    CommonModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    ButtonModule, 
    MessageModule, 
    CheckboxModule, 
    RippleModule, 
    FloatLabelModule,
    AuthFormComponent,
    NgTemplateOutlet,
    RouterModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  
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
