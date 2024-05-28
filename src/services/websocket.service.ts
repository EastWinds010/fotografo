import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any>;
  constructor() {
    console.log("WebSocket connection initiated");
    this.socket$ = webSocket('ws://localhost:3000');
  }
  public getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }
}
