import { Component, OnInit } from '@angular/core';
import { Usuario } from "../templates/usuario";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Servidor } from "../templates/servidor";
import { MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';

@Component({
  selector: 'app-consulta-pc-po',
  templateUrl: './consulta-pc-po.component.html',
  styleUrls: ['./consulta-pc-po.component.css']
})
export class ConsultaPcPoComponent implements OnInit {
  login: boolean = false;
  setUsuario: any;
  usuario = new Usuario();
  token: string;
  servidor = new Servidor();
  documentos: any;
  total_documentos: number;
  dataSource = new MatTableDataSource();
  ver_nuevo: boolean;
  displayedColumns: string[] = ['CODIGO', 'NOMBRE', 'PROCESO', 'DEPARTAMENTO', 'TIPO', 'FECHA', 'VER'];

  constructor(private router: Router, private http: HttpClient) {
    this.validaLogin();
    this.validaPermisos();
    this.ver_nuevo = false;
    this.total_documentos = 0;
  }

  ngOnInit() {
    this.obtenDocumentos();
  }

  ver_documento(documento) {
    //window.open(this.servidor.nombre + '/apps/sicdoc/files/' + documento.RUTA,
    window.open(this.servidor.nombre + '/apps/sicdoc/verArchivo.php?file=' + documento.RUTA,
      "resizable=yes,scrollbars=no,status=no,toolbar=no,menubar=no,titlebar=no");
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

  validaPermisos() {
    if (this.usuario.id_rol < 1 && this.usuario.id_rol > 3) {
      this.router.navigate(['/inicio']);
    }
  }

  obtenDocumentos() {
    this.http.post(this.servidor.nombre + '/apps/sicdoc/obtenDocumentosPC_PO.php', JSON.stringify({
      tkn: this.token, departamento: this.usuario.id_departamento, depto: this.usuario.departamento, rol: this.usuario.id_rol
    }), {
      }).subscribe(res => {
        this.documentos = res;
        if (!res) {
          this.dataSource = null;
          this.total_documentos = 0;
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
          this.total_documentos = this.documentos.length;
          this.dataSource = new MatTableDataSource(this.documentos);
        }
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
