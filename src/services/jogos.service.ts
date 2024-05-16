import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JogosService {

  constructor(private http: HttpClient) { }

  public listaJogos(): Observable<any> {
    return this.http.get('https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api/listaJogos').pipe(take(1));
  };
  public insereJogo(dadosJogo: any): Observable<any> {
    return this.http.post('https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api/insereJogo', dadosJogo).pipe(take(1));
  };
  public deletaJogo(id: number): Observable<any> {
    return this.http.delete(`https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api/deleteJogo/${id}`).pipe(take(1));
  };
  public atualizaJogo(id:number ,dadosJogo: any): Observable<any> {
    console.log(`https://oracle.garrysmod.com.br/http://51.222.103.202:3306/api/updateJogo/${id}`)
    return this.http.put(`http://localhost:3306/api/updateJogo/${id}`, dadosJogo).pipe(take(1));
  }
}
