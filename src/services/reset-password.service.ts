import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  // baseUrlLocal: string = 'http://localhost:3307/api';
  baseUrlLocal: string = 'https://158.69.156.104:3307/api';
  constructor(private http: HttpClient) {

  };
  public verifyCredentials(credentials: any): Observable<any> {
    console.log(this.baseUrlLocal)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrlLocal}/verifyCredentials`, credentials).pipe(take(1));
  };

  public resetPassword(credentials: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrlLocal}/resetPassword`, credentials).pipe(take(1));
  };
}
