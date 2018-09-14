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
  total_documentos: number;
  dataSource = new MatTableDataSource();
  servidor = new Servidor();
  displayedColumns: string[] = ['CODIGO', 'NOMBRE', 'PROCESO', 'TIPO', 'REVISIONES', 'ADMINISTRACIÓN'];
  token: string;
  ver_nuevo: boolean;
  archivo: File = null;
  doc_mostrar = new Documento();
  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
    this.validaLogin();
    this.validaPermisos();
    this.total_documentos = 0;
    this.ver_nuevo = false;
  }

  ngOnInit() {
    this.obtenDocumentos();
    this.obtenProcesos();
    this.obtenTipos();
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

  onFileSelected(event) {
    this.archivo = <File>event.target.files[0];
    if (this.archivo.size > 2000000) {
      this.inputArchivo.nativeElement.value = "";
      this.resetInputFile();
      this.openSnackBar('ERROR', 'El tamaño máximo de archivo son 2MB');
    }
  }

  upload() {
    const data = new FormData();
    data.append('archivo', this.archivo, this.archivo.name);
    this.http.post(this.servidor.nombre + '/apps/sicdoc/subirArchivo.php', data)
      .subscribe(res => {
        if (res['Error']) {
          this.openSnackBar('ERROR', res['Error']);
        }
        else if (res['Exito']) {
          this.nuevoDocumento(res['nombre_generado']);
        }
      });
  }

  resetInputFile() {
    this.inputArchivo.nativeElement.value = "";
    this.archivo = null;
  }

  nuevoDocumento(nombre_generado) {
    if (this.nuevo_documento.nombre && this.nuevo_documento.codigo && this.nuevo_documento.id_proceso &&
      this.nuevo_documento.id_tipo && this.nuevo_documento.ubicacion && this.archivo) {
      this.http.post(this.servidor.nombre + '/apps/sicdoc/nuevoDocumentoSGC.php', JSON.stringify({
        documento: this.nuevo_documento, url: this.servidor.url, tkn: this.token, nombre_archivo: nombre_generado,
        responsable: this.usuario.id_usuario
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
            this.cancelarNuevo();
            this.obtenDocumentos();
          }
        });
    }
    else {
      this.openSnackBar("ERROR", "Debes llenar todos los campos");
    }
  }

  obtenDocumentos() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenDocumentosGenerales.php', JSON.stringify({
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
        if (res['ErrorToken']) {
          this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
          setTimeout(() => { this.router.navigate(['/login']); }, 3000);
        }
        this.procesos = res;
      });
  }

  obtenTipos() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenTipos.php', JSON.stringify({
      tkn: this.token
    }), {
      }).subscribe(res => {
        if (res['ErrorToken']) {
          this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
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
        this.eliminaDocumento(documento.ID_DOCUMENTO);
      }
      this.dialogRef = null;
    });
  }

  eliminaDocumento(id) {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/bajaDocumento.php', JSON.stringify({
      id_documento: id, tkn: this.token
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
