import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  public login(email: any, password: any): Observable<any> {
    return this.http.post('https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api/login',{email, password});
  }
}
