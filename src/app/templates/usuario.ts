export class Usuario {
    constructor(
      public id_usuario?: number,
      public nombre?: string,
      public apellido?: string,
      public puesto?: string,
      public correo?: string,
      public password?: string,
      public departamento?: string,
      public rol?: string,
      public estado?: string
    ) { }
  }