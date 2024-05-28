import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  baseUrlLocal: string = 'http://localhost:3307/api';
  baseUrl: string = 'https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api';
  constructor(private http: HttpClient) {

  };
  public verifyCredentials(credentials: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrlLocal}/verifyCredentials`, credentials).pipe(take(1));
  };

  public resetPassword(credentials: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrlLocal}/resetPassword`, credentials).pipe(take(1));
  };
}
