import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from '../../services/login.service';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoadingComponent,  CommonModule, DialogModule, RouterOutlet, ButtonModule, FormsModule, ReactiveFormsModule, InputTextModule, PasswordModule, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private spinner: NgxSpinnerService
    ) {
      
    }
    isLoading = false;
    email: String = '';
    password: String = '';
    visible: boolean = false;

   onLogin() {
    this.isLoading = true;
    this.loginService.login(this.email, this.password).subscribe({
      next: (data) => {
        if(data.status == 200){
          localStorage.setItem('role', data.result.role);
          localStorage.setItem('idFotografo', data.result.idFotografo);
          localStorage.setItem('nome', data.result.nome);
          localStorage.setItem('isLogged', 'true');
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
          console.log('Usuário logado com sucesso');
          this.router.navigate(['/home']);
          this.isLoading = false;
        }else{
          console.log('Usuário ou senha inválidos');
          this.isLoading = false;
          this.visible = true;
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
   }
   firstAcess() {
    this.router.navigate(['/primeiro-acesso']);
   }
}
