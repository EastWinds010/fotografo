import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { JogosService } from '../../services/jogos.service';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../../services/websocket.service';


@Component({
  selector: 'app-tabela-jogos',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, RatingModule, TagModule, CheckboxModule, FormsModule, DialogModule],
  templateUrl: './tabela-jogos.component.html',
  styleUrl: './tabela-jogos.component.css'
})


/*
Lógica para que o fotografo possa se candidatar a um jogo e visualizar o jogo
Faz request para a API para pegar a lista de jogos
Caso o jogo esteja com a trava true, o jogo deve ficar "bloqueado" na visualização do fotografo
Caso o fotografo clique no botão de se candidatar, o jogo deve ser atualizado na API
Caso o fotografo clique no botão de desistir, o jogo deve ser atualizado na API
Caso o fotografo possua um jogo já por ele cadastrado o checkbox deve estar marcado

Lógica 
1. Fazer request para a API para pegar a lista de jogos
2. Visualizar quais jogos ainda possuem vagas disponíveis para que o jogo possa ser liberado para o fotografo
3. Visualizar quais jogos estão com a trava true para bloquear o jogo para o fotografo

*/
export class TabelaJogosComponent implements OnInit {
  private messageSubscription!: Subscription;
  constructor(
    private jogosService: JogosService,
    private webSocketService: WebSocketService
  ) {


  }
  listaJogos: any[] = [];
  jogoAtualizado: any = {};
  listaCheck: Boolean[] = [];
  visible: boolean = false;
  visible2: boolean = false;
  feedback: boolean = false;
  idJogo: number = -1;
  jogo: any = {};
  travaJ: boolean = false;
  ngOnInit(): void {
    this.messageSubscription = this.webSocketService.getMessages().subscribe({
      next: (message) => {
        console.log(message)
        this.handleMessage(message);
      },
      error: (error) => {
        console.error('WebSocket error:', error);
      }
    });
    const idUser = parseInt(localStorage.getItem('idFotografo')!);

    this.jogosService.listaJogos({ id: idUser }).subscribe({
      next: (response) => {
        this.listaJogos = response.result;
        for (let i = 0; i < this.listaJogos.length; i++) {
          const element = this.listaJogos[i].trava;
          this.listaCheck.push(element);
        }
      },
      error: (error) => {
        console.log(error);
      }

    })
  };

  handleMessage(blob: Blob) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        this.jogoAtualizado = json;
        const myId = parseInt(localStorage.getItem('idFotografo')!);
        const idJogo = this.jogoAtualizado.id;
        const index = this.listaJogos.findIndex((jogo) => jogo.id === idJogo);
        if(this.jogoAtualizado.fotografo.some((fotografo: any) => fotografo.id === myId)) {
          this.jogoAtualizado.myGame = true;
        }
        const fotografo1 = this.jogoAtualizado.fotografo[0].id;
        const fotografo2 = this.jogoAtualizado.fotografo[1].id;
        if(fotografo1 != null && fotografo1 != myId && fotografo2 != null && fotografo2 != myId && this.jogoAtualizado.trava == false){
          this.jogoAtualizado.disponivel = false;
        }
        this.listaJogos[index] = this.jogoAtualizado;
        console.log(this.listaJogos[index]);
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading Blob:', error);
    };
    reader.readAsText(blob);
  }


  confirmaJogo() {
    const idFotografo = localStorage.getItem('idFotografo');
    const nome = localStorage.getItem('nome');
    for (let index = 0; index < this.jogo.fotografo.length; index++) {
      const element = this.jogo.fotografo[index];
      if (element.id == null || element.id == idFotografo) {
        element.id = idFotografo;
        element.nome = nome;
        break;
      };
    }
    this.jogo.trava = false;
    this.jogosService.atualizaJogo(this.jogo.id, this.jogo).subscribe({
      next: (response) => {
        this.visible = false;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  travaJogo(posicaoDoJogoNoArray: number, travaJogo: boolean) {
    this.jogo = this.listaJogos[posicaoDoJogoNoArray];
    this.jogo.trava = travaJogo;
    const idFotografo = localStorage.getItem('idFotografo');
    const nomeFoto = localStorage.getItem('nome');
    for (let i = 0; i < this.jogo.fotografo.length; i++) {
      const element = this.jogo.fotografo[i];
      if (element.id == null || element.id == idFotografo) {
        element.id = idFotografo;
        element.nome = nomeFoto;
        break;
      };

    }
    if (this.jogo.myGame) {
      this.jogosService.listaJogoId(this.jogo.id).subscribe({
        next: (response) => {
          if (response.result.trava == false) {
            this.jogosService.atualizaJogo(this.jogo.id, this.jogo).subscribe({
              next: (response) => {
                this.visible = true;
              },
              error: (error) => {
                console.log(error);
              }
            });

          } else {
            this.feedback = true;
            this.jogo.myGame = false;
            this.jogo.trava = true;
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else {
      this.visible2 = true;
    }
  }

  desmarcaJogo() {
    const idFotografo = localStorage.getItem('idFotografo');
    for (let index = 0; index < this.jogo.fotografo.length; index++) {
      const element = this.jogo.fotografo[index];
      if (element.id == idFotografo) {
        element.id = null;
        element.nome = null;
        break;
      }
    };
    this.jogo.trava = false;
    this.jogo.myGame = false;
    this.jogosService.atualizaJogo(this.jogo.id, this.jogo).subscribe({
      next: (response) => {
        this.visible = false;
        this.visible2 = false;
      },
      error: (error) => {
        console.log(error);
      }
    });

  }

  getSeverity(status: string) {
    switch (status) {
      case 'CBF':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return '';
    }
  }

}
