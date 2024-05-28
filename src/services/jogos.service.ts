import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JogosService {
  baseUrlLocal: string = 'http://localhost:3300/api';
  baseUrl: string = 'https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api';

  constructor(private http: HttpClient) { }

  public listaJogos(id: any): Observable<any> {
    return this.http.post(`${this.baseUrlLocal}/listaJogos`, id).pipe(take(1));
  };
  public insereJogo(dadosJogo: any): Observable<any> {
    return this.http.post(`${this.baseUrlLocal}/insereJogo`, dadosJogo).pipe(take(1));
  };
  public deletaJogo(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrlLocal}/deleteJogo/${id}`).pipe(take(1));
  };
  public atualizaJogo(id:number ,dadosJogo: any): Observable<any> {
    return this.http.put(`${this.baseUrlLocal}/updateJogo/${id}`, dadosJogo).pipe(take(1));
  };
  public listaJogoId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrlLocal}/jogo/${id}`).pipe(take(1));
  }
}
