import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Usuario } from "../templates/usuario";
import { Documento } from "../templates/documento";
import { HttpClient } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-admin-docs-pendientes',
  templateUrl: './admin-docs-pendientes.component.html',
  styleUrls: ['./admin-docs-pendientes.component.css']
})
export class AdminDocsPendientesComponent implements OnInit {

  @ViewChild('inputArchivo')
  inputArchivo: ElementRef;

  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  token: string;
  servidor = new Servidor();
  documentos: any;
  tipos: any;
  procesos: any;
  total_documentos: number;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['NOMBRE', 'PROCESO', 'TIPO', 'FECHA_INICIO', 'VER', 'ACCIONES'];
  ver_editar: boolean;
  documento_editar = new Documento();
  archivo: File = null;

  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient) {
    this.validaLogin();
    this.validaPermisos();
    this.total_documentos = 0;
    this.ver_editar = false;
  }

  validaPermisos() {
    if (this.usuario.id_rol != 2 && this.usuario.id_rol != 3) {
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

  ngOnInit() {
    this.obtenProcesos();
    this.obtenDocumentos();
    this.obtenTipos();
  }

  onFileSelected(event) {
    this.archivo = <File>event.target.files[0];
    if (this.archivo.size > 2000000) {
      this.inputArchivo.nativeElement.value = "";
      this.resetInputFile();
      this.openSnackBar('ERROR', 'El tamaño máximo de archivo son 2MB');
    }
  }

  cancelarEditar() {
    this.ver_editar = false;
    this.resetInputFile();
    this.documento_editar.id_documento = null;
    this.documento_editar.nombre = null;
    this.documento_editar.id_proceso = null;
    this.documento_editar.id_tipo = null;
    this.documento_editar.ubicacion = null;
    this.documento_editar.observacion = null;
  }

  resetInputFile() {
    this.inputArchivo.nativeElement.value = "";
    this.archivo = null;
  }

  upload() {
    if (this.documento_editar.nombre && this.documento_editar.id_proceso &&
      this.documento_editar.id_tipo && this.documento_editar.ubicacion && this.archivo) {
      const data = new FormData();
      data.append('archivo', this.archivo, this.archivo.name);
      this.http.post(this.servidor.nombre + '/apps/sicdoc/subirArchivo.php', data)
        .subscribe(res => {
          if (res['Error']) {
            this.openSnackBar('ERROR', res['Error']);
          }
          else if (res['Exito']) {
            this.EditaDocumento(res['nombre_generado']);
          }
        });
    }
    else {
      this.openSnackBar("ERROR", "Debes llenar todos los campos");
    }
  }

  EditaDocumento(nombre_generado) {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/EditaDocumento.php', JSON.stringify({
      documento: this.documento_editar, url: this.servidor.url, tkn: this.token, nombre_archivo: nombre_generado
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
          this.cancelarEditar();
          this.obtenDocumentos();
        }
      });
  }

  editarDocumento(documento) {
    this.documento_editar.id_documento = documento.ID_DOCUMENTO;
    this.documento_editar.nombre = documento.NOMBRE;
    this.documento_editar.id_proceso = documento.ID_PROCESO;
    this.documento_editar.id_tipo = documento.ID_TIPO;
    this.documento_editar.ubicacion = documento.UBICACION;
    this.documento_editar.observacion = documento.OBSERVACION;
    this.ver_editar = true;
  }

  obtenDocumentos() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenDocumentosPendientesCodDepto.php', JSON.stringify({
      tkn: this.token, departamento: this.usuario.id_departamento
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

  obtenProcesos() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenProcesosDepto.php', JSON.stringify({
      tkn: this.token, departamento: this.usuario.id_departamento
    }), {
      }).subscribe(res => {
        this.procesos = res;
        if(!res){
          this.procesos = null;
        }
        else if (res['ErrorToken']) {
          this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
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
          this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
          setTimeout(() => { this.router.navigate(['/login']); }, 3000);
        }
        this.tipos = res;
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
