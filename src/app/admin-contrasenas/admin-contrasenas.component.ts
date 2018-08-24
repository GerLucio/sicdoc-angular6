import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Usuario } from "../templates/usuario";
import { Departamento } from "../templates/departamento";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Servidor } from "../templates/servidor";

@Component({
  selector: 'app-admin-contrasenas',
  templateUrl: './admin-contrasenas.component.html',
  styleUrls: ['./admin-contrasenas.component.css']
})
export class AdminContrasenasComponent implements OnInit {
  login: boolean = false;
  hide: boolean = true;
  setUsuario: any;
  servidor = new Servidor();
  usuario = new Usuario();
  passwordForm: FormGroup;
  passwordForm1: FormGroup;
  passwordForm2: FormGroup;
  token: string;

  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient, private _formBuilder: FormBuilder) { 
    this.validaLogin();
  }

  ngOnInit() {
    this.passwordForm = this._formBuilder.group({
      pass_valida: ['', Validators.required]
    });
    this.passwordForm1 = this._formBuilder.group({
      pass1_valida: ['', Validators.required]
    });
    this.passwordForm2 = this._formBuilder.group({
      pass2_valida: ['', Validators.required]
    });
  }

  validaLogin() {
    this.login = JSON.parse(localStorage.getItem('Loggedin'));
    if (this.login) {
      this.setUsuario = JSON.parse(localStorage.getItem('usuario'));
      this.usuario.id_usuario = this.setUsuario.ID_USUARIO;
      this.usuario.nombre = this.setUsuario.NOMBRE;
      this.usuario.puesto = this.setUsuario.PUESTO;
      this.usuario.correo = this.setUsuario.CORREO;
      this.usuario.departamento = this.setUsuario.DEPARTAMENTO;
      this.usuario.rol = this.setUsuario.ROL;
      this.usuario.id_rol = this.setUsuario.ID_ROL;
      this.usuario.id_estado = this.setUsuario.ID_ESTADO;
      this.usuario.estado = this.setUsuario.ESTADO;
      this.token = JSON.parse(localStorage.getItem('tkn'));
    }
  }


  cambiarPassword(){
    this.passwordForm1.value.pass_valida;
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/cambiaPassword.php', JSON.stringify({
      usuario: this.usuario, new_pass: this.passwordForm1.value.pass1_valida, pass: this.passwordForm.value.pass_valida,
      tkn: this.token  
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          this.openSnackBar('ERROR', res['Error']);
        }
        else {
          localStorage.setItem('usuario', JSON.stringify(res['usuario']));
          this.openSnackBar('ÉXITO', 'Tu contraseña se cambió correctamente');
          setTimeout( () => { this.router.navigate(['/inicio']); }, 2000 );
        }
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      verticalPosition: 'top'
    });
  }

}
