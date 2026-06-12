import type { ComparacionSeleccion } from "../../types/cuota";

interface Props {
  comparacion: ComparacionSeleccion[];
  onVerHistorial: (
    seleccion: string,
    seleccionNombre: string,
    linea?: number | null
  ) => void;
}

export default function CuotaTable({ comparacion, onVerHistorial }: Props) {
  const casas = Array.from(
    new Set(
      comparacion.flatMap((item) =>
        item.cuotas.map((cuota) => cuota.casa_apuesta)
      )
    )
  );

  const obtenerOrden = (item: ComparacionSeleccion) => {
    const seleccion = item.seleccion?.toUpperCase();
    const nombre = item.seleccion_nombre?.toUpperCase();
    const linea = item.linea ?? 0;

    // 1X2: Local, Empate, Visitante
    if (seleccion === "LOCAL" || seleccion === "1") return 10;
    if (seleccion === "EMPATE" || seleccion === "X") return 20;
    if (seleccion === "VISITANTE" || seleccion === "2") return 30;

    // Más/Menos: Over 1.5, Under 1.5, Over 2.5, Under 2.5...
    if (seleccion.includes("OVER") || nombre.includes("OVER") || nombre.includes("MÁS")) {
      return 100 + linea * 10 + 1;
    }

    if (seleccion.includes("UNDER") || nombre.includes("UNDER") || nombre.includes("MENOS")) {
      return 100 + linea * 10 + 2;
    }

    // Ambos marcan: Sí, No
    if (seleccion === "YES" || seleccion === "SI" || seleccion === "SÍ" || nombre === "SI" || nombre === "SÍ") {
      return 200;
    }

    if (seleccion === "NO" || nombre === "NO") {
      return 210;
    }

    // Doble oportunidad:
    // Local o empate, Empate o visitante, Local o visitante
    if (
      seleccion === "HOME_DRAW" ||
      seleccion === "1X" ||
      nombre.includes("LOCAL O EMPATE")
    ) {
      return 300;
    }

    if (
      seleccion === "DRAW_AWAY" ||
      seleccion === "X2" ||
      nombre.includes("EMPATE O VISITANTE")
    ) {
      return 310;
    }

    if (
      seleccion === "HOME_AWAY" ||
      seleccion === "12" ||
      nombre.includes("LOCAL O VISITANTE")
    ) {
      return 320;
    }

    return 999;
  };

  const comparacionOrdenada = [...comparacion].sort((a, b) => {
    return obtenerOrden(a) - obtenerOrden(b);
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800">
      <table className="w-full min-w-[850px]">
        <thead>
          <tr className="bg-slate-800">
            <th className="p-4 text-left">Selección</th>

            {casas.map((casa) => (
              <th key={casa} className="p-4 text-center">
                {casa}
              </th>
            ))}

            <th className="px-4 py-3 text-left">Historial</th>
          </tr>
        </thead>

        <tbody>
          {comparacionOrdenada.map((item) => (
            <tr
              key={`${item.seleccion}-${item.linea ?? "sin-linea"}`}
              className="border-b border-slate-800"
            >
              <td className="p-4 font-semibold">
                {item.linea !== null
                  ? `${item.seleccion_nombre} ${item.linea}`
                  : item.seleccion_nombre}
              </td>

              {casas.map((casa) => {
                const cuota = item.cuotas.find(
                  (q) => q.casa_apuesta === casa
                );

                return (
                  <td key={casa} className="p-4 text-center">
                    {cuota ? (
                      <span
                        title={`Actualizada: ${new Date(
                          cuota.fecha_captura
                        ).toLocaleTimeString("es-EC")}`}
                        className={`font-bold cursor-help ${cuota.es_mejor ? "text-green-400" : "text-white"
                          }`}
                      >
                        {cuota.cuota}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                );
              })}

              <td className="p-4 text-center">
                <button
                  onClick={() =>
                    onVerHistorial(
                      item.seleccion,
                      item.seleccion_nombre,
                      item.linea
                    )
                  }
                  className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-bold text-emerald-400 hover:bg-slate-700"
                >
                  Ver historial
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}