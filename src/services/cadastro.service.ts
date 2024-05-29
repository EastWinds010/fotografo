import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  baseUrlLocal: string = 'http://localhost:3307/api';
  baseUrl: string = 'https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api';
  constructor(private http: HttpClient) {
  }
  public createUser(user: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrlLocal}/users`, user).pipe(take(1));
  };

  public checkCpf(cpf: string): Observable<any> {
    return this.http.post(`${this.baseUrlLocal}/checkCPF`, {cpf}).pipe(take(1));
  };

  public checkEmail(email: string): Observable<any> {
    return this.http.post(`${this.baseUrlLocal}/checkEmail`, {email}).pipe(take(1));
  }
}

