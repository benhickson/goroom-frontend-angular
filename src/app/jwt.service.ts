import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  private anonLoginUrl = `${environment.apiUrl}/users/anon`;
  private loginUrl = `${environment.apiUrl}/users/login`;
  private registerUrl = `${environment.apiUrl}/users`;

  public get loggedIn(): boolean{
    return localStorage.getItem('auth_token') !== null;
  }

  constructor(private httpClient: HttpClient) { }

  loginAnon() {
    return this.httpClient.get<{auth_token: string}>(this.anonLoginUrl).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.auth_token);
      })
    );
  }

  login(email: string, password: string) {
    return this.httpClient.post<{auth_token: string}>(this.loginUrl, {email, password}).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.auth_token);
        console.log('token rxd:', response.auth_token);
      })
    );
  }

  register(email: string, password: string, display_name: string) {
    return this.httpClient.post<{auth_token: string}>(this.registerUrl, {email, password, display_name}).pipe(
      tap(() => {
        this.login(email, password);
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    console.log('logged out');

    // standard redirect to home.... 
    // TODO: do this the angular way, rather than a reload.
    location.href = '/';
  }

}
