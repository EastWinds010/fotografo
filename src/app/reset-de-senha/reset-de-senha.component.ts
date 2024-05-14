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
  selector: 'app-reset-de-senha',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ButtonModule, FormsModule, ReactiveFormsModule, InputTextModule, PasswordModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './reset-de-senha.component.html',
  styleUrl: './reset-de-senha.component.css'
})


export class ResetDeSenhaComponent {
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
  constructor(private resetPasswordService: ResetPasswordService) { }
  checkEmail() {
    let emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (emailPattern.test(this.email)) {
      this.showErrorEmailMessage = false;
    } else {
      this.showErrorEmailMessage = true;
    }
  }
  checkCpf() {
    if (this.validateCpf(this.cpf)) {
      this.showErrorCpfMessage = false;
    } else {
      this.showErrorCpfMessage = true;
    }
  }
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
            localStorage.setItem('id', response.id);
            break;
          case 200:
            console.log('Pode redefinir a senha!');
            this.resetSenha = false;
            console.log(response.id);
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
  }

  validateCpf(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '' || cpf.length != 11) return false;

    // Elimina CPFs invalidos conhecidos
    if (
      cpf == '00000000000' ||
      cpf == '11111111111' ||
      cpf == '22222222222' ||
      cpf == '33333333333' ||
      cpf == '44444444444' ||
      cpf == '55555555555' ||
      cpf == '66666666666' ||
      cpf == '77777777777' ||
      cpf == '88888888888' ||
      cpf == '99999999999'
    )
      return false;

    let add = 0;
    for (let i = 0; i < 9; i++)
      add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(9))) return false;
    add = 0;
    for (let i = 0; i < 10; i++)
      add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(10))) return false;

    return true;
  }
}
