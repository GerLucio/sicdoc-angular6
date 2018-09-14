import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Usuario } from "../templates/usuario";
import { Documento } from "../templates/documento";
import { HttpClient } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { MatTableDataSource } from '@angular/material';
import { InputDialogComponent } from "../input-dialog/input-dialog.component";
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-admin-cod',
  templateUrl: './admin-cod.component.html',
  styleUrls: ['./admin-cod.component.css']
})
export class AdminCodComponent implements OnInit {
  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  token: string;
  servidor = new Servidor();
  documentos: any;
  total_documentos: number;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['NOMBRE', 'PROCESO', 'TIPO', 'FECHA_INICIO', 'VER', 'ACCIONES'];
  dialogRef: MatDialogRef<InputDialogComponent>;

  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
    this.validaLogin();
    this.validaPermisos();
    this.total_documentos = 0;
  }

  validaPermisos() {
    if (this.usuario.id_rol != 2) {
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
      this.usuario.rol = this.setUsuario.ROL;
      this.usuario.id_rol = this.setUsuario.ID_ROL;
      this.usuario.id_estado = this.setUsuario.ID_ESTADO;
      this.usuario.estado = this.setUsuario.ESTADO;
      this.token = JSON.parse(localStorage.getItem('tkn'));
    }
  }

  ngOnInit() {
    this.obtenDocumentos();
  }

  obtenDocumentos() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenDocumentosPendientesCod.php', JSON.stringify({
      tkn: this.token
    }), {
      }).subscribe(res => {
        this.documentos = res;
        if (!res) {
          this.dataSource = null;
          this.total_documentos = 0;
        }
        else if (res['ErrorToken']) {
          this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
          setTimeout(() => { this.router.navigate(['/login']); }, 3000);
        }
        else if (res) {
          this.total_documentos = this.documentos.length;
          this.dataSource = new MatTableDataSource(this.documentos);
        }
      });
  }

  inputDialogo(documento, accion) {
    this.dialogRef = this.dialog.open(InputDialogComponent, {
      disableClose: false
    });
    if (accion == 'declinar') {
      this.dialogRef.componentInstance.confirmMessage = "Escribe tus observaciones.";
      this.dialogRef.componentInstance.tipo = "Observación";
    }
    if (accion == 'aprobar') {
      this.dialogRef.componentInstance.confirmMessage = "Escribe el código asignado al documento";
      this.dialogRef.componentInstance.tipo = "Código";
    }

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (accion == 'declinar') {
          documento.OBSERVACION = result;
        }
        else if (accion == 'aprobar') {
          documento.CODIGO = result;
        }
        this.codifica(documento, accion);
      }
      this.dialogRef = null;
    });
  }

  codifica(documento, accion) {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/codificaDocumento.php', JSON.stringify({
      documento: documento, tkn: this.token, accion: accion
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          this.openSnackBar('ERROR', res['Error']);
        }
        else if (res['ErrorToken']) {
          this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
          setTimeout(() => { this.router.navigate(['/login']); }, 3000);
        }
        else {
          this.openSnackBar('ÉXITO', res['Exito']);
          this.obtenDocumentos();
        }
      });
  }

  ver_documento(documento) {
    //window.open(this.servidor.nombre + '/apps/sicdoc/files/' + documento.RUTA,
    window.open(this.servidor.nombre + '/apps/sicdoc/verArchivo.php?file=' + documento.RUTA,
      "resizable=yes,scrollbars=no,status=no,toolbar=no,menubar=no,titlebar=no");
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      verticalPosition: 'top'
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
