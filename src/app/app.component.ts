import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Usuario } from "./templates/usuario";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Servidor } from "./templates/servidor";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  token: string;
  servidor = new Servidor();

  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient) {
    this.validaLogin();
  }

  ngOnInit() {
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1000,
      verticalPosition: 'top'
    });
  }

  validaLogin() {
    this.login = JSON.parse(localStorage.getItem('Loggedin'));
    if (this.login) {
      this.setUsuario = JSON.parse(localStorage.getItem('usuario'));
      this.usuario.id_usuario = this.setUsuario.ID_USUARIO;
      this.usuario.nombre = this.setUsuario.NOMBRE;
      this.usuario.apellido = this.setUsuario.APELLIDO;
      this.usuario.puesto = this.setUsuario.PUESTO;
      this.usuario.correo = this.setUsuario.CORREO;
      this.usuario.departamento = this.setUsuario.DEPARTAMENTO;
      this.usuario.rol = this.setUsuario.ROL;
      this.usuario.id_rol = this.setUsuario.ID_ROL;
      this.token = JSON.parse(localStorage.getItem('tkn'));
      this.validaToken();
    }
  }

  validaToken() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/validaToken.php', JSON.stringify({
      tkn: this.token
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          this.salir();
        }
      });
  }

  salir() {
    localStorage.removeItem('Loggedin');
    localStorage.removeItem('usuario');
    localStorage.removeItem('tkn');
    this.login = false;
    this.router.navigate(['/login']);
  }

}