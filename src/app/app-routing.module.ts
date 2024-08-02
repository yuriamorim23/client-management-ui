import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './view/login/login.component';
import { HomeComponent } from './view/home/home.component';
import { AuthGuard } from './service/auth.guard';
import { LoginGuard } from './service/loginGuard.guard';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
