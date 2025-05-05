import { Component, EventEmitter, inject, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CardModule } from 'primeng/card';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthCredentials, AuthMode } from '../../../model/auth.model';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, CardModule, InputTextModule, ButtonModule, MessageModule, CheckboxModule, RippleModule, FloatLabelModule, NgTemplateOutlet, RouterModule],
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent {
  @Input() mode: AuthMode = AuthMode.LOGIN;
  @Input() navigationTemplate?: TemplateRef<unknown>;
  @Output() submitForm = new EventEmitter<AuthCredentials>();

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submitted = false;

  onSubmit(event: Event) {
    this.submitted = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Login with:', email, password);
      this.submitForm.emit({ email, password } as any);
      /*
      this.authService.login({ email, password } as any).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login failed', err);
        }
      });
      */
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get title(): string {
    switch (this.mode) {
      case AuthMode.LOGIN:
        return 'Connexion';
      case AuthMode.REGISTER:
        return 'Créer un compte';
      case AuthMode.FORGOT_PASSWORD:
        return 'Réinitialisation du mot de passe';
      default:
        return 'Authentification';
    }
  }
}
