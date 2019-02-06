import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Usuario } from "../templates/usuario";
import { Tipo } from "../templates/tipo";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { MatTableDataSource } from '@angular/material';
import { ConfirmationDialog } from "../confirmation-dialog/confirmation-dialog";
import { MatDialog, MatDialogRef } from '@angular/material';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-tipos-docs',
  templateUrl: './admin-tipos-docs.component.html',
  styleUrls: ['./admin-tipos-docs.component.css']
})
export class AdminTiposDocsComponent implements OnInit {

  dialogRef: MatDialogRef<ConfirmationDialog>;
  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  servidor = new Servidor();
  tipos: any;
  nuevo_tipo = new Tipo();
  total_tipos: number;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['TIPO', 'ADMINISTRACIÓN'];
  ver_editar: boolean;
  tipo_editar = new Tipo();
  token: string

  constructor(private router: Router, public snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
    this.validaLogin();
    this.validaPermisos();
    this.ver_editar = false;
    this.total_tipos = 0;
  }

  ngOnInit() {
    this.obtenTipos();
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

  editarTipo(tipo){
    this.tipo_editar.id_tipo = tipo.ID_TIPO;
    this.tipo_editar.tipo = tipo.TIPO;
    this.ver_editar = true;
  }

  cancelarEditar(){
    this.tipo_editar.id_tipo = null;
    this.tipo_editar.tipo = null;
    this.obtenTipos();
    this.ver_editar = false;
  }

  guardaEditarTipo(tipo_editar) {
    if (tipo_editar.tipo) {
      let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      this.http.post(this.servidor.nombre + '/apps/sicdoc/editaTipo.php', JSON.stringify({
        tipo: this.tipo_editar, tkn: this.token
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
            setTimeout( () => { this.router.navigate(['/login']); }, 3000 );
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

  validaPermisos() {
    if (this.usuario.id_rol != 1) {
      this.router.navigate(['/inicio']);
    }
  }

  obtenTipos() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenTipos.php', JSON.stringify({
      tkn: this.token
    }), {
      }).subscribe(res => {
        this.tipos = res;
        if(!res){
          this.dataSource = null;
          this.total_tipos = 0;
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
          this.total_tipos = this.tipos.length;
          this.dataSource = new MatTableDataSource(this.tipos);
        }
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      verticalPosition: 'top'
    });
  }

  eliminarDialogo(tipo) {
    this.dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "¿Deseas eliminar el tipo " + tipo.TIPO + "?";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminaTipo(tipo.ID_TIPO);
      }
      this.dialogRef = null;
    });
  }

  eliminaTipo(id) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    this.http.post(this.servidor.nombre + '/apps/sicdoc/bajaTipo.php', JSON.stringify({
      id_tipo: id, tkn: this.token
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
          setTimeout( () => { this.router.navigate(['/login']); }, 3000 );
        }
        else {
          swal({
            type: 'success',
            title: 'ÉXITO',
            text: res['Exito'],
            timer: 5000
          });
          //this.openSnackBar('ÉXITO', 'Tipo eliminado correctamente');
          this.obtenTipos();
        }
      });
  }

  nuevoTipo() {
    if (this.nuevo_tipo.tipo) {
      let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      });
      this.http.post(this.servidor.nombre + '/apps/sicdoc/nuevoTipo.php', JSON.stringify({
        tipo: this.nuevo_tipo, tkn: this.token
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
            setTimeout( () => { this.router.navigate(['/login']); }, 3000 );
          }
          else {
            swal({
              type: 'success',
              title: 'ÉXITO',
              text: res['Exito'],
              timer: 5000
            });
            //this.openSnackBar('ÉXITO', 'Tipo de documento creado correctamente');
            this.nuevo_tipo.tipo = null;
            this.obtenTipos();
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}