import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CadastroService } from '../../services/cadastro.service';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';

import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { DialogModule } from 'primeng/dialog';



interface User {
  nome: string;
  email: string;
  aforc: string;
  cpf: string;
  rg: string;
  password: string;
  role: number;
  phone: string[];
  address: Address[];

}

interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  cep: string;
  complement: string;
}



@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, FormsModule, ReactiveFormsModule, InputTextModule, CheckboxModule, RadioButtonModule, InputNumberModule, CommonModule, NgxMaskDirective, NgxMaskPipe, DialogModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
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
  

  adress: Address = {
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    country: '',
    cep: '',
    complement: ''
  };

  user: User = {
    nome: '',
    email: '',
    aforc: '',
    cpf: '',
    rg: '',
    password: '',
    role: 1,
    phone: [this.phone1, this.phone2, this.phone3],
    address: [this.adress]
  };


  constructor(
    private cadastroSercice: CadastroService,
    private router: Router
  ) { }
  onLogin() {
    this.router.navigate(['/login']);
  }

  cadastroUsuario() {
    console.log(this.user)
    this.cadastroSercice.createUser(this.user).subscribe({
      next: (data) => {
        console.log(data.status);
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
          phone: ['', '', ''],
          address: [this.adress]
        };
        this.adress = {
          street: '',
          number: '',
          neighborhood: '',
          city: '',
          state: '',
          country: '',
          cep: '',
          complement: ''
        };
        this.confirmPassword = '';
        this.phone1 = '';
        this.phone2 = '';
        this.phone3 = '';
        } else {
          this.showDialog('Erro ao realizar cadastro!');
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
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
      this.cadastroSercice.checkCpf(this.user.cpf).subscribe({
        next: (data) => {
          console.log(data.status);
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
      this.cadastroSercice.checkEmail(this.user.email).subscribe({
        next: (data) => {
          console.log(data.status);
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


