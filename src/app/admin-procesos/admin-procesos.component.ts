import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Usuario } from "../templates/usuario";
import { Proceso } from "../templates/proceso";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { MatTableDataSource } from '@angular/material';
import { ConfirmationDialog } from "../confirmation-dialog/confirmation-dialog";
import { MatDialog, MatDialogRef } from '@angular/material';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-procesos',
  templateUrl: './admin-procesos.component.html',
  styleUrls: ['./admin-procesos.component.css']
})
export class AdminProcesosComponent implements OnInit {

  dialogRef: MatDialogRef<ConfirmationDialog>;
  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  servidor = new Servidor();
  procesos: any;
  nuevo_proceso = new Proceso();
  total_procesos: number;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['PROCESO', 'DEPARTAMENTO', 'ADMINISTRACIÓN'];
  proceso_editar = new Proceso;
  ver_editar: boolean;
  ver_nuevo: boolean;
  departamentos: any;
  token: string;

  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
    this.validaLogin();
    this.validaPermisos();
    this.ver_editar = false;
    this.ver_nuevo = false;
    this.total_procesos = 0;
  }

  ngOnInit() {
    this.obtenProcesos();
    this.obtenDepartamentos();
  }

  validaLogin() {
    this.login = JSON.parse(localStorage.getItem('Loggedin'));
    if (this.login) {
      this.setUsuario = JSON.parse(localStorage.getItem('usuario'));
      this.usuario.id_usuario = this.setUsuario.ID_USUARIO;
      this.usuario.nombre = this.setUsuario.NOMBRE;
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

  validaPermisos() {
    if (this.usuario.id_rol != 1) {
      this.router.navigate(['/inicio']);
    }
  }

  editarProceso(proceso) {
    this.proceso_editar.id_proceso = proceso.ID_PROCESO;
    this.proceso_editar.nombre = proceso.NOMBRE;
    this.proceso_editar.id_departamento = proceso.ID_DEPARTAMENTO
    this.ver_editar = true;
  }

  cancelarEditar() {
    this.proceso_editar.id_proceso = null;
    this.proceso_editar.nombre = null;
    this.proceso_editar.id_departamento = null;
    this.obtenProcesos();
    this.obtenDepartamentos();
    this.ver_editar = false;
  }

  obtenDepartamentos() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenDepartamentosActivos.php', JSON.stringify({
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
        this.departamentos = res;
      });
  }

  guardaEditarProceso(proceso_editar) {
    if (proceso_editar.nombre && proceso_editar.id_departamento) {
      let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      this.http.post(this.servidor.nombre + '/apps/sicdoc/editaProceso.php', JSON.stringify({
        proceso: this.proceso_editar, tkn: this.token
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
            this.cancelarEditar();
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


  obtenProcesos() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenProcesos.php', JSON.stringify({
      tkn: this.token
    }), {
      }).subscribe(res => {
        this.procesos = res;
        if (!res) {
          this.dataSource = null;
          this.total_procesos = 0;
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
          this.total_procesos = this.procesos.length;
          this.dataSource = new MatTableDataSource(this.procesos);
        }
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      verticalPosition: 'top'
    });
  }

  eliminarDialogo(proceso) {
    this.dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "¿Deseas eliminar el proceso " + proceso.NOMBRE + "?";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminaProceso(proceso.ID_PROCESO);
      }
      this.dialogRef = null;
    });
  }

  eliminaProceso(id) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/bajaProceso.php', JSON.stringify({
      id_proceso: id, tkn: this.token
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
          this.obtenProcesos();
        }
      });
  }

  nuevoProceso() {
    if (this.nuevo_proceso.nombre && this.nuevo_proceso.id_departamento) {
      let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      this.http.post(this.servidor.nombre + '/apps/sicdoc/nuevoProceso.php', JSON.stringify({
        proceso: this.nuevo_proceso, tkn: this.token
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

  cancelarNuevo() {
    this.nuevo_proceso.nombre = null;
    this.nuevo_proceso.id_departamento = null;
    this.obtenProcesos();
    this.ver_nuevo = false;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
