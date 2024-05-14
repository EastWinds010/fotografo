import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from '../../services/login.service';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, FormsModule, ReactiveFormsModule, InputTextModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(
    private loginService: LoginService,
    private router: Router
    ) {
      
    }
    email: String = '';
    password: String = '';

   onLogin() {
    this.loginService.login(this.email, this.password).subscribe({
      next: (data) => {
        if(data.status == 200){
          localStorage.setItem('role', data.result.role);
          this.router.navigate(['/home']);
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
