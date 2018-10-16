export class Documento {
    constructor(
      public id_documento?: number,
      public nombre?: string,
      public id_tipo?: string,
      public tipo?: string,
      public proceso?: string,
      public id_proceso?: string,
      public departamento?: string,
      public id_depto?: number,
      public codigo?: string,
      public fecha_inicio?: string,
      public fecha_fin?: string,
      public num_revisiones?: number,
      public revision?: number,
      public id_estado?: number,
      public ubicacion?: string,
      public ruta?: string,
      public observacion?: string,
      public estado?: string
    ) { }
  }