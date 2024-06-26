import { Component, OnInit } from '@angular/core';
import { JogosService } from '../../services/jogos.service';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-jogos',
  standalone: true,
  imports: [],
  templateUrl: './lista-jogos.component.html',
  styleUrl: './lista-jogos.component.css'
})
export class ListaJogosComponent implements OnInit {
  refreshToken: string = '';
  constructor(
    private jogoService: JogosService,
    private loginService: LoginService,
    private router: Router
  ) { }
  ngOnInit(): void {
    if (localStorage.getItem('refreshToken') != null) {
      this.refreshToken = localStorage.getItem('refreshToken')!;

      const body = {
        refreshToken: this.refreshToken
      };
      this.loginService.token(body).subscribe({
        next: (data) => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
        },
        error: (err) => {
          console.error(err.status);
          if (err.status === 401) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        },

      })
    };

    this.jogoService.listaJogos(this.refreshToken).subscribe({
      next: (data) => {
        console.log(data.result);
      },
      error: (err) => {
        console.error(err.status);
      },
    });


  }
}
