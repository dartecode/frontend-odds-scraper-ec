import api from "../api/axios";
import type { Partido } from "../types/partido";

export async function obtenerPartidos(): Promise<Partido[]> {
  const response = await api.get("/partidos");
  return response.data;
}