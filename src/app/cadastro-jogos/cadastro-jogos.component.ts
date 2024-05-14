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


interface Jogos {
  data_jogo: string;
  hora: string;
  campeonato: string;
  categoria: string;
  mandante: string;
  visitante: string;
  local: string;
  arfoc: boolean;
  organizacao: string;
}
@Component({
  selector: 'app-cadastro-jogos',
  standalone: true,
  imports: [InputTextModule, CommonModule, ButtonModule, FormsModule, InputSwitchModule, TableModule, TagModule, FileUploadModule, TooltipModule, DialogModule, ProgressBarModule, ToastModule],
  templateUrl: './cadastro-jogos.component.html',
  styleUrl: './cadastro-jogos.component.css'
})
export class CadastroJogosComponent implements OnInit {

  constructor(
    private jogosService: JogosService
  ) { }
  porcentagemJogosEnviados: number = 0;
  showErrorEmailMessage: boolean = false;
  showErrorCpfMessage: boolean = false;
  mensagemUploadJogos: string = '';
  listaJogos: any[] = [];
  jogo: Jogos = {
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
  jogoEdit: Jogos = {
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
   jogoAtual:number = 0;
   visibleUploadJogos: boolean = false;
   visibleDeleteJogo: boolean = false;
   visibleEditJogo: boolean = false;
   idDelete: number = -1;

  ngOnInit() {
    this.jogosService.listaJogos().subscribe(
      {
        next: (data) => {
          this.listaJogos = data.result;
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  };

  async onSubmit(jogo: Jogos, totalJogos?: number) {

    this.jogosService.insereJogo(jogo).subscribe(

      {

         next: (data) => {
          const jogoFormatado = {
            id: data.id,
            data_jogo: jogo.data_jogo,
            hora: jogo.hora,
            campeonato: jogo.campeonato,
            categoria: jogo.categoria,
            mandante: jogo.mandante,
            visitante: jogo.visitante,
            arfoc: jogo.arfoc,
            organizacao: jogo.organizacao,
            local: jogo.local
          }
          this.listaJogos.push(jogoFormatado);
          this.jogoAtual++;
          this.porcentagemJogosEnviados = Math.floor((this.jogoAtual / totalJogos!) * 100);
          if (this.porcentagemJogosEnviados == 100) {
            this.mensagemUploadJogos = 'Jogos enviados com sucesso!'
          }
        },
        error: (error) => {
          console.log(error);
        }
      }
    );
  };

  formatDate(event: any): string{
    const date = event.target.value;
    let dateFormaer = `${date.substring(8,10)}/${date.substring(5,7)}/${date.substring(0,4)}`
    return this.jogo.data_jogo = dateFormaer;
  }
  formatDateEdit(event: any): string{
    
    const date = event.target.value;
    let dateFormaer = `${date.substring(8,10)}/${date.substring(5,7)}/${date.substring(0,4)}`
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
    this.visibleUploadJogos = true;
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
          await this.onSubmit(jogo, tamanhoAray)
        }
      }
    });
  };

  showModalDelete(id: number){
    this.visibleDeleteJogo = true;
    this.idDelete = id;
  };

  showModalEdit(id: number){
    this.visibleEditJogo = true;
    console.log(this.listaJogos[id].arfoc);
    this.jogoEdit = this.listaJogos[id];
    
  };
}
