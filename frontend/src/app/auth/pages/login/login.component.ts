import { Component } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-login',
  imports: [LoginFormComponent, CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
