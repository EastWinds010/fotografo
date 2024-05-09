import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { ResetDeSenhaComponent } from './reset-de-senha/reset-de-senha.component';
import { PrimeiroAcessoComponent } from './primeiro-acesso/primeiro-acesso.component';


export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full' },
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent},
    {path: 'recuperar-senha', component: ResetDeSenhaComponent},
    {path: 'primeiro-acesso', component: PrimeiroAcessoComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
