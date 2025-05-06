import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthMode } from '../../model/auth.model';
import { filter } from 'rxjs/operators';
@Component({
  standalone: true,
  selector: 'app-auth',
  imports: [CardModule, RouterModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  cardTitle = '';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        const mode = this.route.firstChild?.snapshot.data['mode'] as AuthMode | undefined;
        this.cardTitle = this.getTitleFromMode(mode);
      });
  }

  private getTitleFromMode(mode?: AuthMode): string {
    switch (mode) {
      case AuthMode.LOGIN:
        return 'Connexion';
      case AuthMode.REGISTER:
        return 'Inscription';
      case AuthMode.FORGOT_PASSWORD:
        return 'Mot de passe oublié';
      default:
        return 'Authentification';
    }
  }
}
