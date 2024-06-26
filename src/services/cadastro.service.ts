import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  // baseUrlLocal: string = 'http://localhost:3307/api';
  baseUrlLocal: string = 'https://158.69.156.104:3307/api';
  constructor(private http: HttpClient) {
  }
  public createUser(user: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };

    return this.http.post(`${this.baseUrlLocal}/users`, user, options).pipe(take(1));
  };

  public checkCpf(cpf: string): Observable<any> {


    return this.http.post(`${this.baseUrlLocal}/checkCPF`, {cpf}).pipe(take(1));
  };

  public checkEmail(email: string,): Observable<any> {
    return this.http.post(`${this.baseUrlLocal}/checkEmail`, {email}).pipe(take(1));
  }
}

