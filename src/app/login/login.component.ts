import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import { Usuario } from "../templates/usuario";
import { Servidor } from "../templates/servidor";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  usuario = new Usuario();
  Loggedin: boolean = false;
  servidor = new Servidor();

  constructor(private router: Router, private http: HttpClient, public snackBar: MatSnackBar) { }

  ngOnInit() {
    localStorage.removeItem('Loggedin');
    localStorage.removeItem('usuario');
    this.Loggedin = false;
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'El correo es obligatorio' :
        this.email.hasError('email') ? 'Correo no válido' :
            '';
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  login() {
    this.usuario.correo = this.email.value;
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre+'/apps/sicdoc/login.php', JSON.stringify({
      usuario: this.usuario
    }), {
      }).subscribe(res => {
        if (!res['Error']) {
          localStorage.setItem('usuario', JSON.stringify(res['usuario']));
          localStorage.setItem('Loggedin', 'true');
          this.Loggedin = true;
          this.router.navigate(['/inicio']);
        }
        else {
          this.openSnackBar('ERROR', res['Error']);
          this.Loggedin = false;
        }
      });
  }

}
