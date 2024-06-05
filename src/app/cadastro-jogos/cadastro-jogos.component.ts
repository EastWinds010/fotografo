/*
Pontos para serem alterados no cadastro de Jogos
1. Alterar campo de arforc para um campo de seleção
2. Adicionar SelectBox com nome dos sócios e um nome de "Vaga BHFoto" para reservar o jogo
3. Adicionar lógica para que possa ser cadastro jogos na mesma data e local(essa lógica será usada para que possa filtrar jogos que podem ser selecionaos mais que um por hora)
*/

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { JogosService } from '../../services/jogos.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import * as Papa from 'papaparse';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { CadastroService } from '../../services/cadastro.service';
import { enableDebugTools } from '@angular/platform-browser';

interface Jogos {
  data_jogo: string;
  hora: string;
  campeonato: string;
  categoria: string;
  mandante: string;
  visitante: string;
  local: any;
  arfoc: boolean;
  organizacao: string;
  fotografos?: VagasBHFoto[];

}
interface VagasBHFoto {
  dados_fotografo?: any;
  nome: string,
  id: number
}
@Component({
  selector: 'app-cadastro-jogos',
  standalone: true,
  imports: [InputTextModule, CommonModule, ButtonModule,PanelModule ,FormsModule, InputSwitchModule, TableModule, TagModule, FileUploadModule, TooltipModule, DialogModule, ProgressBarModule, ToastModule, CheckboxModule, MultiSelectModule, CardModule, CalendarModule],
  templateUrl: './cadastro-jogos.component.html',
  styleUrl: './cadastro-jogos.component.css'
})
export class CadastroJogosComponent implements OnInit {

  constructor(
    private jogosService: JogosService,
  ) { }
  disabled: boolean = true;
  porcentagemJogosEnviados: number = 0;
  showErrorEmailMessage: boolean = false;
  showErrorCpfMessage: boolean = false;
  mensagemUploadJogos: string = '';
  listaJogos: any[] = [];
  cadastroJogosDatasIguais: Jogos[] = [
    {
      data_jogo: '',
      hora: '',
      campeonato: '',
      categoria: '',
      mandante: '',
      visitante: '',
      local: '',
      arfoc: false,
      organizacao: '',
      fotografos: []
    },
  ];
  jogo: Jogos = {
    data_jogo: '',
    hora: '',
    campeonato: '',
    categoria: '',
    mandante: '',
    visitante: '',
    local: '',
    arfoc: false,
    organizacao: '',
    fotografos: []
  };
  jogoEdit: Jogos = {
    data_jogo: '',
    hora: '',
    campeonato: '',
    categoria: '',
    mandante: '',
    visitante: '',
    local: '',
    arfoc: false,
    organizacao: '',
    fotografos: []
  };
  jogoAtual: number = 0;
  visibleUploadJogos: boolean = false;
  visibleDeleteJogo: boolean = false;
  visibleEditJogo: boolean = false;
  idDelete: number = -1;
  vagasBHFoto!: VagasBHFoto[];
  vagasBHFotoSelecionadas: VagasBHFoto[] = [];
  vagasBHFotoSelecionadasEdit: VagasBHFoto[] = [];

  ngOnInit() {
    this.vagasBHFoto = [
      { nome: 'Eduardo Macedo', id: 1},
      { nome: 'Douglas Patricio', id: 2},
      { nome: 'Gledston Tavares', id: 3},
      { nome: 'Gustavo Rabelo', id: 4},
      {nome: 'Vaga BH Foto', id: 5}

    ]
    this.jogosService.listaJogos().subscribe(
      {
        next: (data) => {
          console.log(data.result)
          this.listaJogos = data.result;
        },
        error: (error) => {
          console.log(error);
        }
      }
    );

  };

  c1(){
    console.log(this.cadastroJogosDatasIguais);
  }

  adicionarJogo() {
    this.cadastroJogosDatasIguais.push({
      data_jogo: this.cadastroJogosDatasIguais[0].data_jogo,
      hora: '',
      campeonato: this.cadastroJogosDatasIguais[0].campeonato,
      categoria: '',
      mandante: '',
      visitante: '',
      local: this.cadastroJogosDatasIguais[0].local,
      arfoc: this.cadastroJogosDatasIguais[0].arfoc,
      organizacao: this.cadastroJogosDatasIguais[0].organizacao,
      fotografos: []
    });
  }

