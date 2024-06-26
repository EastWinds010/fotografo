import { Component, OnInit } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { UsuariosComponent } from '../usuarios/usuarios.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { CadastroComponent } from '../cadastro/cadastro.component';
import { TabelaJogosComponent } from '../tabela-jogos/tabela-jogos.component';
import { CadastroJogosComponent } from '../cadastro-jogos/cadastro-jogos.component';
import { ParametrosComponent } from '../parametros/parametros.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ListaJogosComponent } from '../lista-jogos/lista-jogos.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ListaJogosComponent,
    TabMenuModule,
    UsuariosComponent,
    CommonModule,
    LoginComponent,
    CadastroComponent,
    TabelaJogosComponent,
    CadastroJogosComponent,
    ParametrosComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  items: any[] | undefined;
  activeItem: any | undefined;
  refreshToken: string = '';

  constructor(private router: Router,  private loginService: LoginService,) { }

  ngOnInit() {

    if (localStorage.getItem('refreshToken') != null) {
      this.refreshToken = localStorage.getItem('refreshToken')!;

      const body = {
        refreshToken: this.refreshToken
      };
      this.loginService.token(body).subscribe({
        next: (data) => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
          const role = localStorage.getItem('role');
          if (role === '1') {
            this.items = [
              { label: 'Tabela de Jogos', icon: 'pi pi-fw pi-home', visible: true, id: 1 },
              { label: 'Usuários', icon: 'pi pi-fw pi-calendar', visible: true, id: 2 },
              { label: 'Cadastro de Usuário', icon: 'pi pi-fw pi-pencil', visible: true, id: 3 },
              { label: 'Cadastro de Jogos', icon: 'pi pi-fw pi-file', visible: true, id: 4 },
              { label: 'Relatórios', icon: 'pi pi-fw pi-file', visible: true, id: 5 },
              { label: 'Parâmetros', icon: 'pi pi-fw pi-cog', visible: true, id: 6},
              { label: 'Listagem de Jogos', icon: 'pi pi-fw pi-home', visible: true, id: 7},
              { label: 'Logout', icon: 'pi pi-fw pi-power-off', visible: true, id: 8}
    
            ];
          } else {
            this.items = [
              { label: 'Tabela de Jogos', icon: 'pi pi-fw pi-home', visible: true, id: 1 },
              { label: 'Usuários', icon: 'pi pi-fw pi-calendar', visible: false, id: 2 },
              { label: 'Cadastro de Usuário', icon: 'pi pi-fw pi-pencil', visible: false, id: 3 },
              { label: 'Cadastro de Jogos', icon: 'pi pi-fw pi-file', visible: false, id: 4 },
              { label: 'Relatórios', icon: 'pi pi-fw pi-file', visible: true, id: 5 },
              { label: 'Parâmetros', icon: 'pi pi-fw pi-cog', visible: false, id: 6},
              { label: 'Listagem de Jogos', icon: 'pi pi-fw pi-home', visible: false, id: 7},
              { label: 'Logout', icon: 'pi pi-fw pi-power-off', visible: true, id: 8}
            ];
          }
          this.activeItem = role === '1' ? this.items[0] : this.items[0];
        },
        error: (err) => {
          console.error(err.status);
          if (err.status === 401) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        },

      })
    }
  }

  teste(teste: any) {
    this.activeItem = teste;
    console.log(teste.id);
    if(teste.id === 8) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  t1(idScreen: any) {
    return this.activeItem && this.activeItem.id === idScreen;
  }

}
