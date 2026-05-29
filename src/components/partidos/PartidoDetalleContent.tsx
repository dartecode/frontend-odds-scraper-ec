import { useEffect, useState } from "react";
import CuotaTable from "../cuotas/CuotaTable";
import { obtenerComparacion } from "../../services/cuotasService";
import type { ComparacionResponse } from "../../types/cuota";
import HistorialCuotasModal from "../cuotas/HistorialCuotasModal";
import { obtenerHistorialCuotas } from "../../services/cuotasService";
import type { HistorialCuota } from "../../types/cuota";

const mercados = [
  { codigo: "1X2", nombre: "1X2" },
  { codigo: "OVER_UNDER", nombre: "Más/Menos" },
  { codigo: "AMBOS_MARCAN", nombre: "Ambos marcan" },
  { codigo: "DOBLE_OPORTUNIDAD", nombre: "Doble oportunidad" },
];

type Props = {
  partidoId: number;
  mostrarEncabezado?: boolean;
};

export default function PartidoDetalleContent({
  partidoId,
  mostrarEncabezado = true,
}: Props) {
  const [data, setData] = useState<ComparacionResponse | null>(null);
  const [mercadoActivo, setMercadoActivo] = useState("1X2");
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [historial, setHistorial] = useState<HistorialCuota[]>([]);
  const [tituloHistorial, setTituloHistorial] = useState("");

  const verHistorial = async (
    seleccion: string,
    seleccionNombre: string,
    linea?: number | null
  ) => {
    const data = await obtenerHistorialCuotas(
      partidoId,
      mercadoActivo,
      seleccion,
      linea
    );

    setHistorial(data);
    setTituloHistorial(`${seleccionNombre}${linea ? ` - Línea ${linea}` : ""}`);
    setMostrarHistorial(true);
  };

  useEffect(() => {
    async function cargarComparacion() {
      setData(null);

      try {
        const response = await obtenerComparacion(partidoId, mercadoActivo);
        setData(response);
      } catch (error) {
        console.error("Error cargando comparación:", error);
      }
    }

    cargarComparacion();
  }, [partidoId, mercadoActivo]);

  const normalizarTextoOrden = (texto: string = "") => {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };

  const obtenerLinea = (item: any) => {
    if (item.linea !== null && item.linea !== undefined) {
      return Number(item.linea);
    }

    const match = item.seleccion_nombre?.match(/(\d+(\.\d+)?)/);
    return match ? Number(match[1]) : 0;
  };

  const obtenerOrdenOverUnder = (item: any) => {
    const nombre = normalizarTextoOrden(item.seleccion_nombre);
    const seleccion = normalizarTextoOrden(item.seleccion);

    if (nombre.includes("mas") || seleccion === "over") {
      return 1;
    }

    if (nombre.includes("menos") || seleccion === "under") {
      return 2;
    }

    return 3;
  };

  const obtenerOrdenMercado = (item: any) => {
    const seleccion = normalizarTextoOrden(item.seleccion);
    const nombre = normalizarTextoOrden(item.seleccion_nombre);

    if (mercadoActivo === "1X2") {
      if (seleccion === "local" || nombre.includes("local")) return 1;
      if (seleccion === "empate" || nombre.includes("empate")) return 2;
      if (seleccion === "visitante" || nombre.includes("visitante")) return 3;
      return 99;
    }

    if (mercadoActivo === "AMBOS_MARCAN") {
      if (seleccion === "si" || nombre === "si" || nombre.includes("si")) return 1;
      if (seleccion === "no" || nombre === "no" || nombre.includes("no")) return 2;
      return 99;
    }

    if (mercadoActivo === "DOBLE_OPORTUNIDAD") {
      if (
        seleccion === "1x" ||
        nombre === "1x" ||
        nombre.includes("local o empate") ||
        nombre.includes("1 o empate")
      ) {
        return 1;
      }

      if (
        seleccion === "2x" ||
        seleccion === "x2" ||
        nombre === "2x" ||
        nombre === "x2" ||
        nombre.includes("visitante o empate") ||
        nombre.includes("2 o empate")
      ) {
        return 2;
      }

      if (
        seleccion === "12" ||
        nombre === "12" ||
        nombre.includes("local o visitante") ||
        nombre.includes("1 o 2")
      ) {
        return 3;
      }

      return 99;
    }

    return 99;
  };

  const comparacionOrdenada =
    mercadoActivo === "OVER_UNDER"
      ? [...(data?.comparacion ?? [])].sort((a, b) => {
        const lineaA = obtenerLinea(a);
        const lineaB = obtenerLinea(b);

        if (lineaA !== lineaB) {
          return lineaA - lineaB;
        }

        return obtenerOrdenOverUnder(a) - obtenerOrdenOverUnder(b);
      })
      : [...(data?.comparacion ?? [])].sort((a, b) => {
        return obtenerOrdenMercado(a) - obtenerOrdenMercado(b);
      });

  return (
    <>
      {mostrarEncabezado && data && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 mb-6">
          <p className="text-sm text-slate-400 mb-3">Mundial 2026</p>

          <h1 className="text-3xl font-bold">
            {data.partido.equipo_local} vs {data.partido.equipo_visitante}
          </h1>

          <p className="text-slate-400 mt-2">
            {data.partido.fecha_partido}
          </p>
        </div>
      )}

      <div
        className="
          sticky
          top-[120px]
          z-10
          -mx-4
          px-4
          py-3
          mb-4
          flex
          gap-2
          overflow-x-auto
          scrollbar-hide
          bg-slate-950/95
          backdrop-blur
          md:static
          md:mx-0
          md:px-0
          md:py-0
          md:mb-6
          md:flex-wrap
          md:bg-transparent
        "
      >
        {mercados.map((mercado) => (
          <button
            key={mercado.codigo}
            type="button"
            onClick={() => setMercadoActivo(mercado.codigo)}
            className={`shrink-0 px-4 py-2 rounded-xl font-semibold transition ${mercadoActivo === mercado.codigo
              ? "bg-green-500 text-slate-950"
              : "bg-slate-900 border border-slate-800 text-white hover:border-green-500"
              }`}
          >
            {mercado.nombre}
          </button>
        ))}
      </div>



      {!data ? (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-6">
          Cargando cuotas...
        </div>
      ) : (
        <CuotaTable
          comparacion={data.comparacion}
          onVerHistorial={verHistorial}
        />
      )}

      <HistorialCuotasModal
        abierto={mostrarHistorial}
        onCerrar={() => setMostrarHistorial(false)}
        historial={historial}
        titulo={tituloHistorial}
      />
    </>
  );
}