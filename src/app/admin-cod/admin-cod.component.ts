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
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-cod',
  templateUrl: './admin-cod.component.html',
  styleUrls: ['./admin-cod.component.css']
})
export class AdminCodComponent implements OnInit {

  @ViewChild('inputArchivo')
  inputArchivo: ElementRef;
  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  token: string;
  servidor = new Servidor();
  documentos: any;
  documento_aprobar = new Documento();
  ver_edita: boolean;
  total_documentos: number;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['NOMBRE', 'PROCESO', 'TIPO', 'FECHA_INICIO', 'VER', 'ACCIONES'];
  dialogRef: MatDialogRef<InputDialogComponent>;
  archivo: File = null;

  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
    this.validaLogin();
    this.validaPermisos();
    this.total_documentos = 0;
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
      this.usuario.rol = this.setUsuario.ROL;
      this.usuario.id_rol = this.setUsuario.ID_ROL;
      this.usuario.id_estado = this.setUsuario.ID_ESTADO;
      this.usuario.estado = this.setUsuario.ESTADO;
      this.token = JSON.parse(localStorage.getItem('tkn'));
    }
  }

  ngOnInit() {
    this.obtenDocumentos();
    this.ver_edita = false;
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
          swal({
            type: 'error',
            title: 'ERROR DE SESIÓN',
            text: 'Vuelve a iniciar sesión',
            timer: 5000
          });
          //this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
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

  upload2() {
    if (this.archivo && this.documento_aprobar.codigo) {
      const data = new FormData();

      var split_name = this.archivo.name.split('.');
      var extension = split_name[split_name.length - 1];
      var file_name = this.documento_aprobar.codigo + '_' + this.documento_aprobar.nombre
        + '_R0'+ '.' + extension;
      data.append('archivo', this.archivo, file_name.replace(/\//g, '_'));
      //data.append('archivo', this.archivo, this.archivo.name);

      this.http.post(this.servidor.nombre + '/apps/sicdoc/subirArchivoOriginal.php', data)
        .subscribe(res => {
          if (res['Error']) {
            swal({
              type: 'error',
              title: 'ERROR',
              text: res['Error'],
              timer: 5000
            });
            //this.openSnackBar('ERROR', res['Error']);
          }
          else if (res['Exito']) {
            //this.reemplazaDocumento(res['nombre_generado'], this.documento_aprobar.ruta);
            this.documento_aprobar.ruta = res['nombre_generado'];
            this.codifica(this.documento_aprobar, 'aprobar');
          }
        });
    }
    else {
      swal({
        type: 'error',
        title: 'ERROR',
        text: 'Todos los campos deben ser llenados correctamente',
        timer: 5000
      });
      //this.openSnackBar("ERROR", "Todos los campos deben ser llenados correctamente");
    }
  }

  reemplazaDocumento(nuevo_archivo, viejo_archivo) {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/reemplazaArchivo.php', JSON.stringify({
      tkn: this.token, nuevo: nuevo_archivo, anterior: viejo_archivo
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
        /*else {
          swal({
            type: 'success',
            title: 'ÉXITO',
            text: res['Exito'],
            timer: 5000
          });
          //this.openSnackBar('ÉXITO', res['Exito']);
          //this.cancelarAprueba();
        }*/
      });
  }

  cancelarAprueba() {
    this.ver_edita = false;
    this.resetInputFile();
    this.documento_aprobar.ruta = null;
    this.documento_aprobar.codigo = null;
  }

  resetInputFile() {
    this.inputArchivo.nativeElement.value = "";
    this.archivo = null;
  }

  onFileSelected(event) {
    this.archivo = <File>event.target.files[0];
    if (this.archivo.size > 20000000) {
      this.inputArchivo.nativeElement.value = "";
      this.resetInputFile();
      swal({
        type: 'error',
        title: 'ERROR',
        text: 'El tamaño máximo de archivo son 20MB',
        timer: 5000
      });
      //this.openSnackBar('ERROR', 'El tamaño máximo de archivo son 20MB');
    }
  }

  aprueba_doc(documento) {
    this.documento_aprobar.id_documento = documento.ID_DOCUMENTO;
    this.documento_aprobar.ruta = documento.RUTA;
    this.documento_aprobar.nombre = documento.NOMBRE;
    this.documento_aprobar.num_revisiones = documento.NUM_REVISIONES;
    this.documento_aprobar.tipo = documento.TIPO;
    this.documento_aprobar.id_proceso = documento.ID_PROCESO;
    this.ver_edita = true;
  }

  codifica(documento, accion) {
    swal({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espere un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/codificaDocumento.php', JSON.stringify({
      documento: documento, tkn: this.token, accion: accion
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
          this.obtenDocumentos();
          if (accion == 'aprobar')
            this.cancelarAprueba();
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
