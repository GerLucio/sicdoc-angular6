import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Usuario } from "../templates/usuario";
import { Departamento } from "../templates/departamento";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { MatTableDataSource } from '@angular/material';
import { ConfirmationDialog } from "../confirmation-dialog/confirmation-dialog";
import { MatDialog, MatDialogRef } from '@angular/material';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-departamento',
  templateUrl: './admin-departamento.component.html',
  styleUrls: ['./admin-departamento.component.css']
})
export class AdminDepartamentoComponent implements OnInit {

  dialogRef: MatDialogRef<ConfirmationDialog>;
  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  servidor = new Servidor();
  subdirecciones: any;
  usuarios: any;
  usuariosnolideres: any;
  usuarios_departamento: any = [];
  nuevo_departamento = new Departamento();
  total_departamentos: number;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['DEPARTAMENTO', 'LIDER', 'SUBDIRECCIÓN', 'ADMINISTRACIÓN'];
  departamento_editar = new Departamento;
  ver_editar: boolean;
  departamentos: any;
  token: string;

  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
    this.validaLogin();
    this.validaPermisos();
    this.ver_editar = false;
    this.total_departamentos = 0;
  }

  ngOnInit() {
    this.obtenSubdirecciones();
    this.obtenDepartamentos();
    this.obtenUsuarios();
    this.obtenUsuariosNoLideres();
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

  editarDepartamento(departamento) {
    this.departamento_editar.id_departamento = departamento.ID_DEPTO;
    this.departamento_editar.nombre = departamento.NOMBRE;
    this.departamento_editar.id_lider = departamento.ID_LIDER;
    this.departamento_editar.id_subdireccion = departamento.ID_SUBDIRECCION;
    this.ver_editar = true;
    this.usuarios.forEach(usuario => {
      if(usuario.ID_DEPARTAMENTO == departamento.ID_DEPTO){
        this.usuarios_departamento.push(usuario);
      }
    });
  }

  cancelarEditar() {
    this.departamento_editar.id_departamento = null;
    this.departamento_editar.nombre = null;
    this.departamento_editar.id_lider = null;
    this.departamento_editar.id_subdireccion = null;
    this.usuarios_departamento = [];
    this.obtenSubdirecciones();
    this.obtenDepartamentos();
    this.obtenUsuarios();
    this.ver_editar = false;
  }

  obtenSubdirecciones() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenSubdirecciones.php', JSON.stringify({
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
        this.subdirecciones = res;
      });
  }

  obtenUsuarios() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenUsuariosActivos.php', JSON.stringify({
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
        this.usuarios = res;
      });
  }

  obtenUsuariosNoLideres() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenUsuariosNoLideres.php', JSON.stringify({
      tkn: this.token
    }), {
      }).subscribe(res => {
        this.usuariosnolideres = res;
        if (!res) {
          this.usuariosnolideres = null;
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

  obtenDepartamentos() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenDepartamentosActivos.php', JSON.stringify({
      tkn: this.token
    }), {
      }).subscribe(res => {
        this.departamentos = res;
        if (!res) {
          this.dataSource = null;
          this.total_departamentos = 0;
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
          this.total_departamentos = this.departamentos.length;
          this.dataSource = new MatTableDataSource(this.departamentos);
        }
      });
  }

  guardaEditarDepartamento(departamento_editar) {
    if (departamento_editar.nombre && departamento_editar.id_lider && departamento_editar.id_subdireccion) {
      let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      this.http.post(this.servidor.nombre + '/apps/sicdoc/editaDepartamento.php', JSON.stringify({
        departamento: this.departamento_editar, tkn: this.token
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
        text: 'Debes llenar todos los campos',
        timer: 5000
      });
      //this.openSnackBar("ERROR", "Debes llenar todos los campos");
    }
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      verticalPosition: 'top'
    });
  }

  eliminarDialogo(departamento) {
    this.dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "¿Deseas eliminar el departamento " + departamento.NOMBRE + "?";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminaDepartamento(departamento.ID_DEPTO);
      }
      this.dialogRef = null;
    });
  }

  eliminaDepartamento(id) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/bajaDepartamento.php', JSON.stringify({
      id_departamento: id, tkn: this.token
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
          this.obtenDepartamentos();
        }
      });
  }

  nuevoDepartamento() {
    if (this.nuevo_departamento.nombre && this.nuevo_departamento.id_subdireccion && this.nuevo_departamento.id_lider) {
      let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      this.http.post(this.servidor.nombre + '/apps/sicdoc/nuevoDepartamento.php', JSON.stringify({
        departamento: this.nuevo_departamento, tkn: this.token
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
            this.nuevo_departamento.nombre = null;
            this.nuevo_departamento.id_subdireccion = null;
            this.nuevo_departamento.id_lider = null;
            this.obtenDepartamentos();
            this.obtenUsuariosNoLideres();
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
