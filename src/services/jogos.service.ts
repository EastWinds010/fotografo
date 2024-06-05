import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JogosService {
  baseUrlLocal: string = 'http://localhost:3307/api';
  baseUrl: string = 'https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api';

  constructor(private http: HttpClient) { }

  public listaJogos(): Observable<any> {
    return this.http.get(`${this.baseUrlLocal}/listaJogos`,{}).pipe(take(1));
  };
  public insereJogo(dadosJogo: any): Observable<any> {
    return this.http.post(`${this.baseUrlLocal}/insereJogo`, dadosJogo).pipe(take(1));
  };
  public deletaJogo(id: number): Observable<any> {
    return this.http.put(`${this.baseUrlLocal}/deleteJogo/${id}`,{}).pipe(take(1));
  };
  public atualizaJogo(id:number ,dadosJogo: any): Observable<any> {
    return this.http.put(`${this.baseUrlLocal}/updateJogo/${id}`, dadosJogo).pipe(take(1));
  };
  public listaJogoId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrlLocal}/listaJogos/${id}`).pipe(take(1));
  }

  public alteraStatusJogo(id: number, status: any): Observable<any>{
    return this.http.put(`${this.baseUrlLocal}/alterarStatusJogo/${id}`,status).pipe(take(1));
  }

  public insereJogoDatasIguais(dadosJogo: any): Observable<any> {
    return this.http.post(`${this.baseUrlLocal}/insereJogoDatasIguais`, dadosJogo).pipe(take(1));
  }
  public  listaJogosLocal(id: number): Observable<any> {
    return this.http.get(`${this.baseUrlLocal}/listaJogosLocal/${id}`).pipe(take(1));
  }
  public alterarStatusJogoDatasIguais(statusJogos: any): Observable<any>{
    return this.http.put(`${this.baseUrlLocal}/alterarStatusJogoDatasIguais`,statusJogos).pipe(take(1));
  }

  public vincularFotografo(dados: any): Observable<any>{
    return this.http.post(`${this.baseUrlLocal}/vincularFotografo`,dados).pipe(take(1));
  }
  public abandonarJogo(dadosJogo: any): Observable<any>{
    return this.http.put(`${this.baseUrlLocal}/abandonarJogo`,dadosJogo).pipe(take(1));
  }
}
