import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private http: HttpClient) {

  };
  public verifyCredentials(credentials: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post('https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api/verifyCredentials', credentials).pipe(take(1));
  };

  public resetPassword(credentials: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post('https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api/resetPassword', credentials).pipe(take(1));
  };
}
