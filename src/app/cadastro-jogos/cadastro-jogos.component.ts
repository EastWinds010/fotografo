import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
interface Jogos {
  data_jogo: string;
  hora: string;
  campeonato: string;
  categoria: string;
  mandante: string;
  visitante: string;
  local_estadio: string;
  arfoc: boolean;
  organizacao: string;
}
@Component({
  selector: 'app-cadastro-jogos',
  standalone: true,
  imports: [InputTextModule, CommonModule, ButtonModule, FormsModule 


  ],
  templateUrl: './cadastro-jogos.component.html',
  styleUrl: './cadastro-jogos.component.css'
})
export class CadastroJogosComponent {
  showErrorEmailMessage: boolean = false;
  showErrorCpfMessage: boolean = false;
  
  jogo: Jogos = {
    data_jogo: '',
    hora: '',
    campeonato: '',
    categoria: '',
    mandante: '',  

    
    visitante: '',
    local_estadio: '',
    arfoc: false,
    organizacao: ''
  };
  onSubmit() {
    console.log(this.jogo);
  }
}
