export async function obtenerHistorialCuotas(
  partidoId: number,
  mercado: string
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/comparador/partido/${partidoId}/mercado/${mercado}/historial`
  );

  if (!res.ok) {
    throw new Error("Error obteniendo historial de cuotas");
  }

  return res.json();
}