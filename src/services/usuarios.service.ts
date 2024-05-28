import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  baseUrlLocal: string = 'http://localhost:3300/api';
  baseUrl: string = 'https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api';
  constructor(private http: HttpClient) {

  }
  public getUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrlLocal}/users`);
  }
  public deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrlLocal}/users/${id}`);
  }
  public editUsuario(id: number, nome: any, email: any, password: any): Observable<any> {
    return this.http.put(`${this.baseUrlLocal}/users/${id}`, {nome, email, password});
  }
}
