import { Component, OnInit } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { UsuariosComponent } from '../usuarios/usuarios.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { CadastroComponent } from '../cadastro/cadastro.component';
import { TabelaJogosComponent } from '../tabela-jogos/tabela-jogos.component';
import { CadastroJogosComponent } from '../cadastro-jogos/cadastro-jogos.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TabMenuModule,
    UsuariosComponent,
    CommonModule,
    LoginComponent,
    CadastroComponent,
    TabelaJogosComponent,
    CadastroJogosComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  items: any[] | undefined;
  activeItem: any | undefined;

  constructor(private router: Router) { }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const logado = localStorage.getItem('isLogged');
      if (logado !== 'true') {
        this.router.navigate(['/login']);
      }
      const role = localStorage.getItem('role');
      if (role === '1') {
        this.items = [
          { label: 'Tabela de Jogos', icon: 'pi pi-fw pi-home', visible: true, id: 1 },
          { label: 'Usuários', icon: 'pi pi-fw pi-calendar', visible: true, id: 2 },
          { label: 'Cadastro de Usuário', icon: 'pi pi-fw pi-pencil', visible: true, id: 3 },
          { label: 'Cadastro de Jogos', icon: 'pi pi-fw pi-slack', visible: true, id: 4 },
          { label: 'Relatórios', icon: 'pi pi-fw pi-file', visible: true, id: 5 }
        ];
      } else {
        this.items = [
          { label: 'Tabela de Jogos', icon: 'pi pi-fw pi-home', visible: true, id: 1 },
          { label: 'Usuários', icon: 'pi pi-fw pi-calendar', visible: false, id: 2 },
          { label: 'Cadastro de Usuário', icon: 'pi pi-fw pi-pencil', visible: false, id: 3 },
          { label: 'Cadastro de Jogos', icon: 'pi pi-fw pi-file', visible: true, id: 4 },
          { label: 'Relatórios', icon: 'pi pi-fw pi-file', visible: true, id: 5 }
        ];
      }
      this.activeItem = role === '1' ? this.items[0] : this.items[0];
    }
  }

  teste(teste: any) {
    this.activeItem = teste;
  }

  t1(idScreen: any) {
    return this.activeItem && this.activeItem.id === idScreen;
  }
}
