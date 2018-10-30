import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Usuario } from "../templates/usuario";
import { Documento } from "../templates/documento";
import { HttpClient } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { MatTableDataSource } from '@angular/material';
import { InputDialogComponent } from "../input-dialog/input-dialog.component";
import { Revision } from "../templates/revision";
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-update-revision',
  templateUrl: './admin-update-revision.component.html',
  styleUrls: ['./admin-update-revision.component.css']
})
export class AdminUpdateRevisionComponent implements OnInit {

  @ViewChild('inputArchivo')
  inputArchivo: ElementRef;

  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  token: string;
  servidor = new Servidor();
  documentos: any;
  documentos_depto: any;
  total_documentos: number;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['NOMBRE', 'PROCESO', 'TIPO', 'FECHA_INICIO', 'VER', 'ACCIONES'];
  ver_nuevo: boolean;
  ver_editar: boolean;
  archivo: File = null;
  nueva_revision = new Revision();
  editar_revision = new Revision();
  nueva_ubicacion: string;
  input_ubicacion: boolean;

  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient) {
    this.validaLogin();
    this.validaPermisos();
    this.total_documentos = 0;
    this.ver_nuevo = false;
    this.ver_editar = false;
    this.input_ubicacion = true;
  }

  validaPermisos() {
    if (this.usuario.id_rol != 1 && this.usuario.id_rol != 2) {
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
      this.usuario.id_departamento = this.setUsuario.ID_DEPARTAMENTO;
      this.usuario.rol = this.setUsuario.ROL;
      this.usuario.id_rol = this.setUsuario.ID_ROL;
      this.usuario.id_estado = this.setUsuario.ID_ESTADO;
      this.usuario.estado = this.setUsuario.ESTADO;
      this.token = JSON.parse(localStorage.getItem('tkn'));
    }
  }

  ngOnInit() {
    this.obtenDocumentos();
    this.obtenDocumentosDepto();
  }

  obtenDocumentos() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenDocumentosPendientesRevDepto.php', JSON.stringify({
      tkn: this.token, departamento: this.usuario.id_departamento
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

  obtenDocumentosDepto() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenDocumentosDepto.php', JSON.stringify({
      tkn: this.token, departamento: this.usuario.id_departamento
    }), {
      }).subscribe(res => {
        this.documentos_depto = res;
        if (!res) {
          this.documentos_depto = null;
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

  ver_documento(documento) {
    //window.open(this.servidor.nombre + '/apps/sicdoc/files/' + documento.RUTA,
    window.open(this.servidor.nombre + '/apps/sicdoc/verArchivo.php?file=' + documento.RUTA,
      "resizable=yes,scrollbars=no,status=no,toolbar=no,menubar=no,titlebar=no");
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
        text: 'Debes llenar todos los campos',
        timer: 5000
      });
      //this.openSnackBar("ERROR", "Debes llenar todos los campos");
    }
  }

  upload2() {
    if (this.editar_revision.id_documento && this.archivo &&
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
            this.EditaRevision(res['nombre_generado']);
          }
        });
    }
    else {
      swal({
        type: 'error',
        title: 'ERROR',
        text: 'Debes llenar todos los campos',
        timer: 5000
      });
      //this.openSnackBar("ERROR", "Debes llenar todos los campos");
    }
  }

  editarDocumento(documento) {
    this.editar_revision.id_documento = documento.ID_DOCUMENTO;
    this.editar_revision.id_revision = documento.ID_REVISION;
    this.editar_revision.observacion = documento.OBSERVACION;
    this.ver_editar = true;
  }

  EditaRevision(nombre_generado) {
    this.editar_revision.id_responsable = this.usuario.id_usuario;
    this.http.post(this.servidor.nombre + '/apps/sicdoc/EditaRevisionDepto.php', JSON.stringify({
      revision: this.editar_revision, tkn: this.token, nombre_archivo: nombre_generado,
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
          })
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
          this.cancelarEditar();
        }
      });
  }

  nuevaRevision(nombre_generado) {
    this.nueva_revision.id_responsable = this.usuario.id_usuario;
    this.http.post(this.servidor.nombre + '/apps/sicdoc/nuevaRevisionDepto.php', JSON.stringify({
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
          this.obtenDocumentos();
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

  cancelarEditar() {
    this.ver_editar = false;
    this.resetInputFile();
    this.editar_revision.id_documento = null;
    this.editar_revision.id_revision = null;
    this.editar_revision.observacion = null;
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

}
