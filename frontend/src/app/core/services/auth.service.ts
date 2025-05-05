import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface UserDto {
  email: string;
  password: string;
  username?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: UserDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/login`, credentials, {
      withCredentials: true,
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true,
    });
  }

  register(credentials: UserDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, credentials, {
      withCredentials: true,
    });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, { withCredentials: true });
  }
}
