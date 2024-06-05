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
  listaCheckJogosDatasIguais: Boolean[] = [];
  visible: boolean = false;
  visible2: boolean = false;
  feedback: boolean = false;
  idJogo: number = -1;
  jogosDatasIguais: any = [];
  travaJ: boolean = false;
  idUser: number = -1;
  jogosAlterados: any = [];
  ngOnInit(): void {
    this.messageSubscription = this.webSocketService.getMessages().subscribe({
      next: (message) => {
      this.handleMessage(message);
      },
      error: (error) => {
        console.error('WebSocket error:', error);
      }
    });
    this.idUser = parseInt(localStorage.getItem('idFotografo')!);

    this.jogosService.listaJogos().subscribe({
      next: (response) => {
        this.listaJogos = response.result;
        this.listaJogos.map((jogo: { myGame: boolean; travado: boolean}) => {
          jogo.myGame = this.verificaMyGame(jogo);
          jogo.travado = this.verificaTrava(jogo);
          return jogo;
        });
        console.log(this.listaJogos);
      },
      error: (error) => {
        console.log(error);
      }
    })
  };

  verificaTrava(jogo: any): boolean {
    if(jogo.myGame){
      return false;
    }
    if(jogo.status == 3 || jogo.status == 5 || jogo.status == 6 || jogo.status == 1 ){
      return true;
    }
    return false;
  }
  verificaMyGame(jogo: any): boolean {
    for (let i = 0; i < jogo.fotografos.length; i++) {
      const idFotografo = jogo.fotografos[i].id_fotografo;
      if(idFotografo == this.idUser){
        return true;
      }
    }
    return false;
  }
  selecionaJogo(event: any, rowIndex: number) {
    if (event.checked) {
      this.idJogo = this.listaJogos[rowIndex].id;
      const idLocal = this.listaJogos[rowIndex].local.id_local;
      this.jogosService.listaJogosLocal(idLocal).subscribe({
        next: (response) => {
          this.jogosDatasIguais = response.result;
          this.jogosDatasIguais.map((jogo: { selecionado: boolean; }) =>{
            jogo.selecionado = false;
            return jogo;
          })
          const statusJogos: { id: any; status: number; }[] = []
          this.jogosDatasIguais.forEach((jogo: any) => {
            if(this.idJogo == jogo.id){
              jogo.selecionado = true;
            }else{
              jogo.selecionado = false;
            }
            statusJogos.push({
              id: jogo.id,
              status: 3
            });
          });
          this.jogosService.alterarStatusJogoDatasIguais(statusJogos).subscribe({
            next: (response) => {
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
      this.visible2 = true;
    }
  };

  abandonarJogo(){
    const statusJogo = {
      status: 2,
      idJogo: this.idJogo,
      idFotografo: this.idUser
    }
    this.jogosService.abandonarJogo(statusJogo).subscribe({
      next: (response) => {
        console.log(response);
        this.visible2 = false;
      },
      error: (error) => {
        console.log(error);
      }
    });

  }
  salvarJogosDatasIguais(){

    for (let index = 0; index < this.jogosDatasIguais.length; index++) {
      const jogo = this.jogosDatasIguais[index];

      if(jogo.selecionado){
        const dadosJogos = {
          fotografoId: this.idUser,
          jogoId: jogo.id
        }
        this.jogosService.vincularFotografo(dadosJogos).subscribe({
          next: (response) => {
          },
          error: (error) => {
            console.log(error);
          }
        });
      } else{
        const dadosStatus = {
          id: jogo.id,
          status: 2
        }
        this.jogosService.alterarStatusJogoDatasIguais([dadosStatus]).subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
      
    }
    this.visible = false;

  }


  handleMessage(blob: Blob) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const jsonText = reader.result as string; // Converte o resultado do FileReader em texto
        const json = JSON.parse(jsonText); 
        console.log(json);
        this.jogosAlterados = json;
        this.jogosAlterados.map((jogo: { myGame: boolean; travado: boolean}) => {
          jogo.myGame = this.verificaMyGame(jogo);
          jogo.travado = this.verificaTrava(jogo);
          return jogo;
        });
        this.listaJogos = this.substituirObjetos(this.listaJogos, this.jogosAlterados);
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
