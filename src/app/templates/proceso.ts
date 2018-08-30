export class Proceso {
    constructor(
      public id_proceso?: number,
      public nombre?: string,
      public departamento?: string,
      public id_departamento?: number,
      public estado?: string,
      public id_estado?: number
    ) { }
  }