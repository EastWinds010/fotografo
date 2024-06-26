import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  // baseUrlLocal: string = 'http://localhost:3307/api';
  baseUrlLocal: string = 'https://158.69.156.104:3307/api';
  constructor(private http: HttpClient) {

  }
  public getUsuarios(token:string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };
    return this.http.get(`${this.baseUrlLocal}/users`,options);
  }
  public deleteUsuario(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };
    return this.http.delete(`${this.baseUrlLocal}/users/${id}`,options);
  }
  public editUsuario(id: number, user:any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };
    return this.http.put(`${this.baseUrlLocal}/users/${id}`, user, options);
  }
  public userId(ids: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };
    return this.http.post(`${this.baseUrlLocal}/usersIds`,ids,options);
  }
}
