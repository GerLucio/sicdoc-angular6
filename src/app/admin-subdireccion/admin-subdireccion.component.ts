import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Usuario } from "../templates/usuario";
import { Subdireccion } from "../templates/subdireccion";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { MatTableDataSource } from '@angular/material';
import { ConfirmationDialog } from "../confirmation-dialog/confirmation-dialog";
import { MatDialog, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-admin-subdireccion',
  templateUrl: './admin-subdireccion.component.html',
  styleUrls: ['./admin-subdireccion.component.css']
})
export class AdminSubdireccionComponent implements OnInit {

  dialogRef: MatDialogRef<ConfirmationDialog>;
  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  servidor = new Servidor();
  subdirecciones: any;
  nueva_sub = new Subdireccion();
  total_sub: number;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['SUBDIRECCIÓN', 'ADMINISTRACIÓN'];

  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
    this.validaLogin();
    this.validaPermisos();
  }

  ngOnInit() {
    this.obtenSubdirecciones();
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
    }
  }

  validaPermisos() {
    if (this.usuario.id_rol != 1) {
      this.router.navigate(['/inicio']);
    }
  }

  obtenSubdirecciones() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.get(this.servidor.nombre + '/apps/sicdoc/obtenSubdirecciones.php')
      .subscribe(res => {
        this.subdirecciones = res;
        if (res) {
          this.total_sub = this.subdirecciones.length;
          this.dataSource = new MatTableDataSource(this.subdirecciones);
        }
        else{
          this.dataSource = null;
        }
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  eliminarDialogo(sub) {
    this.dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "¿Deseas eliminar la subdirección " + sub.NOMBRE + "?";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminaSubdireccion(sub.ID_SUBDIRECCION);
      }
      this.dialogRef = null;
    });
  }

  eliminaSubdireccion(id) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/bajaSubdireccion.php', JSON.stringify({
      id_subdireccion: id
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          this.openSnackBar('ERROR', res['Error']);
        }
        else {
          this.openSnackBar('ÉXITO', 'Subdirección eliminada correctamente');
          this.obtenSubdirecciones();
        }
      });
  }

  nuevaSubdireccion() {
    if (this.nueva_sub.nombre) {
      let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      this.http.post(this.servidor.nombre + '/apps/sicdoc/nuevaSubdireccion.php', JSON.stringify({
        subdireccion: this.nueva_sub
      }), {
        }).subscribe(res => {
          if (res['Error']) {
            this.openSnackBar('ERROR', res['Error']);
          }
          else {
            this.openSnackBar('ÉXITO', res['Exito']);
            this.nueva_sub.nombre = null;
            this.obtenSubdirecciones();
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