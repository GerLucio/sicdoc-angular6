import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Usuario } from "../templates/usuario";
import { Departamento } from "../templates/departamento";
import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { MatTableDataSource } from '@angular/material';
import { ConfirmationDialog } from "../confirmation-dialog/confirmation-dialog";
import { MatDialog, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {

  dialogRef: MatDialogRef<ConfirmationDialog>;
  ver_editar: boolean;
  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  nuevo_usuario = new Usuario();
  usuario_editar = new Usuario();
  email = new FormControl('', [Validators.required, Validators.email]);
  email2 = new FormControl('', [Validators.required, Validators.email]);
  departamentos: any;
  roles: any;
  usuarios: any;
  total_usuarios: number;
  dataSource = new MatTableDataSource();
  servidor = new Servidor();
  displayedColumns: string[] = ['NOMBRE', 'CORREO', 'PUESTO', 'DEPARTAMENTO', 'ROL', 'ESTADO', 'ADMINISTRACIÓN'];
  token: string;


  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
    this.validaLogin();
    this.validaPermisos();
    this.ver_editar = false;
  }


  ngOnInit() {
    this.obtenDepartamentos();
    this.obtenRoles();
    this.obtenUsuarios();
  }

  restablecerPassword(usuario) {
    this.dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "Se le enviará una contraseña temporal a " + usuario.NOMBRE +
      " para que restablezca su contraseña, ¿Deseas continuar?";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.restablecePass(usuario);
      }
      this.dialogRef = null;
    });
  }

  editarUsuario(usuario){
    this.usuario_editar.id_usuario = usuario.ID_USUARIO;
    this.usuario_editar.nombre = usuario.NOMBRE;
    this.usuario_editar.apellido = usuario.APELLIDO;
    this.usuario_editar.puesto = usuario.PUESTO;
    this.usuario_editar.id_departamento = usuario.ID_DEPARTAMENTO;
    this.usuario_editar.id_rol = usuario.ID_ROL;
    this.email2.setValue(usuario.CORREO);
    this.ver_editar = true;
  }

  cancelarEditar(){
    this.usuario_editar.id_usuario = null;
    this.usuario_editar.nombre = null;
    this.usuario_editar.apellido = null;
    this.usuario_editar.puesto = null;
    this.usuario_editar.id_departamento = null;
    this.usuario_editar.id_rol = null;
    this.email2.setValue(null);
    this.ver_editar = false;
  }

  guardaEditarUsuario(usuario) {
    this.usuario_editar.correo = this.email2.value;
    if (usuario.nombre && usuario.apellido && usuario.puesto &&
      !this.getErrorMessage2() && usuario.id_departamento && usuario.id_rol) {
      let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      this.http.post(this.servidor.nombre + '/apps/sicdoc/editaUsuario.php', JSON.stringify({
        usuario_editar: this.usuario_editar, tkn: this.token
      }), {
        }).subscribe(res => {
          if (res['Error']) {
            this.openSnackBar('ERROR', res['Error']);
          }
          else if (res['ErrorToken']) {
            this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
            setTimeout( () => { this.router.navigate(['/login']); }, 3000 );
          }
          else {
            this.openSnackBar('ÉXITO', res['Exito']);
            this.obtenUsuarios();
            this.cancelarEditar();
          }
        });
    }
    else {
      this.openSnackBar("ERROR", "Debes llenar todos los campos");
    }
  }

  eliminarDialogo(usuario) {
    this.dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "¿Deseas eliminar a " + usuario.NOMBRE + "?";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminaUsuario(usuario.ID_USUARIO);
      }
      this.dialogRef = null;
    });
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      verticalPosition: 'top'
    });
  }


  getErrorMessage() {
    return this.email.hasError('required') ? 'El correo es obligatorio' :
      this.email.hasError('email') ? 'Correo no válido' : '';
  }

  getErrorMessage2() {
    return this.email2.hasError('required') ? 'El correo es obligatorio' :
      this.email2.hasError('email') ? 'Correo no válido' : '';
  }

  validaPermisos() {
    if (this.usuario.id_rol > 2) {
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

  restablecePass(usuario) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/restablecePassword.php', JSON.stringify({
      usuario: usuario, tkn: this.token
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          this.openSnackBar('ERROR', res['Error']);
        }
        else if (res['ErrorToken']) {
          this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
          setTimeout( () => { this.router.navigate(['/login']); }, 3000 );
        }
        else {
          this.openSnackBar('ÉXITO', 'El usuario ha sido notificado del cambio de su contraseña');
          this.obtenUsuarios();
        }
      });
  }

  nuevoUsuario(nuevo_usuario) {
    this.nuevo_usuario.correo = this.email.value;
    if (nuevo_usuario.nombre && nuevo_usuario.apellido && nuevo_usuario.puesto &&
      !this.getErrorMessage() && nuevo_usuario.departamento && nuevo_usuario.rol) {
      let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      this.http.post(this.servidor.nombre + '/apps/sicdoc/nuevoUsuario.php', JSON.stringify({
        usuario: this.nuevo_usuario, url: this.servidor.url, tkn: this.token
      }), {
        }).subscribe(res => {
          if (res['Error']) {
            this.openSnackBar('ERROR', res['Error']);
          }
          else if (res['ErrorToken']) {
            this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
            setTimeout( () => { this.router.navigate(['/login']); }, 3000 );
          }
          else {
            this.openSnackBar('ÉXITO', 'Usuario Creado correctamente');
            this.nuevo_usuario.nombre = null;
            this.nuevo_usuario.apellido = null;
            this.nuevo_usuario.puesto = null;
            this.email.setValue(null);
            this.nuevo_usuario.departamento = null;
            this.nuevo_usuario.rol = null;
            this.obtenUsuarios();
          }
        });
    }
    else {
      this.openSnackBar("ERROR", "Debes llenar todos los campos");
    }
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
          this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
          setTimeout( () => { this.router.navigate(['/login']); }, 3000 );
        }
        this.departamentos = res;
      });
  }

  obtenRoles() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenRolesActivos.php', JSON.stringify({
      tkn: this.token
    }), {
      }).subscribe(res => {
        if (res['ErrorToken']) {
          this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
          setTimeout( () => { this.router.navigate(['/login']); }, 3000 );
        }
        this.roles = res;
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
          this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
          setTimeout( () => { this.router.navigate(['/login']); }, 3000 );
        }
        this.usuarios = res;
        if (res) {
          this.total_usuarios = this.usuarios.length;
          this.dataSource = new MatTableDataSource(this.usuarios);
        }
        else {
          this.dataSource = null;
        }
      });
  }

  eliminaUsuario(id) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/bajaUsuario.php', JSON.stringify({
      id_usuario: id, tkn: this.token
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          this.openSnackBar('ERROR', res['Error']);
        }
        else if (res['ErrorToken']) {
          this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
          setTimeout( () => { this.router.navigate(['/login']); }, 3000 );
        }
        else {
          this.openSnackBar('ÉXITO', 'Usuario Eliminado correctamente');
          this.obtenUsuarios();
        }
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}