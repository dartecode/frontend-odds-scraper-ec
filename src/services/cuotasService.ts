import api from "../api/axios";
import type { ComparacionResponse, HistorialCuota } from "../types/cuota";

export async function obtenerComparacion(
  partidoId: number,
  mercado: string
): Promise<ComparacionResponse> {
  const response = await api.get(
    `/comparador/partido/${partidoId}/mercado/${encodeURIComponent(
      mercado
    )}/cuotas`
  );

  return response.data;
}

export async function obtenerHistorialCuotas(
  partidoId: number,
  mercado: string,
  seleccion?: string,
  linea?: number | null
): Promise<HistorialCuota[]> {
  const params = new URLSearchParams();

  if (seleccion) {
    params.append("seleccion", seleccion);
  }

  if (linea !== null && linea !== undefined) {
    params.append("linea", String(linea));
  }

  const url = `${import.meta.env.VITE_API_URL}/comparador/partido/${partidoId}/mercado/${mercado}/historial?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Error obteniendo historial de cuotas");
  }

  return response.json();
}