import { useEffect, useState } from "react";

type Props = {
  partidoId: number;
};

type CuotaCasa = {
  casa_apuesta: string;
  cuota: number;
  es_mejor?: boolean;
};

type Comparacion = {
  seleccion: string;
  seleccion_nombre: string;
  mejor_cuota: number;
  cuotas: CuotaCasa[];
};

type RespuestaComparador = {
  comparacion: Comparacion[];
};

const mercados = [
  { codigo: "1X2", nombre: "1X2" },
  { codigo: "OVER_UNDER", nombre: "Más/Menos" },
  { codigo: "AMBOS_MARCAN", nombre: "Ambos marcan" },
  { codigo: "DOBLE_OPORTUNIDAD", nombre: "Doble oportunidad" },
];

export default function DetalleCuotasInline({ partidoId }: Props) {
  const [mercadoActivo, setMercadoActivo] = useState("1X2");
  const [data, setData] = useState<RespuestaComparador | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function cargarDetalle() {
      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/comparador/partido/${partidoId}/mercado/${mercadoActivo}`
        );

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error cargando cuotas:", error);
      } finally {
        setLoading(false);
      }
    }

    cargarDetalle();
  }, [partidoId, mercadoActivo]);

    const casasUnicas = Array.from(
    new Set(
        data?.comparacion.flatMap((fila) =>
        fila.cuotas.map((cuota) => cuota.casa_apuesta)
        ) ?? []
    )
    );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {mercados.map((mercado) => (
          <button
            key={mercado.codigo}
            type="button"
            onClick={() => setMercadoActivo(mercado.codigo)}
            className={`
              rounded-xl
              px-4
              py-2
              font-bold
              border
              transition
              ${
                mercadoActivo === mercado.codigo
                  ? "bg-green-500 text-slate-950 border-green-500"
                  : "bg-slate-900 text-white border-slate-700 hover:border-green-500"
              }
            `}
          >
            {mercado.nombre}
          </button>
        ))}
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-400">
          Cargando cuotas...
        </div>
      )}

      {!loading && data && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full min-w-[850px] text-sm">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="px-4 py-4 text-left">Selección</th>

                {casasUnicas.map((casa) => (
                  <th key={casa} className="px-4 py-4 text-center">
                    {casa}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800 bg-slate-900">
              {data.comparacion.map((fila) => (
                <tr key={fila.seleccion}>
                  <td className="px-4 py-4 font-bold text-white">
                    {fila.seleccion_nombre}
                  </td>

                  {casasUnicas.map((casa) => {
                    const cuotaCasa = fila.cuotas.find(
                      (cuota) => cuota.casa_apuesta === casa
                    );

                    const esMejor =
                      cuotaCasa &&
                      Number(cuotaCasa.cuota) === Number(fila.mejor_cuota);

                    return (
                      <td key={casa} className="px-4 py-4 text-center">
                        {cuotaCasa ? (
                          <span
                            className={`
                              inline-block
                              rounded-lg
                              px-3
                              py-1
                              font-bold
                              ${
                                esMejor
                                  ? "bg-green-500/15 text-green-400"
                                  : "text-white"
                              }
                            `}
                          >
                            {cuotaCasa.cuota}
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && data && data.comparacion.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-400">
          No hay cuotas para este mercado.
        </div>
      )}
    </div>
  );
}