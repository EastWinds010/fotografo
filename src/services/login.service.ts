import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrlLocal: string = 'http://localhost:3307/api';
  baseUrl: string = 'https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api';
  constructor(private http: HttpClient) { }

  public login(email: any, password: any): Observable<any> {
    return this.http.post(`${this.baseUrlLocal}/login`,{email, password});
  }
}