  async onSubmit() {
    for (let index = 0; index < this.cadastroJogosDatasIguais.length; index++) {
      const element = this.cadastroJogosDatasIguais[index];
      const dateString = element.data_jogo;
      const hourString = element.hora;
      const date = new Date(dateString);
      const hour = new Date(hourString);
      const formattedDate = date.toLocaleDateString('pt-BR');
      const formattedHour = hour.toLocaleTimeString('pt-BR');
      element.hora = formattedHour.substring(0, 5);
      element.data_jogo = formattedDate;
    }
    if (this.cadastroJogosDatasIguais.length == 1) {
      this.jogosService.insereJogo(this.cadastroJogosDatasIguais[0]).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.log(error);
        }
      });
      console.log('um jogo')
    } else {
      console.log('mais de um jogo')
      this.jogosService.insereJogoDatasIguais(this.cadastroJogosDatasIguais).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
    console.log(this.cadastroJogosDatasIguais)
  }
  teste(event: any, position: number){
    this.cadastroJogosDatasIguais[position].fotografos = event.value;
  }
  editarfotografos(event:any){
    console.log(event)
  }
  editJogo() {
    console.log(this.jogoEdit);
  }
  desabilitaBotao() {
    for (let index = 0; index < this.cadastroJogosDatasIguais.length; index++) {
      const element = this.cadastroJogosDatasIguais[index];
      if (
        element.data_jogo === '' ||
        element.hora === '' ||
        element.campeonato === '' ||
        element.categoria === '' ||
        element.mandante === '' ||
        element.visitante === '' ||
        element.local === '' ||
        element.organizacao === ''
      ) {
        return true;
      }
    }
    return false;
  }
  
  formatDate(event: any): string {
    const date = event.target.value;
    let dateFormaer = `${date.substring(8, 10)}/${date.substring(5, 7)}/${date.substring(0, 4)}`
    return this.jogo.data_jogo = dateFormaer;
  }
  formatDateEdit(event: any): string {

    const date = event.target.value;
    let dateFormaer = `${date.substring(8, 10)}/${date.substring(5, 7)}/${date.substring(0, 4)}`
    return this.jogoEdit.data_jogo = dateFormaer;
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
  };

  deletaJogo() {
    this.jogosService.deletaJogo(this.idDelete).subscribe(
      {
        next: (data) => {
          console.log(data);
          this.ngOnInit();
          this.visibleDeleteJogo = false;
        },
        error: (error) => {
          console.log(error);
        }
      }
    );
  }
  async onUpload(event: any) {
    this.mensagemUploadJogos = 'Aguarde enquanto os jogos são enviados...'
    // this.visibleUploadJogos = true;
    const file = event.files[0];
    Papa.parse(file, {
      complete: async (results) => {
        const data = results.data;
        const tamanhoAray = data.length - 1;

        for (let index = 1; index < data.length; index++) {
          const element = data[index] as string[];
          const jogo: Jogos = {
            data_jogo: element[0],
            hora: element[1],
            campeonato: element[2],
            categoria: element[3],
            mandante: element[4],
            visitante: element[5],
            local: element[6],
            arfoc: element[7] === 'sim' ? true : false,
            organizacao: element[8]
          };
          this.jogosService.insereJogo(jogo).subscribe({
            next: (data) => {
              console.log(data);
            },
            error: (error) => {
              console.log(error);
            }
          });
        }
      }
    });
  };

  showModalDelete(id: number) {
    this.visibleDeleteJogo = true;
    this.idDelete = id;
  };

  showModalEdit(id: number) {
    console.log(id)
    this.visibleEditJogo = true;
    this.jogoEdit = this.listaJogos[id];
    console.log(this.jogoEdit)
    // for (let index = 0; index < this.jogoEdit.fotografos!.length; index++) {
    //   const element = this.jogoEdit.fotografos![index];
    //   console.log(element.dados_fotografo.nome)
    //   const fotografo = {
    //     nome: element.dados_fotografo.nome,
    //     id: element.id
    //   }
    //   this.vagasBHFotoSelecionadasEdit.push(fotografo)
    // }
  };

  closeModalEdit() {
    this.visibleEditJogo = false;
    this.jogoEdit = {
      data_jogo: '',
      hora: '',
      campeonato: '',
      categoria: '',
      mandante: '',
      visitante: '',
      local: '',
      arfoc: false,
      organizacao: ''
    };
  }
}
