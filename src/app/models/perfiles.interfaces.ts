export interface PersonaInvolucrada {
  nombre: string;
  alias: string;
  edad: number | null;
  foto?: string;
  organizacion: string; // o cartel
  rol: 'Delincuente' | 'Víctima' | 'Autoridad' | 'Testigo';
  estatus: 'Fallecido' | 'Capturado' | 'Prófugo' | 'Herido' | 'Activo' | 'Desconocido';
  genero?: 'Masculino' | 'Femenino' | 'Otro';

  informacion: {
    propiedades: Domicilio[];
    pertenencias: Vehiculo[];
    notas?: string; // campo opcional libre para registrar info adicional
  };
}

export interface Domicilio {
  estado: string;
  municipio: string;
  localidad?: string;
  colonia?: string;
  calle: string;
  numeroExterior?: number;
  numeroInterior?: number;
  cp?: string; // Código Postal
  referencias?: string; // "cerca del mercado", "frente a la plaza", etc.
}

export interface Vehiculo {
  marca: string;
  modelo?: string;
  color?: string;
  placas: string;
  tipo: 'Automóvil' | 'Motocicleta' | 'Camioneta' | 'Camión' | 'Otro';
  año?: number;
  serie?: string; // Número de serie o VIN
  estadoRegistro?: string; // Estado donde está registrado
  observaciones?: string; // Notas, detalles, características especiales
}
