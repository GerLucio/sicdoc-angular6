export class Departamento {
    constructor(
      public id_departamento?: number,
      public nombre?: string,
      public lider?: string,
      public id_lider?: number,
      public subdireccion?: string,
      public id_subdireccion?: number,
      public estado?: string,
      public id_estado?: number
    ) { }
  }