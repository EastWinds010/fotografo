import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // baseUrlLocal: string = 'http://localhost:3307/api';
  baseUrlLocal: string = 'https://158.69.156.104:3307/api';
  constructor(private http: HttpClient) { }

  public login(email: any, password: any): Observable<any> {
    return this.http.post(`${this.baseUrlLocal}/login`,{email, password}).pipe(take(1));
  }

  public token(token: any): Observable<any>{
    return this.http.post(`${this.baseUrlLocal}/token`, token).pipe(take(1))
  }
}
