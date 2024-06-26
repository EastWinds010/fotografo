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
import { Observable, Subscription, forkJoin, tap  } from 'rxjs';
import { WebSocketService } from '../../services/websocket.service';
import { DatePipe } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { LoadingComponent } from "../loading/loading.component";

@Component({
    selector: 'app-tabela-jogos',
    standalone: true,
    providers: [DatePipe],
    templateUrl: './tabela-jogos.component.html',
    styleUrl: './tabela-jogos.component.css',
    imports: [TableModule, ButtonModule, CommonModule, RatingModule, TagModule, CheckboxModule, FormsModule, DialogModule, LoadingComponent]
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
    private loginService: LoginService,
    private webSocketService: WebSocketService,
    private datePipe: DatePipe,
    private router: Router
  ) {


  }
  listaJogos: any[] = [];
  jogoAtualizado: any = {};
  listaCheck: Boolean[] = [];
  listaCheckJogosDatasIguais: Boolean[] = [];
  visible: boolean = false;
  visible2: boolean = false;
  feedback: boolean = false;
  idJogo: number = -1;
  jogosDatasIguais: any = [];
  travaJ: boolean = false;
  idUser: number = -1;
  jogosAlterados: any = [];
  refreshToken: string = '';
  isLoading: boolean = false;
  ngOnInit(): void {
    this.isLoading = true;
    const refreshToken = localStorage.getItem('refreshToken');

    const tasks: Observable<any>[] = [];

    if (refreshToken != null) {
      this.refreshToken = refreshToken;

      const body = {
        refreshToken: this.refreshToken
      };

      const tokenTask = this.loginService.token(body).pipe(
        tap((data) => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
        })
      );
      tasks.push(tokenTask);
    }

    this.messageSubscription = this.webSocketService.getMessages().subscribe({
      next: (message) => {
        this.handleMessage(message);
      },
      error: (error) => {
        console.error('WebSocket error:', error);
      }
    });

    this.idUser = parseInt(localStorage.getItem('idFotografo')!, 10);

    if (refreshToken != null) {
      const jogosTask = this.jogosService.listaJogos(this.refreshToken).pipe(
        tap((response) => {
          this.listaJogos = response.result;
          this.listaJogos.map((jogo: { myGame: boolean; travado: boolean }) => {
            jogo.myGame = this.verificaMyGame(jogo);
            jogo.travado = this.verificaTrava(jogo);
            return jogo;
          });
        })
      );
      tasks.push(jogosTask);
    }

    if (tasks.length > 0) {
      forkJoin(tasks).subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  formatarData(data: string) {
    if (!data || data === 'Invalid Date') {
      return ''; // ou outra ação, dependendo do comportamento desejado
    }
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) {
      return ''; // ou outra ação, dependendo do comportamento desejado
    }
    return this.datePipe.transform(dataObj, 'EEEE, dd \'de\' MMMM \'de\' yyyy');
  }


  verificaTrava(jogo: any): boolean {
    if (jogo.myGame) {
      return false;
    }
    if (jogo.status == 3 || jogo.status == 5 || jogo.status == 6 || jogo.status == 1) {
      return true;
    }
    return false;
  }
  verificaMyGame(jogo: any): boolean {
    for (let i = 0; i < jogo.fotografos.length; i++) {
      const idFotografo = jogo.fotografos[i].id_fotografo;
      if (idFotografo == this.idUser) {
        return true;
      }
    }
    return false;
  }
  selecionaJogo(event: any, rowIndex: number) {
    this.isLoading = true;
    if (event.checked) {
      this.idJogo = this.listaJogos[rowIndex].id;
      const idLocal = this.listaJogos[rowIndex].local.id_local;
      this.jogosService.listaJogosLocal(idLocal, this.refreshToken).subscribe({
        next: (response) => {
          this.jogosDatasIguais = response.result;
          this.jogosDatasIguais.map((jogo: { selecionado: boolean; }) => {
            jogo.selecionado = false;
            return jogo;
          })
          const statusJogos: { id: any; status: number; }[] = []
          this.jogosDatasIguais.forEach((jogo: any) => {
            if (this.idJogo == jogo.id) {
              jogo.selecionado = true;
            } else {
              jogo.selecionado = false;
            }
            statusJogos.push({
              id: jogo.id,
              status: 3
            });
            for (let i = 0; i < jogo.fotografos.length; i++) {
              const idFotografo = jogo.fotografos[i].id_fotografo;
              if (idFotografo == this.idUser) {
                jogo.selecionado = true;
              }
            }
          });

          this.jogosService.alterarStatusJogoDatasIguais(statusJogos, this.refreshToken).subscribe({
            next: (response) => {
              this.isLoading = false;
              this.visible = true;
            },
            error: (error) => {
              console.log(error);
            }
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else {
      this.idJogo = this.listaJogos[rowIndex].id;
      this.isLoading = false;
      this.visible2 = true;
    }
  };

  abandonarJogo() {
    this.isLoading = true;
    const statusJogo = {
      status: 2,
      idJogo: this.idJogo,
      idFotografo: this.idUser
    }
    this.jogosService.abandonarJogo(statusJogo, this.refreshToken).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.visible2 = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
      }
    });

  }
  salvarJogosDatasIguais() {
    this.isLoading = true;
    for (let index = 0; index < this.jogosDatasIguais.length; index++) {
      const jogo = this.jogosDatasIguais[index];
      console.log(jogo);
      if (jogo.selecionado) {
        const dadosJogos = {
          fotografoId: this.idUser,
          jogoId: jogo.id
        }
        this.jogosService.vincularFotografo(dadosJogos, this.refreshToken).subscribe({
          next: (response) => {
          },
          error: (error) => {
            console.log(error);
          }
        });
      } else {
        const dadosStatus = {
          id: jogo.id,
          status: 2
        }
        this.jogosService.alterarStatusJogoDatasIguais([dadosStatus], this.refreshToken).subscribe({
          next: (response) => {
            const statusJogo = {
              status: 2,
              idJogo: jogo.id,
              idFotografo: this.idUser
            }
            this.jogosService.abandonarJogo(statusJogo, this.refreshToken).subscribe({
              next: (response) => {
                this.visible2 = false;
              },
              error: (error) => {
                console.log(error);
              }
            });
          },
          error: (error) => {
            console.log(error);
          }
        });
      }

    }
    this.isLoading = false;
    this.visible = false;

  }


  handleMessage(blob: Blob) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const jsonText = reader.result as string; // Converte o resultado do FileReader em texto
        const json = JSON.parse(jsonText);
        this.jogosAlterados = json;
        this.jogosAlterados.map((jogo: { myGame: boolean; travado: boolean }) => {
          jogo.myGame = this.verificaMyGame(jogo);
          jogo.travado = this.verificaTrava(jogo);
          return jogo;
        });
        this.listaJogos = this.substituirObjetos(this.listaJogos, this.jogosAlterados);

        this.listaJogos.map((jogo: { myGame: boolean; travado: boolean }) => {
          jogo.myGame = this.verificaMyGame(jogo);
          jogo.travado = this.verificaTrava(jogo);
          return jogo;
        });
        console.log(this.listaJogos);
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading Blob:', error);
    };
    reader.readAsText(blob); // Converte o Blob em texto
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

  substituirObjetos(originais: any[], novos: any[]): any[] {
    // Cria um mapa de novos objetos com base no id
    const novosMap = new Map(novos.map(novo => [novo.id, novo]));

    // Itera sobre o array original e substitui os objetos que têm o mesmo id
    return originais.map(original => novosMap.get(original.id) || original);
  }
}
