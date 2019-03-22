import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Usuario } from "../templates/usuario";
import { Documento } from "../templates/documento";
import { HttpClient } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { MatTableDataSource } from '@angular/material';
import { ConfirmationDialog } from "../confirmation-dialog/confirmation-dialog";
import { MatDialog, MatDialogRef } from '@angular/material';
import swal from 'sweetalert2';
import { Revision } from "../templates/revision";

@Component({
  selector: 'app-admin-docsgen',
  templateUrl: './admin-docsgen.component.html',
  styleUrls: ['./admin-docsgen.component.css']
})
export class AdminDocsgenComponent implements OnInit {

  @ViewChild('inputArchivo')
  inputArchivo: ElementRef;

  dialogRef: MatDialogRef<ConfirmationDialog>;
  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  nuevo_documento = new Documento();
  tipos: any;
  procesos: any;
  documentos: any;
  procesos_docs: any;
  //total_documentos: number;
  dataSource = new MatTableDataSource();
  servidor = new Servidor();
  displayedColumns: string[] = ['CODIGO', 'NOMBRE', 'TIPO', 'REVISIONES', 'FECHA', 'ADMINISTRACIÓN'];
  token: string;
  ver_nuevo: boolean;
  archivo: File = null;
  doc_mostrar = new Documento();
  nueva_revision = new Revision();
  ver_revision: boolean;
  nueva_ubicacion: string;
  input_ubicacion: boolean;

  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
    this.validaLogin();
    this.validaPermisos();
    //this.total_documentos = 0;
    this.ver_nuevo = false;
    this.ver_revision = false;
    this.input_ubicacion = true;
  }

  ngOnInit() {
    this.obtenDocumentos();
    this.obtenProcesos();
    this.obtenTipos();
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

  onFileSelected(event) {
    this.archivo = <File>event.target.files[0];
    if (this.archivo.size > 2000000) {
      this.inputArchivo.nativeElement.value = "";
      this.resetInputFile();
      swal({
        type: 'error',
        title: 'ERROR',
        text: 'El tamaño máximo de archivo son 2MB',
        timer: 5000
      });
      //this.openSnackBar('ERROR', 'El tamaño máximo de archivo son 2MB');
    }
  }

  upload() {
    if (this.nuevo_documento.nombre && this.nuevo_documento.codigo && this.nuevo_documento.id_proceso &&
      this.nuevo_documento.id_tipo && this.nuevo_documento.ubicacion && this.archivo) {
      const data = new FormData();

      var split_name = this.archivo.name.split('.');
      var extencion = split_name[split_name.length - 1];
      var file_name = this.nuevo_documento.codigo + '_' + this.nuevo_documento.nombre + '_R0' + '.' + extencion;
      data.append('archivo', this.archivo, file_name.replace(/\//g, '_'));
      console.log(file_name.replace(/\//g, '_'));
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
            this.nuevoDocumento(res['nombre_generado']);
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

  resetInputFile() {
    this.inputArchivo.nativeElement.value = "";
    this.archivo = null;
  }

  nuevoDocumento(nombre_generado) {
    swal({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espere un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/nuevoDocumentoSGC.php', JSON.stringify({
      documento: this.nuevo_documento, url: this.servidor.url, tkn: this.token, nombre_archivo: nombre_generado,
      responsable: this.usuario.id_usuario
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
          this.obtenDocumentos();
        }
      });
  }

  obtenDocumentos() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenDocumentosGenerales2.php', JSON.stringify({
      tkn: this.token
    }), {
      }).subscribe(res => {
        this.documentos = res;
        if (!res) {
          this.dataSource = null;
          this.procesos_docs = null;
          //this.total_documentos = 0;
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
          //this.total_documentos = this.documentos.length;
          this.dataSource = res['documentos'];
          this.procesos_docs = res['procesos'];
        }
      });
  }

  ver_documento(documento) {
    //window.open(this.servidor.nombre + '/apps/sicdoc/files/' + documento.RUTA,
    window.open(this.servidor.nombre + '/apps/sicdoc/verArchivo.php?file=' + documento.RUTA,
      "resizable=yes,scrollbars=no,status=no,toolbar=no,menubar=no,titlebar=no");
  }

  obtenProcesos() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenProcesosSGC.php', JSON.stringify({
      tkn: this.token
    }), {
      }).subscribe(res => {
        this.procesos = res;
        if (!res) {
          this.procesos = res;
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

  obtenTipos() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenTipos.php', JSON.stringify({
      tkn: this.token
    }), {
      }).subscribe(res => {
        if (res['ErrorToken']) {
          swal({
            type: 'error',
            title: 'ERROR DE SESIÓN',
            text: 'Vuelve a iniciar sesión',
            timer: 5000
          });
          //this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
          setTimeout(() => { this.router.navigate(['/login']); }, 3000);
        }
        this.tipos = res;
      });
  }

  eliminarDialogo(documento) {
    this.dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "¿Deseas eliminar el documento " + documento.NOMBRE + "?";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminaDocumento(documento);
      }
      this.dialogRef = null;
    });
  }

  eliminaDocumento(documento) {
    swal({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espere un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/bajaDocumento.php', JSON.stringify({
      documento: documento, tkn: this.token, depto: this.usuario.departamento, rol: this.usuario.id_rol
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
        }
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      verticalPosition: 'top'
    });
  }

  cancelarNuevo() {
    this.ver_nuevo = false;
    this.resetInputFile();
    this.nuevo_documento.nombre = null;
    this.nuevo_documento.codigo = null;
    this.nuevo_documento.id_proceso = null;
    this.nuevo_documento.id_tipo = null;
    this.nuevo_documento.ubicacion = null;
  }

  verRevision(documento) {
    this.nueva_revision.id_documento = documento.ID_DOCUMENTO;
    this.nueva_revision.documento = documento.NOMBRE;
    this.nueva_revision.codigo = documento.CODIGO;
    this.nueva_revision.no_revision = documento.NO_REVISION;
    this.ver_revision = true;
  }

  cancelarRevision() {
    this.ver_revision = false;
    this.resetInputFile();
    this.nueva_revision.id_documento = null;
    this.nueva_ubicacion = null;
    this.input_ubicacion = true;
  }

  onChange(event) {
    if (event.checked)
      this.input_ubicacion = false;
    else {
      this.input_ubicacion = true;
      this.nueva_ubicacion = null;
    }
  }

  upload2() {
    if (this.nueva_revision.id_documento && this.archivo &&
      ((!this.input_ubicacion && this.nueva_ubicacion) || this.input_ubicacion)) {
      swal({
        type: 'info',
        title: 'Enviando petición',
        text: 'Espere un momento por favor',
        showConfirmButton: false,
        allowOutsideClick: false
      });
      const data = new FormData();

      var split_name = this.archivo.name.split('.');
      var extencion = split_name[split_name.length - 1];
      var file_name = this.nueva_revision.codigo + '_' + this.nueva_revision.documento
        + '_R' + this.nueva_revision.no_revision + '.' + extencion;
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
    this.http.post(this.servidor.nombre + '/apps/sicdoc/nuevaRevisionSGC.php', JSON.stringify({
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
          this.cancelarRevision();
          this.obtenDocumentos();
        }
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
