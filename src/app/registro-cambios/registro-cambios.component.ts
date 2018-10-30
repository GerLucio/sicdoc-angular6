import { Component, OnInit } from '@angular/core';
import { Usuario } from "../templates/usuario";
import { Router } from '@angular/router';
import { Servidor } from "../templates/servidor";
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
import { Documento } from '../templates/documento';
import { ConfirmationDialog } from "../confirmation-dialog/confirmation-dialog";
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-registro-cambios',
  templateUrl: './registro-cambios.component.html',
  styleUrls: ['./registro-cambios.component.css']
})
export class RegistroCambiosComponent implements OnInit {
  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  token: string;
  servidor = new Servidor();
  procesos: any;
  documentos: any;
  revisiones: any;
  dataSource: any[];
  columnsToDisplay: string[] = ['CODIGO', 'TIPO', 'NOMBRE', 'REVISIONES'];
  columnas_revision: string[] = ['NO_REVISION', 'FECHA_REVISION', 'RESPONSABLE', 'DESCARGA', 'ADMINISTRA'];
  ver_revisiones: boolean;
  documento_actual = new Documento();
  dialogRef: MatDialogRef<ConfirmationDialog>;


  constructor(private router: Router, private http: HttpClient, public dialog: MatDialog) {
    this.validaLogin();
    this.validaPermisos();
    this.ver_revisiones = false;
  }

  ngOnInit() {
    this.obtenDocumentos();
  }

  validaPermisos() {
    if (this.usuario.id_rol != 1) {
      this.router.navigate(['/inicio']);
    }
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
      this.usuario.id_departamento = this.setUsuario.ID_DEPARTAMENTO;
      this.usuario.rol = this.setUsuario.ROL;
      this.usuario.id_rol = this.setUsuario.ID_ROL;
      this.usuario.id_estado = this.setUsuario.ID_ESTADO;
      this.usuario.estado = this.setUsuario.ESTADO;
      this.token = JSON.parse(localStorage.getItem('tkn'));
    }
  }

  obtenDocumentos() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenHistorialRevisiones.php', JSON.stringify({
      tkn: this.token
    }), {
      }).subscribe(res => {
        if (!res) {
          this.documentos = null;
          this.revisiones = null;
        }
        else if (res['ErrorToken']) {
          swal({
            type: 'error',
            title: 'ERROR DE SESIÓN',
            text: 'Vuelve a iniciar sesión',
            timer: 5000
          });
        }
        else {
          this.procesos = res['procesos'];
          this.dataSource = res['documentos'];
        }
      });
  }

  verRevisiones(documento) {
    this.ver_revisiones = true;
    this.documento_actual = documento;
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenRevisiones.php', JSON.stringify({
      tkn: this.token, id_documento: documento.ID_DOCUMENTO
    }), {
      }).subscribe(res => {
        if (!res) {
          this.revisiones = null;
        }
        else if (res['ErrorToken']) {
          swal({
            type: 'error',
            title: 'ERROR DE SESIÓN',
            text: 'Vuelve a iniciar sesión',
            timer: 5000
          });
        }
        else {
          this.revisiones = res;
        }
      });
  }

  cancelarGestionar() {
    this.ver_revisiones = false;
  }

  ver_documento(revision) {
    //window.open(this.servidor.nombre + '/apps/sicdoc/files/' + documento.RUTA,
    window.open(this.servidor.nombre + '/apps/sicdoc/verArchivo.php?file=' + revision.RUTA,
      "resizable=yes,scrollbars=no,status=no,toolbar=no,menubar=no,titlebar=no");
  }

  onChange(event, revision) {
    if (event.checked) {
      this.confirmaDialogo(revision);
    }
    else {
      return;
    }
  }

  confirmaDialogo(revision) {
    this.dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "Estás a punto de cambiar la revisión vigente, ¿Deseas confirmar el cambio?";
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.revisa(revision);
      }
      else{
        this.verRevisiones(this.documento_actual);
      }
      this.dialogRef = null;
    });
  }

  revisa(revision) {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/cambiaRevisionVigente.php', JSON.stringify({
      revision: revision, tkn: this.token
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
            text: res['Exito'],
            timer: 5000
          });
          //this.openSnackBar('ÉXITO', res['Exito']);
          this.verRevisiones(this.documento_actual);
        }
      });
  }

}
