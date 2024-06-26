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
import { DialogModule } from 'primeng/dialog';
import { LoadingComponent } from '../loading/loading.component';

interface Credential {
  email: string;
  cpf: string;
}

@Component({
  selector: 'app-primeiro-acesso',
  standalone: true,
  imports: [LoadingComponent, DialogModule, RouterOutlet, CommonModule, ButtonModule, FormsModule, ReactiveFormsModule, InputTextModule, PasswordModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './primeiro-acesso.component.html',
  styleUrl: './primeiro-acesso.component.css'
})

export class PrimeiroAcessoComponent {
  visible: boolean = false;
  constructor(
    private resetPasswordService: ResetPasswordService,
    private router: Router) {

  }
  mensagem: string = '';
  isLoading = false;
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
    this.isLoading = true;
    this.credentials.email = this.email;
    this.credentials.cpf = this.cpf;
    this.resetPasswordService.verifyCredentials(this.credentials).subscribe({
      next: (response) => {
        const code = response.status;
        switch (code) {
          case 401:
            console.log('Credenciais inválidas!');
            this.mensagem = 'Credenciais inválidas!';
            this.isLoading = false;
            this.visible = true;
            break;
          case 402:
            console.log('Senha já definida!');
            this.mensagem = 'Usuário já possui senha definida!';
            this.resetSenha = false;
            this.isLoading = false;
            break;
          case 200:
            console.log('Pode cadastrar  senha!');
            this.resetSenha = false;
            localStorage.setItem('id', response.id);
            break;
          default:
            break;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.mensagem = 'Erro ao verificar credenciais!';
        this.visible = true;
        console.log(error);
      }
    });
  };

  alterPassword() {
    this.isLoading = true;
    const id = localStorage.getItem('id');
    const credentials = {
      id: id,
      password: this.password
    };
    this.resetPasswordService.resetPassword(credentials).subscribe({
      next: (response) => {

        this.visible = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  };
  onLogin() {
    this.visible = false;
    this.router.navigate(['/login']);
  }
}
