import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JogosService {
  // baseUrlLocal: string = 'http://localhost:3307/api';
  baseUrlLocal: string = 'https://158.69.156.104:3307/api';
  constructor(private http: HttpClient) { }

  public listaJogos(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };
    
    return this.http.get(`${this.baseUrlLocal}/listaJogos`, options).pipe(take(1));
  };
  public insereJogo(dadosJogo: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };

    return this.http.post(`${this.baseUrlLocal}/insereJogo`, dadosJogo, options).pipe(take(1));
  };
  public deletaJogo(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };
    return this.http.put(`${this.baseUrlLocal}/deleteJogo/${id}`,{}, options).pipe(take(1));
  };
  public atualizaJogo(id:number ,dadosJogo: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };
    return this.http.put(`${this.baseUrlLocal}/updateJogo/${id}`, dadosJogo, options).pipe(take(1));
  };
  public listaJogoId(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };
    return this.http.get(`${this.baseUrlLocal}/listaJogos/${id}`, options).pipe(take(1));
  }

  public alteraStatusJogo(id: number, status: any, token: string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };

    return this.http.put(`${this.baseUrlLocal}/alterarStatusJogo/${id}`,status, options).pipe(take(1));
  }

  public insereJogoDatasIguais(dadosJogo: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };
    return this.http.post(`${this.baseUrlLocal}/insereJogoDatasIguais`, dadosJogo, options).pipe(take(1));
  }
  public  listaJogosLocal(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };
    return this.http.get(`${this.baseUrlLocal}/listaJogosLocal/${id}`, options).pipe(take(1));
  }
  public alterarStatusJogoDatasIguais(statusJogos: any, token: string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };
    return this.http.put(`${this.baseUrlLocal}/alterarStatusJogoDatasIguais`,statusJogos, options).pipe(take(1));
  }

  public vincularFotografo(dados: any, token: string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };
    return this.http.post(`${this.baseUrlLocal}/vincularFotografo`,dados, options).pipe(take(1));
  }
  public abandonarJogo(dadosJogo: any, token: string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'Bearer '  + token
    });
    
    const options = { headers: headers };
    return this.http.put(`${this.baseUrlLocal}/abandonarJogo`,dadosJogo, options).pipe(take(1));
  }
}
