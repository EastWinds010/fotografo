import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from '../../services/login.service';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { ResetPasswordService } from '../../services/reset-password.service';

interface Credential {
  email: string;
  cpf: string;
}

@Component({
  selector: 'app-primeiro-acesso',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ButtonModule, FormsModule, ReactiveFormsModule, InputTextModule, PasswordModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './primeiro-acesso.component.html',
  styleUrl: './primeiro-acesso.component.css'
})

export class PrimeiroAcessoComponent {
  constructor(private resetPasswordService: ResetPasswordService) {

  }
  resetSenha: boolean = true;
  showErrorEmailMessage: boolean = false;
  showErrorCpfMessage: boolean = false;
  email: string = '';
  cpf: string = '';
  credentials: Credential = {
    email: '',
    cpf: ''
  };
  password: string = '';
  passwordConfirm: string = '';

  checkCredentials() {
    this.credentials.email = this.email;
    this.credentials.cpf = this.cpf;
    this.resetPasswordService.verifyCredentials(this.credentials).subscribe({
      next: (response) => {
        const code = response.status;
        switch (code) {
          case 401:
            console.log('Credenciais inválidas!');
            break;
          case 402:
            console.log('Senha já definida!');
            this.resetSenha = false;
            break;
          case 200:
            console.log('Pode cadastrar  senha!');
            this.resetSenha = false;
            localStorage.setItem('id', response.id);
            break; localStorage
          default:
            break;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  };

  alterPassword() {
    const id = localStorage.getItem('id');
    const credentials = {
      id: id,
      password: this.password
    };
    this.resetPasswordService.resetPassword(credentials).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  };
}
