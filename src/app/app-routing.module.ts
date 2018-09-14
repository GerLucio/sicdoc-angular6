import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from "./login/login.component";
import { AdminUsuariosComponent } from "./admin-usuarios/admin-usuarios.component";
import { InicioComponent } from "./inicio/inicio.component";
import { AdminContrasenasComponent } from './admin-contrasenas/admin-contrasenas.component';
import { AdminTiposDocsComponent } from './admin-tipos-docs/admin-tipos-docs.component';
import { AdminSubdireccionComponent } from './admin-subdireccion/admin-subdireccion.component';
import { AdminDepartamentoComponent } from './admin-departamento/admin-departamento.component';
import { AdminProcesosComponent } from "./admin-procesos/admin-procesos.component";
import { AdminRolesComponent } from "./admin-roles/admin-roles.component";
import { AdminDocsgenComponent } from "./admin-docsgen/admin-docsgen.component";
import { AdminCodComponent } from "./admin-cod/admin-cod.component";

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
    path: 'admin_docsgen',
    component: AdminDocsgenComponent,
    data: { title: 'AdminDocsgen' },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin_tipos_docs',
    component: AdminTiposDocsComponent,
    data: { title: 'AdminTiposDocs' },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin_cod',
    component: AdminCodComponent,
    data: { title: 'AdminCod' },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin_subdireccion',
    component: AdminSubdireccionComponent,
    data: { title: 'AdminSubdireccion' },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin_departamento',
    component: AdminDepartamentoComponent,
    data: { title: 'AdminDepartamento' },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin_roles',
    component: AdminRolesComponent,
    data: { title: 'AdminRoles' },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin_procesos',
    component: AdminProcesosComponent,
    data: { title: 'AdminProcesos' },
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
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
