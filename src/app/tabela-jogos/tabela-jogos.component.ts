import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-tabela-jogos',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, RatingModule,TagModule, CheckboxModule ],
  templateUrl: './tabela-jogos.component.html',
  styleUrl: './tabela-jogos.component.css'
})

export class TabelaJogosComponent {
  products: any[] =
  [
    {
      "id": 3,
      "data": "09/05/2024",
      "hora": "14:00",
      "campeonato": "Copa Bronze",
      "categoria": "SUB14",
      "jogo": "São Paulo x Palmeiras",
      "local": "Estadio Morumbi",
      "arfoc": true,
      "fotografo": [
        {
          "id": null,
          "nome": null
        },
        {
          "id": null,
          "nome": null
        }
      ],
      "organizacao": "CONMEBOL"
    },
    {
      "id": 4,
      "data": "10/05/2024",
      "hora": "20:45",
      "campeonato": "Copa Prata",
      "categoria": "SUB16",
      "jogo": "Internacional x Grêmio",
      "local": "Estadio Beira-Rio",
      "arfoc": false,
      "fotografo": [
        {
          "id": null,
          "nome": null
        },
        {
          "id": null,
          "nome": null
        }
      ],
      "organizacao": "FIFA"
    },
    {
      "id": 5,
      "data": "11/05/2024",
      "hora": "18:30",
      "campeonato": "Copa Ouro",
      "categoria": "SUB18",
      "jogo": "Corinthians x Santos",
      "local": "Estadio Arena Corinthians",
      "arfoc": true,
      "fotografo": [
        {
          "id": null,
          "nome": null
        },
        {
          "id": null,
          "nome": null
        }
      ],
      "organizacao": "CBF"
    },
    {
      "id": 6,
      "data": "12/05/2024",
      "hora": "17:00",
      "campeonato": "Copa Prata",
      "categoria": "SUB12",
      "jogo": "Botafogo x Fluminense",
      "local": "Estadio Nilton Santos",
      "arfoc": false,
      "fotografo": [
        {
          "id": null,
          "nome": null
        },
        {
          "id": null,
          "nome": null
        }
      ],
      "organizacao": "FIFA"
    },
    {
      "id": 7,
      "data": "13/05/2024",
      "hora": "16:15",
      "campeonato": "Copa Bronze",
      "categoria": "SUB10",
      "jogo": "Bahia x Vitória",
      "local": "Estadio Fonte Nova",
      "arfoc": true,
      "fotografo": [
        {
          "id": null,
          "nome": null
        },
        {
          "id": null,
          "nome": null
        }
      ],
      "organizacao": "CONMEBOL"
    },
    {
      "id": 8,
      "data": "14/05/2024",
      "hora": "19:30",
      "campeonato": "Copa Ouro",
      "categoria": "SUB14",
      "jogo": "Atlético Paranaense x Coritiba",
      "local": "Estadio Arena da Baixada",
      "arfoc": false,
      "fotografo": [
        {
          "id": null,
          "nome": null
        },
        {
          "id": null,
          "nome": null
        }
      ],
      "organizacao": "CBF"
    },
    {
      "id": 9,
      "data": "15/05/2024",
      "hora": "20:00",
      "campeonato": "Copa Prata",
      "categoria": "SUB16",
      "jogo": "Cruzeiro x Flamengo",
      "local": "Estadio Mineirão",
      "arfoc": true,
      "fotografo": [
        {
          "id": null,
          "nome": null
        },
        {
          "id": null,
          "nome": null
        }
      ],
      "organizacao": "FIFA"
    }
    
    

  ]

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
