import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Usuario } from "../templates/usuario";
import { Documento } from "../templates/documento";
import { HttpClient } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { MatTableDataSource } from '@angular/material';
import { InputDialogComponent } from "../input-dialog/input-dialog.component";
import { ConfirmationDialog } from "../confirmation-dialog/confirmation-dialog";
import { MatDialog, MatDialogRef } from '@angular/material';
import { Revision } from "../templates/revision";
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-update-docsgen',
  templateUrl: './admin-update-docsgen.component.html',
  styleUrls: ['./admin-update-docsgen.component.css']
})
export class AdminUpdateDocsgenComponent implements OnInit {

  @ViewChild('inputArchivo')
  inputArchivo: ElementRef;

  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  token: string;
  servidor = new Servidor();
  documentos: any;
  documentossgc: any;
  documento_aprobar: any;
  ver_edita: boolean;
  total_documentos: number;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['NOMBRE', 'PROCESO', 'TIPO', 'FECHA_REVISION', 'VER', 'ACCIONES'];
  dialogRef: MatDialogRef<InputDialogComponent>;
  dialogRef2: MatDialogRef<ConfirmationDialog>;
  ver_nuevo: boolean;
  archivo: File = null;
  nueva_revision = new Revision();
  nueva_ubicacion: string;
  input_ubicacion: boolean;

  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
    this.validaLogin();
    this.validaPermisos();
    this.total_documentos = 0;
    this.ver_nuevo = false;
    this.ver_edita = false;
    this.input_ubicacion = true;
  }

  validaPermisos() {
    if (this.usuario.id_rol != 1) {
      this.router.navigate(['/inicio']);
    }
  }

  onChange(event) {
    if (event.checked)
      this.input_ubicacion = false;
    else {
      this.input_ubicacion = true;
      this.nueva_ubicacion = null;
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
    this.obtenDocumentosSGC();
  }

  obtenDocumentos() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenDocumentosPendientesRev.php', JSON.stringify({
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

  obtenDocumentosSGC() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenDocumentos.php', JSON.stringify({
      tkn: this.token
    }), {
      }).subscribe(res => {
        this.documentossgc = res;
        if (!res) {
          this.documentossgc = null;
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
      });
  }

  inputDialogo(documento, accion) {
    if (accion == 'declinar') {
      this.dialogRef = this.dialog.open(InputDialogComponent, {
        disableClose: false
      });
      this.dialogRef.componentInstance.confirmMessage = "Escribe tus observaciones.";
      this.dialogRef.componentInstance.tipo = "Observación";
      this.dialogRef.afterClosed().subscribe(result => {
        if (result) {
          documento.OBSERVACION = result;
          this.revisa(documento, accion);
        }
        this.dialogRef = null;
      });
    }
    else if (accion == 'aprobar') {
      this.dialogRef2 = this.dialog.open(ConfirmationDialog, {
        disableClose: false
      });
      this.dialogRef2.componentInstance.confirmMessage = "¿Realmente deseas aprobar la nueva revisión del documento " + documento.NOMBRE + "?";
      this.dialogRef2.afterClosed().subscribe(result => {
        if (result) {
          this.revisa(documento, accion);
        }
        this.dialogRef2 = null;
      });
    }
  }

  revisa(documento, accion) {
    swal({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espere un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/revisaDocumento.php', JSON.stringify({
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

  upload() {

    if (this.nueva_revision.id_documento && this.archivo &&
      ((!this.input_ubicacion && this.nueva_ubicacion) || this.input_ubicacion)) {
      const data = new FormData();
      data.append('archivo', this.archivo, this.archivo.name);
      this.http.post(this.servidor.nombre + '/apps/sicdoc/subirArchivo.php', data)
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
            this.nuevaRevision(res['nombre_generado']);
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

  nuevaRevision(nombre_generado) {
    this.nueva_revision.id_responsable = this.usuario.id_usuario;
    for (let documento of this.documentossgc) {
      if (this.nueva_revision.id_documento == documento.ID_DOCUMENTO)
        this.nueva_revision.documento = documento.NOMBRE;
    }
    this.http.post(this.servidor.nombre + '/apps/sicdoc/nuevaRevision.php', JSON.stringify({
      revision: this.nueva_revision, tkn: this.token, nombre_archivo: nombre_generado,
      ubicacion: this.nueva_ubicacion
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
          this.cancelarNuevo();
        }
      });
  }

  cancelarNuevo() {
    this.ver_nuevo = false;
    this.resetInputFile();
    this.nueva_revision.id_documento = null;
    this.nueva_ubicacion = null;
    this.input_ubicacion = true;
  }

  resetInputFile() {
    this.inputArchivo.nativeElement.value = "";
    this.archivo = null;
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

  upload2() {
    if (this.archivo) {
      const data = new FormData();

      var split_name = this.archivo.name.split('.');
      var extension = split_name[split_name.length - 1];
      var file_name = this.documento_aprobar.CODIGO + '_' + this.documento_aprobar.NOMBRE
        + '_R' + (this.documento_aprobar.NO_REVISION - 1) + '.' + extension;
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
            //this.reemplazaDocumento(res['nombre_generado'], this.documento_aprobar.RUTA);
            this.documento_aprobar.RUTA = res['nombre_generado'];
            this.revisa(this.documento_aprobar, 'aprobar');
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

  aprueba_doc(documento) {
    this.documento_aprobar = documento;
    this.ver_edita = true;
  }

}
