import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Usuario } from "../templates/usuario";
import { Departamento } from "../templates/departamento";
import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { MatTableDataSource } from '@angular/material';
import { ConfirmationDialog } from "../confirmation-dialog";
import { MatDialog, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {

  dialogRef: MatDialogRef<ConfirmationDialog>;

  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  nuevo_usuario = new Usuario();
  email = new FormControl('', [Validators.required, Validators.email]);
  departamentos: any;
  roles: any;
  usuarios: any;
  total_usuarios: number;
  dataSource = new MatTableDataSource();
  servidor = new Servidor();
  displayedColumns: string[] = ['NOMBRE', 'CORREO', 'PUESTO', 'DEPARTAMENTO', 'ROL', 'ELIMINAR'];


  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
    this.login = JSON.parse(localStorage.getItem('Loggedin'));
    if (this.login) {
      this.setUsuario = JSON.parse(localStorage.getItem('usuario'));
      this.usuario.id_usuario = this.setUsuario.ID_USUARIO;
      this.usuario.nombre = this.setUsuario.NOMBRE;
      this.usuario.puesto = this.setUsuario.PUESTO;
      this.usuario.correo = this.setUsuario.CORREO;
      this.usuario.departamento = this.setUsuario.DEPARTAMENTO;
      this.usuario.rol = this.setUsuario.ROL;
    }
  }

  ngOnInit() {
    this.obtenDepartamentos();
    this.obtenRoles();
    this.obtenUsuarios();
  }

  openConfirmationDialog(usuario) {
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
      duration: 5000,
    });
  }


  getErrorMessage() {
    return this.email.hasError('required') ? 'El correo es obligatorio' :
      this.email.hasError('email') ? 'Correo no válido' :
        '';
  }

  eliminaUsuario(id) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/bajaUsuario.php', JSON.stringify({
      id_usuario: id
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          this.openSnackBar('ERROR', res['Error']);
        }
        else {
          this.openSnackBar('Exito', 'Usuario Eliminado correctamente');
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
        usuario: this.nuevo_usuario, url: this.servidor.url
      }), {
        }).subscribe(res => {
          if (res['Error']) {
            this.openSnackBar('ERROR', res['Error']);
          }
          else {
            this.openSnackBar('Exito', 'Usuario Creado correctamente');
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
    this.http.get(this.servidor.nombre + '/apps/sicdoc/obtenDepartamentosActivos.php')
      .subscribe(res => {
        this.departamentos = res;
      });
  }

  obtenRoles() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.get(this.servidor.nombre + '/apps/sicdoc/obtenRolesActivos.php')
      .subscribe(res => {
        this.roles = res;
      });
  }

  obtenUsuarios() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.get(this.servidor.nombre + '/apps/sicdoc/obtenUsuariosActivos.php')
      .subscribe(res => {
        this.usuarios = res;
        this.total_usuarios = this.usuarios.length;
        this.dataSource = new MatTableDataSource(this.usuarios);
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}