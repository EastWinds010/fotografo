import { Component } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { UsuariosComponent } from '../usuarios/usuarios.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { CadastroComponent } from '../cadastro/cadastro.component';
import { TabelaJogosComponent } from '../tabela-jogos/tabela-jogos.component';
import { CadastroJogosComponent } from '../cadastro-jogos/cadastro-jogos.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TabMenuModule, UsuariosComponent, CommonModule, LoginComponent, CadastroComponent, TabelaJogosComponent, CadastroJogosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  items: any[] | undefined;
  activeItem: any | undefined;
  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const role = localStorage.getItem('role');
    if (role === '1') {
      this.items = [
        { label: 'Tabela de Jogos', icon: 'pi pi-fw pi-home', visible: true, id: 1 },
        { label: 'Usuários', icon: 'pi pi-fw pi-calendar', visible: true, id: 2 },
        { label: 'Cadastro de Usuário', icon: 'pi pi-fw pi-pencil', visible: true, id: 3 },
        { label: 'Relatórios', icon: 'pi pi-fw pi-file', visible: true, id: 4 },
        { label: 'Cadastro de Jogos', icon: 'pi pi-fw pi-slack', visible: true, id: 5 },
      ];
    } else {
      this.items = [
        { label: 'Tabela de Jogos', icon: 'pi pi-fw pi-home', visible: true, id: 1 },
        { label: 'Usuários', icon: 'pi pi-fw pi-calendar', visible: false, id: 2 },
        { label: 'Cadastro de Usuário', icon: 'pi pi-fw pi-pencil', visible: false, id: 3 },
        { label: 'Relatórios', icon: 'pi pi-fw pi-file', visible:true, id: 4 },
        { label: 'Cadastro de Jogos', icon: 'pi pi-fw pi-file', visible:true, id: 5 },
      ];
    }
    if (role == '1') {
      this.activeItem = this.items[2];
    }else
    {
      this.activeItem = this.items[0];
    }
    }
  };

  teste(teste: any) {
    this.activeItem = teste;


  }
  t1(idScreen: any) {
    if (this.activeItem && this.activeItem.id === idScreen) {
      return true;
    } else {
      return false;
    }
  }
  
}
