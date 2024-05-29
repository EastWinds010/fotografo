import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  private messageSubject: Subject<Blob> = new Subject<Blob>();

  constructor() {
    this.connect();
  }

  connect() {
    this.socket = new WebSocket('ws://localhost:3000');

    this.socket.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.socket.onerror = (error) => {
      console.log('WebSocket error', error);
    };
  }

  getMessages(): Observable<Blob> {
    return this.messageSubject.asObservable();
  }

  sendMessage(message: string) {
    this.socket.send(message);
  }
}
