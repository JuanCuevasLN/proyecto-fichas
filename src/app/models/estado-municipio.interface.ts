export interface Estado {
  clave: string;
  nombre: string;
}

export type NombreEstado =
  | 'AGUASCALIENTES'
  | 'BAJA CALIFORNIA'
  | 'BAJA CALIFORNIA SUR'
  | 'CAMPECHE'
  | 'CHIAPAS'
  | 'CHIHUAHUA'
  | 'CIUDAD DE MÉXICO'
  | 'COAHUILA'
  | 'COLIMA'
  | 'DURANGO'
  | 'ESTADO DE MÉXICO'
  | 'GUANAJUATO'
  | 'GUERRERO'
  | 'HIDALGO'
  | 'JALISCO'
  | 'MICHOACÁN'
  | 'MORELOS'
  | 'NAYARIT'
  | 'NUEVO LEÓN'
  | 'OAXACA'
  | 'PUEBLA'
  | 'QUERÉTARO'
  | 'QUINTANA ROO'
  | 'SAN LUIS POTOSÍ'
  | 'SINALOA'
  | 'SONORA'
  | 'TABASCO'
  | 'TAMAULIPAS'
  | 'TLAXCALA'
  | 'VERACRUZ'
  | 'YUCATÁN'
  | 'ZACATECAS';

export type MunicipiosPorEstado = {
  [estado in NombreEstado]: string[];
};
