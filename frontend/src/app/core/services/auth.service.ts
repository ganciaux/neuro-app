import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginDto {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth'; // à adapter selon ton backend

  login(credentials: LoginDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/login`, credentials, {
      withCredentials: true,
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true,
    });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, { withCredentials: true });
  }
}
