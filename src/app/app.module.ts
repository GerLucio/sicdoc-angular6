import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from './app.component';
import { AuthGuard } from './guard/index';
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
  MatDialogModule
} from "@angular/material";
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './/app-routing.module';
import { LoginComponent } from './login/login.component';
import { AdminUsuariosComponent } from './admin-usuarios/admin-usuarios.component';
import { InicioComponent } from './inicio/inicio.component';
import { ConfirmationDialog } from './confirmation-dialog';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    AdminUsuariosComponent,
    InicioComponent,
    ConfirmationDialog
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
    AppRoutingModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialog]
})
export class AppModule { }
