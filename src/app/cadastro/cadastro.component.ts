import { Component, OnInit, ɵɵsetComponentScope } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CadastroService } from '../../services/cadastro.service';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { DialogModule } from 'primeng/dialog';
import { LoginService } from '../../services/login.service';
import { LoadingComponent } from "../loading/loading.component";



interface User {
  nome: string;
  email: string;
  aforc: string;
  cpf: string;
  rg: string;
  password: string;
  role: number;
  telefone: string[];
  endereco: Address[];

}

interface Address {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  cep: string;
  complemento: string;
}

interface City {
  name: string;
  code: number;
}

@Component({
    selector: 'app-cadastro',
    standalone: true,
    templateUrl: './cadastro.component.html',
    styleUrl: './cadastro.component.css',
    imports: [RouterOutlet, ButtonModule, FormsModule, ReactiveFormsModule, InputTextModule, CheckboxModule, RadioButtonModule, InputNumberModule, CommonModule, NgxMaskDirective, NgxMaskPipe, DialogModule, DropdownModule, LoadingComponent]
})
export class CadastroComponent implements OnInit {
  showErrorCpfMessage: boolean = false;
  showErrorEmailMessage: boolean = false;
  showErrorNameMessage: boolean = false;
  mensage: string='';
  mensageCpf: string = '';
  mensageEmail: string = '';
  disableButton: boolean = true;
  visible: boolean = false;
  phone1: string = '';
  phone2: string = '';
  phone3: string = '';
  confirmPassword: string = '';
  

  endereco: Address = {
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: '',
    cep: '',
    complemento: ''
  };

  user: User = {
    nome: '',
    email: '',
    aforc: '',
    cpf: '',
    rg: '',
    password: '',
    role: 1,
    telefone: ['', '', ''],
    endereco: [this.endereco]
  };
  refreshToken: string = '';

  cities: City[] | undefined;

  selectedCity: City | undefined;
  isLoading: boolean = false;


  constructor(
    private cadastroService: CadastroService,
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
    }

    this.cities = [
      { name: 'Administrador', code: 1 },
      { name: 'Fotografo', code: 2 },
  ];
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  cadastroUsuario() {
    this.isLoading = true;
    this.user.telefone[0] = this.phone1;
    this.user.telefone[1] = this.phone2;
    this.user.telefone[2] = this.phone3;
    this.user.role = this.selectedCity!.code;
    this.cadastroService.createUser(this.user, this.refreshToken).subscribe({
      next: (data) => {
        if (data.status == 200) {
         this.showDialog('Cadastro realizado com sucesso!');
        this.user = {
          nome: '',
          email: '',
          aforc: '',
          cpf: '',
          rg: '',
          password: '',
          role: 1,
          telefone: ['', '', ''],
          endereco: [this.endereco]
        };
        this.endereco = {
          rua: '',
          numero: '',
          bairro: '',
          cidade: '',
          estado: '',
          pais: '',
          cep: '',
          complemento: ''
        };
        this.confirmPassword = '';
        this.phone1 = '';
        this.phone2 = '';
        this.phone3 = '';
        } else {
          this.showDialog('Erro ao realizar cadastro!');
          console.log(data)
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.isLoading = false;
  }
  showDialog(mensage: string) {
    this.visible = true;
    this.mensage = mensage;
    

}

  convertCaps(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  checkCpf() {
    if (this.validateCpf(this.user.cpf)) {
      this.showErrorCpfMessage = false;
      this.cadastroService.checkCpf(this.user.cpf).subscribe({
        next: (data) => {
          if (data.status != 200) {
            this.showErrorCpfMessage = true;
            this.mensageCpf = 'CPF já cadastrado!';
          }else{
            this.showErrorCpfMessage = false;
          }
        },
        error: (error) => {
          console.error(error);
        },
      })
    }else{
      this.mensageCpf = 'CPF inválido!';
      this.showErrorCpfMessage = true;
    }
  };

  checkEmail() {
    let emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    if (emailPattern.test(this.user.email)) {
      this.showErrorEmailMessage = false;
      this.cadastroService.checkEmail(this.user.email).subscribe({
        next: (data) => {
          if (data.status != 200) {
            this.showErrorEmailMessage = true;
          }else{
            this.showErrorEmailMessage = false;
            this.mensageEmail = 'Email já cadastrado!';
          }
        },
        error: (error) => {
          console.error(error);
        },
      })
    }else{
      this.mensageEmail = 'Email inválido!';
      this.showErrorEmailMessage = true;
    }
  };
  validadeName(input: any){
    const name = input.target.value.split(' ');
    if (name.length <= 1) {
      this.showErrorNameMessage = true;
    }else{
      this.showErrorNameMessage = false;
    }

  }
  validateForm():boolean {
    return this.user.nome.length > 0 &&
    this.user.email.length > 0 &&
    this.user.cpf.length === 11 &&
    this.showErrorCpfMessage === false
  };

  validateCpf(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '' || cpf.length != 11) return false;
  
    // Elimina CPFs invalidos conhecidos
    if (cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999")
      return false;
  
    let add = 0;
    for (let i = 0; i < 9; i++)
      add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
      return false;
    add = 0;
    for (let i = 0; i < 10; i++)
      add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
      return false;
  
    return true;
  }
}


