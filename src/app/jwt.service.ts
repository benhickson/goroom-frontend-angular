import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  private loginUrl = `${environment.apiUrl}/users/login`;
  private registerUrl = `${environment.apiUrl}/users`;

  public get loggedIn(): boolean{
    return localStorage.getItem('auth_token') !== null;
  }

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string) {
    return this.httpClient.post<{auth_token: string}>(this.loginUrl, {email, password}).pipe(
      tap(res => {
        localStorage.setItem('auth_token', res.auth_token);
      })
    );
  }

  register(email: string, password: string, display_name: string) {
    return this.httpClient.post<{auth_token: string}>(this.registerUrl, {email, password, display_name}).pipe(
      tap(() => {
        this.login(email, password)
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

}
