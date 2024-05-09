import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) {

  }
  public getUsuarios(): Observable<any> {
    return this.http.get('https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api/users');
  }
  public deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api/users/${id}`);
  }
  public editUsuario(id: number, nome: any, email: any, password: any): Observable<any> {
    return this.http.put(`https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api/users/${id}`, {nome, email, password});
  }
}
