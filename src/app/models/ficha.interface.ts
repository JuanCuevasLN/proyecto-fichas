import { Time } from "@angular/common";
import { PersonaInvolucrada } from "./perfiles.interfaces";

export interface FichaDelitoData {
  id: string;
  titulo: string;
  horaDelSuceso: Time | string
  fechaSuceso: Date | string;
  fechaRegistro: Date | string;

  clasificacion: {
    tema: string;
    tipo: string;
  };

  descripcion: string;

  ubicacion: {
    estado: string;
    municipio: string;
    localidad?: string;
  };

  involucrados: {
    cartel?: string[];
    perfiles?: PersonaInvolucrada[];
    autoridades: string[];
  };

  evidencias: {
    imagenes?: string[];
    videos?: string[];
    documentos?: string[];
  };

  fuentes: string[];
  verificado: boolean;
}
