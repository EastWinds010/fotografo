import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {
  // baseUrlLocal: string = 'http://localhost:3307/api';
  baseUrlLocal: string = 'https://158.69.156.104:3307/api';
  constructor(private http: HttpClient) { }

  public listaParametros(): Observable<any> {
    return this.http.get(`${this.baseUrlLocal}/listaParametros`).pipe(take(1));
  };
  public insereParametro(dadosParametro: any): Observable<any> {
    return this.http.post(`${this.baseUrlLocal}/insereParametros`, dadosParametro).pipe(take(1));
  }
}
