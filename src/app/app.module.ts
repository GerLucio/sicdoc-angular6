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
  MatStepperModule
} from "@angular/material";
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { AdminUsuariosComponent } from './admin-usuarios/admin-usuarios.component';
import { InicioComponent } from './inicio/inicio.component';
import { ConfirmationDialog } from './confirmation-dialog/confirmation-dialog';
import { AdminContrasenasComponent } from './admin-contrasenas/admin-contrasenas.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminUsuariosComponent,
    InicioComponent,
    ConfirmationDialog,
    AdminContrasenasComponent
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
    AppRoutingModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialog]
})
export class AppModule { }
