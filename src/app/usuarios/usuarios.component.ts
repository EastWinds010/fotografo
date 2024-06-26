import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../services/usuarios.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';
import { LoadingComponent } from "../loading/loading.component";
import { Observable, forkJoin, tap } from 'rxjs';

interface City {
  name: string;
  code: number;
}
interface User {
  nome: string;
  email: string;
  arfoc: string;
  cpf: string;
  rg: string;
  password: string;
  role: number;
  telefone: string[];
  endereco: Address[];
  id_user: number;

}

interface Address {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  cep: string;
  complemento: string;
}
@Component({
  selector: 'app-usuarios',
  standalone: true,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
  imports: [CommonModule, DropdownModule, TableModule, ButtonModule, DialogModule, FormsModule, ReactiveFormsModule, InputTextModule, TabMenuModule, LoadingComponent]
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

  refreshToken: string = '';

  cities: City[] | undefined;
  selectedCity: City | undefined;
  endereco: Address = {
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: '',
    cep: '',
    complemento: ''
  };

  user: User = {
    id_user: 0,
    nome: '',
    email: '',
    arfoc: '',
    cpf: '',
    rg: '',
    password: '',
    role: 1,
    telefone: ['', '', ''],
    endereco: [this.endereco]
  };
  phone1: string = '';
  phone2: string = '';
  phone3: string = '';
  isLoading: boolean = false;
  ngOnInit(): void {
    this.isLoading = true;

    this.cities = [
      { name: 'Administrador', code: 1 },
      { name: 'Fotografo', code: 2 },
    ];

    const refreshToken = localStorage.getItem('refreshToken');
    const tasks: Observable<any>[] = [];

    if (refreshToken != null) {
      this.refreshToken = refreshToken;
      const usuariosTask = this.usuariosService.getUsuarios(this.refreshToken).pipe(
        tap((data) => {
          this.products = data.result;
        })
      );
      tasks.push(usuariosTask);
    }

    if (tasks.length > 0) {
      forkJoin(tasks).subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  };


  showDialog(event: any, type: string) {
    this.isLoading = true;
    this.idUser = event;
    if (type === 'delete') {
      this.visibleDelete = true;

    } else {

      this.usuariosService.userId({ ids: [event] }, this.refreshToken).subscribe({
        next: (data) => {
          this.user = data.result[0];
          this.phone1 = this.user.telefone[0];
          this.phone2 = this.user.telefone[1];
          this.phone3 = this.user.telefone[2];
          this.visibleEdit = true;
          if (this.user.role === 1) {
            this.selectedCity = this.cities![0];
          } else {
            this.selectedCity = this.cities![1];
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
    this.idUser = event;
    this.isLoading = false;
  };

  deleteUser() {
    this.isLoading = true;
    this.usuariosService.deleteUsuario(this.idUser, this.refreshToken).subscribe({
      next: (data) => {
        this.visibleDelete = false;
        this.ngOnInit();
      },
      error: (error) => {
        console.error(error);
      },
    });
  };

  editUser() {
    this.isLoading = true;
    console.log(this.user);
    this.usuariosService.editUsuario(this.user.id_user, this.user, this.refreshToken).subscribe({
      next: (data) => {
        console.log(data);
        this.visibleEdit = false;
        this.ngOnInit();
      },
      error: (error) => {
        console.error(error);
      },
    });
  };

}
