export interface Cuota {
  casa_apuesta: string;
  cuota: number;
  fecha_captura: string;
  es_mejor: boolean;
}

export interface ComparacionSeleccion {
  seleccion: string;
  seleccion_nombre: string;
  linea: number | null;
  cuotas: Cuota[];
  mejor_cuota: number;
  mejor_casa: string;
  mejores_casas: string[];
  cuota_promedio: number;
  diferencia_vs_promedio: number;
  porcentaje_ventaja: number;
}

export interface ComparacionResponse {
  partido: {
    partido_id: number;
    equipo_local: string;
    equipo_visitante: string;
    fecha_partido: string;
  };

  mercado: {
    codigo: string;
    nombre: string;
  };

  comparacion: ComparacionSeleccion[];
}

export type HistorialCuota = {
  partido_id: number;
  equipo_local: string;
  equipo_visitante: string;
  fecha_partido: string;
  mercado: string;
  mercado_nombre: string;
  seleccion: string;
  seleccion_nombre: string;
  linea: number | null;
  cuota: number;
  casa_apuesta: string;
  fecha_captura: string;
};