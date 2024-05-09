import { Component, ɵɵsetComponentScope } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, FormsModule, ReactiveFormsModule, InputTextModule, TabMenuModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  activeItem: { label: string; icon: string; visible: boolean; } | undefined;
  constructor(private usuariosService: UsuariosService) {

  }
  products: any[] = [];
  visibleDelete: boolean = false;
  visibleEdit: boolean = false;
  idUser: number = 0;
  form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });
  items: { label: string; icon: string; visible: boolean }[] | undefined;
  tabAtiva: string = '';


  ngOnInit() {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        console.log(data.result);
        this.products = data.result;
      },
      error: (error) => {
        console.error(error);
      },
    });
    const role = localStorage.getItem('role');
    if (role === '1') {
      this.items = [
        { label: 'Tabela de Jogos', icon: 'pi pi-fw pi-home', visible: true},
        { label: 'Usuários', icon: 'pi pi-fw pi-calendar', visible: true },
        { label: 'Cadastro de Usuário', icon: 'pi pi-fw pi-pencil', visible: true },
        { label: 'Relatórios', icon: 'pi pi-fw pi-file', visible: true },
      ];
    }else {
      this.items = [
        { label: 'Tabela de Jogos', icon: 'pi pi-fw pi-home', visible: true},
        { label: 'Usuários', icon: 'pi pi-fw pi-calendar', visible: true },
        { label: 'Cadastro de Usuário', icon: 'pi pi-fw pi-pencil', visible: false },
        { label: 'Relatórios', icon: 'pi pi-fw pi-file', visible: false },
      ];
    }
    this.activeItem = this.items[1];
  };


  showDialog(event: any, type: string) {
    if (type === 'delete') {
      this.visibleDelete = true;

    } else {
      this.visibleEdit = true;
    }
    this.idUser = event;
  };

  deleteUser() {
    this.usuariosService.deleteUsuario(this.idUser).subscribe({
      next: (data) => {
        console.log(data);
        this.visibleDelete = false;
        this.ngOnInit();
      },
      error: (error) => {
        console.error(error);
      },
    });
  };

  editUser() {
    this.usuariosService.editUsuario(this.idUser, this.form.value.name, this.form.value.email, this.form.value.password).subscribe({
      next: (data) => {
        console.log(data);
        this.visibleEdit = false;
        this.ngOnInit();
      },
      error: (error) => {
        console.error(error);
      },
    });
    console.log(this.form.value);
    console.log(this.idUser);
  };
  teste(teste: any) {
    console.log(teste);
    console.log('aqui');
  }
}
