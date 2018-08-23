export class Usuario {
    constructor(
      public id_usuario?: number,
      public nombre?: string,
      public apellido?: string,
      public puesto?: string,
      public correo?: string,
      public password?: string,
      public id_departamento?: number,
      public departamento?: string,
      public rol?: string,
      public id_rol?: number,
      public estado?: string,
      public id_estado?: number
    ) { }
  }