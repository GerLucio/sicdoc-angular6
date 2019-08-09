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
import { InputDialogComponent } from "../input-dialog/input-dialog.component";

@Component({
  selector: 'app-admin-pc-po',
  templateUrl: './admin-pc-po.component.html',
  styleUrls: ['./admin-pc-po.component.css']
})
export class AdminPcPoComponent implements OnInit {

  @ViewChild('inputArchivo')
  inputArchivo: ElementRef;

  //dialogRef: MatDialogRef<ConfirmationDialog>;
  dialogRef: MatDialogRef<InputDialogComponent>;
  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  nuevo_documento = new Documento();
  edita_documento = new Documento();
  tipos: any;
  procesos: any;
  procesos_docs: any;
  documentos: any;
  //total_documentos: number;
  dataSource = new MatTableDataSource();
  servidor = new Servidor();
  displayedColumns: string[] = ['CODIGO', 'NOMBRE', 'TIPO', 'FECHA', 'ADMINISTRACIÓN'];
  token: string;
  ver_nuevo: boolean;
  ver_revision: boolean;
  ver_edita: boolean;
  archivo: File = null;
  doc_mostrar = new Documento();
  nueva_revision = new Revision();
  nueva_ubicacion: string;
  input_ubicacion: boolean;
  motivo_baja: string;


  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
    this.validaLogin();
    this.validaPermisos();
    //this.total_documentos = 0;
    this.ver_nuevo = false;
    this.ver_revision = false;
    this.ver_edita = false;
    this.input_ubicacion = true;
  }

  ngOnInit() {
    this.obtenDocumentos();
    this.obtenProcesos();
    this.obtenTipos();
  }

  validaPermisos() {
    if (this.usuario.id_rol != 1 && this.usuario.id_rol != 2) {
      this.router.navigate(['/inicio']);
    }
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

  editarDocumento(documento) {
    this.edita_documento.id_documento = documento.ID_DOCUMENTO;
    this.edita_documento.nombre = documento.NOMBRE;
    this.edita_documento.codigo = documento.CODIGO;
    this.edita_documento.id_proceso = documento.ID_PROCESO;
    this.edita_documento.id_tipo = documento.ID_TIPO;
    this.edita_documento.ubicacion = documento.UBICACION;
    this.edita_documento.ruta = documento.RUTA;
    this.edita_documento.no_revision = documento.NO_REVISION;
    this.ver_edita = true;
  }

  cancelarEdita() {
    this.edita_documento.id_documento = null;
    this.edita_documento.nombre = null;
    this.edita_documento.id_tipo = null;
    this.edita_documento.id_proceso = null;
    this.edita_documento.codigo = null;
    this.edita_documento.ubicacion = null;
    this.edita_documento.ruta = null;
    this.edita_documento.no_revision = null;
    this.ver_edita = false;
  }

  editaDocumento() {
    if (this.edita_documento.nombre && this.edita_documento.codigo && this.edita_documento.id_proceso &&
      this.edita_documento.id_tipo && this.edita_documento.ubicacion) {
      if (this.archivo) {
        const data = new FormData();
        var split_name = this.archivo.name.split('.');
        var extension = split_name[split_name.length - 1];
        var file_name = this.edita_documento.codigo + '_' + this.edita_documento.nombre
          + '_R' + (this.edita_documento.no_revision - 1) + '.' + extension;
        data.append('archivo', this.archivo, file_name.replace(/\//g, '_'));
        this.http.post(this.servidor.nombre + '/apps/sicdoc/subirArchivoOriginal.php', data)
          .subscribe(res => {
            if (res['Error']) {
              swal({
                type: 'error',
                title: 'ERROR',
                text: res['Error'],
                timer: 5000
              });
            }
            else if (res['Exito']) {
              this.edita(res['nombre_generado'], true);
            }
          });
      }
      else {
        var split_name =  this.edita_documento.ruta.split('.');
        var extension = split_name[split_name.length - 1];
        var file_name = this.edita_documento.codigo + '_' + this.edita_documento.nombre
          + '_R' + (this.edita_documento.no_revision - 1) + '.' + extension;
        this.edita(file_name.replace(/ /g, '_'), false);
      }
    }
    else {
      swal({
        type: 'error',
        title: 'ERROR',
        text: 'Todos los campos deben ser llenados correctamente',
        timer: 5000
      });
    }
  }

  edita(nombre_archivo, cambio) {
    swal({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espere un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/modificaDocumento.php', JSON.stringify({
      tkn: this.token, documento: this.edita_documento, nombre_archivo: nombre_archivo, cambio: cambio
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          swal({
            type: 'error',
            title: 'ERROR',
            text: res['Error'],
            timer: 5000
          });
        }
        else if (res['ErrorToken']) {
          swal({
            type: 'error',
            title: 'ERROR DE SESIÓN',
            text: 'Vuelve a iniciar sesión',
            timer: 5000
          });
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
          this.cancelarEdita();
          this.obtenDocumentos();
        }
      });
  }

  ver_documento(documento) {
    //window.open(this.servidor.nombre + '/apps/sicdoc/files/' + documento.RUTA,
    window.open(this.servidor.nombre + '/apps/sicdoc/verArchivo.php?file=' + documento.RUTA,
      "resizable=yes,scrollbars=no,status=no,toolbar=no,menubar=no,titlebar=no");
  }

  obtenDocumentos() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenDocumentosDepto2.php', JSON.stringify({
      tkn: this.token, departamento: this.usuario.id_departamento, depto: this.usuario.departamento, rol: this.usuario.id_rol
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

  upload() {
    if (this.nuevo_documento.nombre && this.nuevo_documento.id_proceso &&
      this.nuevo_documento.id_tipo && this.nuevo_documento.ubicacion && this.archivo) {
      const data = new FormData();
      data.append('archivo', this.archivo, this.archivo.name);
      this.http.post(this.servidor.nombre + '/apps/sicdoc/subirArchivoHash.php', data)
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

  upload2() {
    if (this.nueva_revision.id_documento && this.archivo &&
      ((!this.input_ubicacion && this.nueva_ubicacion) || this.input_ubicacion)) {
      const data = new FormData();

      var script = null;
      if (this.usuario.id_rol == 1) {
        var split_name = this.archivo.name.split('.');
        var extension = split_name[split_name.length - 1];
        var file_name = this.nueva_revision.codigo + '_' + this.nueva_revision.documento
          + '_R' + this.nueva_revision.no_revision + '.' + extension;
        data.append('archivo', this.archivo, file_name.replace(/\//g, '_'));
        //data.append('archivo', this.archivo, this.archivo.name);
        script = '/apps/sicdoc/subirArchivoOriginal.php';
      }
      else {
        data.append('archivo', this.archivo, this.archivo.name);
        script = '/apps/sicdoc/subirArchivoHash.php';
      }
      this.http.post(this.servidor.nombre + script, data)
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
    swal({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espere un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.nueva_revision.id_responsable = this.usuario.id_usuario;
    var script = null;
    if (this.usuario.id_rol == 1)
      script = '/apps/sicdoc/nuevaRevision.php';
    else
      script = '/apps/sicdoc/nuevaRevisionDepto.php';
    this.http.post(this.servidor.nombre + script, JSON.stringify({
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

  onChange(event) {
    if (event.checked)
      this.input_ubicacion = false;
    else {
      this.input_ubicacion = true;
      this.nueva_ubicacion = null;
    }
  }


  obtenProcesos() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenProcesosDepto.php', JSON.stringify({
      tkn: this.token, departamento: this.usuario.id_departamento, depto: this.usuario.departamento, rol: this.usuario.id_rol
    }), {
      }).subscribe(res => {
        this.procesos = res;
        if (!res) {
          this.procesos = null;
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
        this.tipos = res;
        if (!res) {
          this.tipos = null;
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
    this.nuevo_documento.id_proceso = null;
    this.nuevo_documento.id_tipo = null;
    this.nuevo_documento.ubicacion = null;
    this.obtenDocumentos();
    this.obtenProcesos();
    this.obtenTipos();
  }

  cancelarRevision() {
    this.ver_revision = false;
    this.resetInputFile();
    this.nueva_revision.id_documento = null;
    this.nueva_ubicacion = null;
    this.input_ubicacion = true;
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
    this.http.post(this.servidor.nombre + '/apps/sicdoc/nuevoDocumento.php', JSON.stringify({
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
          this.obtenProcesos();
          this.obtenTipos();
        }
      });
  }

  verRevision(documento) {
    this.nueva_revision.id_documento = documento.ID_DOCUMENTO;
    this.nueva_revision.documento = documento.NOMBRE;
    this.nueva_revision.codigo = documento.CODIGO;
    this.nueva_revision.no_revision = documento.NO_REVISION;

    this.ver_revision = true;
  }

  eliminarDialogo(documento) {
    /*this.dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "¿Deseas eliminar el documento " + documento.NOMBRE + "?";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminaDocumento(documento);
      }
      this.dialogRef = null;
    });*/
    this.dialogRef = this.dialog.open(InputDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "¿Cuál es el motivo para la baja del documento?";
    this.dialogRef.componentInstance.tipo = "Escribe porqué motivo se debe de dar de baja el documento seleccionado";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.motivo_baja = result;
        this.eliminaDocumento(documento, this.motivo_baja);
      }
      this.dialogRef = null;
    });
  }

  eliminaDocumento(documento, motivo_baja) {
    swal({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espere un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/bajaDocumento.php', JSON.stringify({
      documento: documento, tkn: this.token, depto: this.usuario.departamento, rol: this.usuario.id_rol, motivo_baja: motivo_baja
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /*filtrar() {
    var input, filter, ul, li, card, i, txtValue;
    input = document.getElementById("filtro");
    filter = input.value.toUpperCase();
    ul = document.getElementById("procesos");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
      card = li[i].getElementsByTagName("mat-card")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }*/

}
