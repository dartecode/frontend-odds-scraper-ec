import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import type { HistorialCuota } from "../../types/cuota";

type Props = {
    abierto: boolean;
    onCerrar: () => void;
    historial: HistorialCuota[];
    titulo: string;
};

const coloresCasa: Record<string, string> = {
    "Bet593": "#22c55e",
    "Betano": "#f59e0b",
    "Databet": "#3b82f6",
    "Ecuabet": "#ef4444",
    "Forbet": "#a855f7",
    "La TriBet": "#06b6d4",
    "Sorti": "#ec4899",
    "Ambos Marcan": "#84cc16",
};

const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function HistorialCuotasModal({
    abierto,
    onCerrar,
    historial,
    titulo,
}: Props) {
    if (!abierto) return null;

    const casas = Array.from(
        new Set(historial.map((item) => item.casa_apuesta))
    );

    const fechas = Array.from(
        new Set(historial.map((item) => item.fecha_captura))
    );

    const [casasSeleccionadas, setCasasSeleccionadas] = useState<string[]>([]);

    useEffect(() => {
        if (casas.length > 0) {
            setCasasSeleccionadas([casas[0]]);
        }
    }, [abierto, historial]);

    const data = fechas.map((fecha) => {
        const row: Record<string, string | number> = {
            fecha: formatearFecha(fecha),
        };

        casas.forEach((casa) => {
            const cuota = historial.find(
                (item) =>
                    item.fecha_captura === fecha &&
                    item.casa_apuesta === casa
            );

            if (cuota) {
                row[casa] = Number(cuota.cuota);
            }
        });

        return row;
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-6xl rounded-2xl border border-slate-700 bg-slate-950 p-5">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Historial de cuotas
                        </h2>
                        <p className="text-sm text-slate-400">{titulo}</p>
                    </div>

                    <button
                        onClick={onCerrar}
                        className="rounded-lg bg-slate-800 px-4 py-2 font-semibold text-white hover:bg-slate-700"
                    >
                        Cerrar
                    </button>
                </div>

                {historial.length === 0 ? (
                    <p className="text-slate-300">
                        No hay historial disponible para esta selección.
                    </p>
                ) : (
                    <>
                        <div className="mb-4 flex flex-wrap gap-2">
                            {casas.map((casa) => (
                                <button
                                    key={casa}
                                    onClick={() => setCasasSeleccionadas([casa])}
                                    className={`rounded-full px-3 py-1 text-sm font-semibold ${casasSeleccionadas.includes(casa)
                                        ? "bg-emerald-500 text-slate-950"
                                        : "bg-slate-800 text-slate-300"
                                        }`}
                                >
                                    {casa}
                                </button>
                            ))}
                        </div>

                        <div className="h-[420px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <XAxis dataKey="fecha" minTickGap={70} />
                                    <YAxis domain={["auto", "auto"]} />
                                    <Tooltip />
                                    <Legend />

                                    {casasSeleccionadas.map((casa) => (
                                        <Line
                                            key={casa}
                                            type="stepAfter"
                                            dataKey={casa}
                                            stroke={coloresCasa[casa] ?? "#ffffff"}
                                            strokeWidth={3}
                                            dot={false}
                                            activeDot={{ r: 5 }}
                                            connectNulls
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}