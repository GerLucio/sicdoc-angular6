import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from "./login/login.component";
import { AdminUsuariosComponent } from "./admin-usuarios/admin-usuarios.component";
import { InicioComponent } from "./inicio/inicio.component";
import { AdminContrasenasComponent } from './admin-contrasenas/admin-contrasenas.component';


const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
    data: { title: 'Inicio' },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin_usuarios',
    component: AdminUsuariosComponent,
    data: { title: 'AdminUsuarios' },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin_contrasenas',
    component: AdminContrasenasComponent,
    data: { title: 'AdminContrasenas' },
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
