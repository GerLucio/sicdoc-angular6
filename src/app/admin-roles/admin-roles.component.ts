import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Usuario } from "../templates/usuario";
import { Rol } from "../templates/rol";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { MatTableDataSource } from '@angular/material';
import { ConfirmationDialog } from "../confirmation-dialog/confirmation-dialog";
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.css']
})
export class AdminRolesComponent implements OnInit {

  dialogRef: MatDialogRef<ConfirmationDialog>;
  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  servidor = new Servidor();
  roles: any;
  nuevo_rol = new Rol();
  total_roles: number;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['ROL', 'ADMINISTRACIÓN'];
  ver_editar: boolean;
  rol_editar = new Rol();
  token: string

  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) { 
    this.validaLogin();
    this.validaPermisos();
    this.ver_editar = false;
    this.total_roles = 0;
  }

  ngOnInit() {
    this.obtenRoles();
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

  editarRol(rol){
    this.rol_editar.id_rol = rol.ID_ROL;
    this.rol_editar.rol = rol.ROL;
    this.ver_editar = true;
  }

  cancelarEditar(){
    this.rol_editar.id_rol = null;
    this.rol_editar.rol = null;
    this.obtenRoles();
    this.ver_editar = false;
  }

  guardaEditarRol(rol_editar) {
    if (rol_editar.rol) {
      let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      this.http.post(this.servidor.nombre + '/apps/sicdoc/editaRol.php', JSON.stringify({
        rol: this.rol_editar, tkn: this.token
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
            this.cancelarEditar();
          }
        });
    }
    else {
      this.openSnackBar("ERROR", "Debes llenar todos los campos");
    }
  }

  validaPermisos() {
    if (this.usuario.id_rol != 1) {
      this.router.navigate(['/inicio']);
    }
  }

  obtenRoles() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenRoles.php', JSON.stringify({
      tkn: this.token
    }), {
      }).subscribe(res => {
        this.roles = res;
        if(!res){
          this.dataSource = null;
          this.total_roles = 0;
        }
        else if (res['ErrorToken']) {
          this.openSnackBar('ERROR DE SESIÓN', 'Vuelve a iniciar sesión');
          setTimeout(() => { this.router.navigate(['/login']); }, 3000);
        }
        else if (res) {
          this.total_roles = this.roles.length;
          this.dataSource = new MatTableDataSource(this.roles);
        }
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      verticalPosition: 'top'
    });
  }

  eliminarDialogo(rol) {
    this.dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "¿Deseas eliminar el rol de usuario " + rol.ROL + "?";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminaRol(rol.ID_ROL);
      }
      this.dialogRef = null;
    });
  }

  eliminaRol(id) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/bajaRol.php', JSON.stringify({
      id_rol: id, tkn: this.token
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
          this.openSnackBar('ÉXITO', 'Rol de usuario eliminado correctamente');
          this.obtenRoles();
        }
      });
  }

  nuevoRol() {
    if (this.nuevo_rol.rol) {
      let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      this.http.post(this.servidor.nombre + '/apps/sicdoc/nuevoRol.php', JSON.stringify({
        rol: this.nuevo_rol, tkn: this.token
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
            this.openSnackBar('ÉXITO', 'Rol de usuario creado correctamente');
            this.nuevo_rol.rol = null;
            this.obtenRoles();
          }
        });
    }
    else {
      this.openSnackBar("ERROR", "Debes llenar todos los campos");
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
