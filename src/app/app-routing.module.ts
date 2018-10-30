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
import { AdminUpdateDocsgenComponent } from "./admin-update-docsgen/admin-update-docsgen.component";
import { AdminCodComponent } from "./admin-cod/admin-cod.component";
import { AdminPcPoComponent } from './admin-pc-po/admin-pc-po.component';
import { AdminDocsPendientesComponent } from './admin-docs-pendientes/admin-docs-pendientes.component';
import { AdminUpdateRevisionComponent } from './admin-update-revision/admin-update-revision.component';
import { AdminBajasDocsComponent } from './admin-bajas-docs/admin-bajas-docs.component';
import { ConsultaPcPoComponent } from './consulta-pc-po/consulta-pc-po.component';
import { RegistroCambiosComponent } from './registro-cambios/registro-cambios.component';

const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
    data: { title: 'Inicio' },
    canActivate: [AuthGuard]
  },
  {
    path: 'registro_cambios',
    component: RegistroCambiosComponent,
    data: { title: 'RegistroCambios' },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin_usuarios',
    component: AdminUsuariosComponent,
    data: { title: 'AdminUsuarios' },
    canActivate: [AuthGuard]
  },
  {
    path: 'consulta_pc_po',
    component: ConsultaPcPoComponent,
    data: { title: 'ConsultaPcPo' },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin_bajas_docs',
    component: AdminBajasDocsComponent,
    data: { title: 'AdminBajasDocs' },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin_update_revisiones',
    component: AdminUpdateRevisionComponent,
    data: { title: 'AdminUpdateRevision' },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin_pc_po',
    component: AdminPcPoComponent,
    data: { title: 'AdminPcPo' },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin_docs_pendientes',
    component: AdminDocsPendientesComponent,
    data: { title: 'AdminDocsPendientes' },
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
    path: 'admin_update_docsgen',
    component: AdminUpdateDocsgenComponent,
    data: { title: 'AdminUpdateDocsgen' },
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
