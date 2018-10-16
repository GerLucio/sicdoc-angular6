import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Usuario } from "../templates/usuario";
import swal from 'sweetalert2';
import { Documento } from "../templates/documento";
import { HttpClient } from '@angular/common/http';
import { Servidor } from "../templates/servidor";

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  token: string;
  servidor = new Servidor();
  documento = new Documento();
  nombre: string;

  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient) {
    this.validaLogin();
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
      this.usuario.id_estado = this.setUsuario.ID_ESTADO;
      this.usuario.estado = this.setUsuario.ESTADO;
      this.token = JSON.parse(localStorage.getItem('tkn'));
      swal({
        type: 'success',
        title: 'BIENVENIDO',
        text: this.usuario.nombre + " " + this.usuario.apellido,
        confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> Genial ',
        timer: 5000
      });
    }
  }

  ngOnInit() {
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      verticalPosition: 'top'
    });
  }

  buscaDocumento() {
    this.resetForm();
    if(!this.nombre){
      swal({
        type: 'error',
        title: 'ERROR',
        text: 'Debes ingresar nombre o código para reaizar la búsqueda',
        timer: 5000
      });
      return;
    }
    this.http.post(this.servidor.nombre + '/apps/sicdoc/buscaDocumento.php', JSON.stringify({
      tkn: this.token, nombre: this.nombre
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          swal({
            type: 'error',
            title: 'ERROR',
            text: res['Error'],
            timer: 5000
          });
          //this.openSnackBar('ERROR', res['Error']);
        }
        else if (res['ErrorToken']) {
          swal({
            type: 'error',
            title: 'ERROR DE SESIÓN',
            text: 'Vuelve a iniciar sesión',
            timer: 5000
          });
          //this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
          setTimeout(() => { this.router.navigate(['/login']); }, 3000);
        }
        else {
          swal({
            type: 'success',
            title: 'ÉXITO',
            text: 'Documento encontrado',
            timer: 5000
          });
          this.documento = res;
        }
      });
  }

  resetForm(){
    this.documento.nombre = null;
    this.documento.codigo = null;
    this.documento.proceso = null;
    this.documento.departamento = null;
    this.documento.tipo = null;
    this.documento.revision = null;
    this.documento.ubicacion = null;
    this.documento.ruta = null;
  }

  ver_documento(ruta) {
    //window.open(this.servidor.nombre + '/apps/sicdoc/files/' + documento.RUTA,
    window.open(this.servidor.nombre + '/apps/sicdoc/verArchivo.php?file=' + ruta,
      "resizable=yes,scrollbars=no,status=no,toolbar=no,menubar=no,titlebar=no");
  }

}
