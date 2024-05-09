import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  constructor(private http: HttpClient) {
  }
  public createUser(user: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post('https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api/users', user).pipe(take(1));
  };

  public checkCpf(cpf: string): Observable<any> {
    return this.http.post('https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api/checkCPF', {cpf}).pipe(take(1));
  };

  public checkEmail(email: string): Observable<any> {
    return this.http.post('https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api/checkEmail', {email}).pipe(take(1));
  }
}

