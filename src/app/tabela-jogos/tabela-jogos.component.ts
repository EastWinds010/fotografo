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

@Component({
  selector: 'app-tabela-jogos',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, RatingModule, TagModule, CheckboxModule, FormsModule, DialogModule],
  templateUrl: './tabela-jogos.component.html',
  styleUrl: './tabela-jogos.component.css'
})

export class TabelaJogosComponent implements OnInit {
  constructor(
    private jogosService: JogosService,
  ) {}
  listaJogos: any[] = [];
  visible: boolean = false;
  idJogo: number = -1;
  jogo: any = {};
  travaJ: boolean = false;
  ngOnInit(): void {
    this.jogosService.listaJogos().subscribe({
      next: (response) => {
        this.listaJogos = response.result;
      },
      error: (error) => {
        console.log(error);
      }
    
    })
  };

  confirmaJogo(){
    const idFotografo = localStorage.getItem('idFotografo');
    console.log(this.travaJ)
    if (this.travaJ) {
      if (this.jogo.fotografo[0].id == null) {
        this.jogo.fotografo[0].id = idFotografo;
      } else {
        this.jogo.fotografo[1].id = idFotografo;
      }
    } else {
      if (this.jogo.fotografo[0].id == idFotografo) {
        this.jogo.fotografo[0].id = null;
      }
      if (this.jogo.fotografo[1].id == idFotografo) {
        this.jogo.fotografo[1].id = null;
      }
    }

    this.jogo.trava = false;
    this.jogosService.atualizaJogo(this.idJogo, this.jogo).subscribe({
      next: (response) => {
        console.log(response);
        this.visible = false;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  travaJogo(id: number, travaJogo: boolean) {
    this.travaJ = travaJogo;
    this.idJogo = this.listaJogos[id].id;
    this.jogo = this.listaJogos[id];

    this.jogosService.atualizaJogo(this.idJogo, this.jogo).subscribe({
      next: (response) => {
        console.log(response);
        this.visible = true;
      },
      error: (error) => {
        console.log(error);
      }
    })


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
