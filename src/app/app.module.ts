import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from './app.component';
import { AuthGuard } from './guard';
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatButtonModule,
  MatToolbarModule,
  MatCardModule,
  MatMenuModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatExpansionModule,
  MatInputModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatBadgeModule,
  MatSlideToggleModule,
  MatChipsModule,
  MatSelectModule,
  MatGridListModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatDialogModule,
  MatStepperModule,
  MatButtonToggleModule,
  MatTreeModule,
  MatCheckboxModule
} from "@angular/material";
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { AdminUsuariosComponent } from './admin-usuarios/admin-usuarios.component';
import { InicioComponent } from './inicio/inicio.component';
import { ConfirmationDialog } from './confirmation-dialog/confirmation-dialog';
import { AdminContrasenasComponent } from './admin-contrasenas/admin-contrasenas.component';
import { AdminTiposDocsComponent } from './admin-tipos-docs/admin-tipos-docs.component';
import { AdminSubdireccionComponent } from './admin-subdireccion/admin-subdireccion.component';
import { AdminDepartamentoComponent } from './admin-departamento/admin-departamento.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { AdminProcesosComponent } from './admin-procesos/admin-procesos.component';
import { AdminRolesComponent } from './admin-roles/admin-roles.component';
import { AdminDocsgenComponent } from './admin-docsgen/admin-docsgen.component';
import { AdminCodComponent } from './admin-cod/admin-cod.component';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { AdminUpdateDocsgenComponent } from './admin-update-docsgen/admin-update-docsgen.component';
import { AdminPcPoComponent } from './admin-pc-po/admin-pc-po.component';
import { AdminDocsPendientesComponent } from './admin-docs-pendientes/admin-docs-pendientes.component';
import { AdminUpdateRevisionComponent } from './admin-update-revision/admin-update-revision.component';
import { AdminBajasDocsComponent } from './admin-bajas-docs/admin-bajas-docs.component';
import { ConsultaPcPoComponent } from './consulta-pc-po/consulta-pc-po.component';
import { RegistroCambiosComponent } from './registro-cambios/registro-cambios.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminUsuariosComponent,
    InicioComponent,
    ConfirmationDialog,
    AdminContrasenasComponent,
    AdminTiposDocsComponent,
    AdminSubdireccionComponent,
    AdminDepartamentoComponent,
    AdminProcesosComponent,
    AdminRolesComponent,
    AdminDocsgenComponent,
    AdminCodComponent,
    InputDialogComponent,
    AdminUpdateDocsgenComponent,
    AdminPcPoComponent,
    AdminDocsPendientesComponent,
    AdminUpdateRevisionComponent,
    AdminBajasDocsComponent,
    ConsultaPcPoComponent,
    RegistroCambiosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    HttpClientModule,
    HttpModule,
    ReactiveFormsModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatSelectModule,
    MatGridListModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    MatStepperModule,
    NgIdleKeepaliveModule.forRoot(),
    MatButtonToggleModule,
    MatTreeModule,
    MatCheckboxModule,
    AppRoutingModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialog, InputDialogComponent]
})
export class AppModule { }
