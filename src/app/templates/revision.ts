export class Revision {
    constructor(
      public id_revision?: number,
      public documento?: string,
      public id_documento?: number,
      public responsable?: string,
      public id_responsable?: number,
      public fecha_revision?: string,
      public vigente?: string,
      public id_vigente?: number,
      public observacion?: string,
      public ruta?: string
    ) { }
  }