import { useEffect, useState } from "react";
import { obtenerPartidos } from "../services/partidosService";
import type { Partido } from "../types/partido";
import PartidoDetalleContent from "../components/partidos/PartidoDetalleContent";

export default function Home() {
  const [busqueda, setBusqueda] = useState("");
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [partidoAbiertoId, setPartidoAbiertoId] = useState<number | null>(null);
  const [loadingPartidos, setLoadingPartidos] = useState(true);
  const TIME_ZONE = "America/Guayaquil";


  useEffect(() => {
    async function cargarPartidos() {
      try {
        setLoadingPartidos(true);

        const data = await obtenerPartidos();
        setPartidos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingPartidos(false);
      }
    }

    cargarPartidos();
  }, []);

  function normalizarTexto(texto: string) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }


  function parseFechaUTC(fecha: string) {
    const normalizada = fecha.replace(" ", "T");

    if (
      normalizada.endsWith("Z") ||
      normalizada.includes("+") ||
      normalizada.match(/-\d{2}:\d{2}$/)
    ) {
      return new Date(normalizada);
    }

    return new Date(`${normalizada}Z`);
  }

  function obtenerFecha(fecha: string) {
    const date = parseFechaUTC(fecha);

    const partes = new Intl.DateTimeFormat("en-CA", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);

    const year = partes.find((p) => p.type === "year")?.value;
    const month = partes.find((p) => p.type === "month")?.value;
    const day = partes.find((p) => p.type === "day")?.value;

    return `${year}-${month}-${day}`;
  }

  function formatearFecha(fecha: string) {
    return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-EC", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function formatearHora(fecha: string) {
    return parseFechaUTC(fecha).toLocaleTimeString("es-EC", {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatearFechaCorta(fecha: string) {
    return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "short",
    });
  }

  const ahora = new Date();

  const partidosFiltrados = partidos.filter((partido) => {
    const texto = normalizarTexto(
      `${partido.equipo_local} ${partido.equipo_visitante}`
    );

    const coincideBusqueda = texto.includes(normalizarTexto(busqueda));

    const fechaPartido = obtenerFecha(partido.fecha_partido);
    const fechaHoraPartido = parseFechaUTC(partido.fecha_partido);

    const coincideFecha =
      fechaSeleccionada === "" || fechaPartido === fechaSeleccionada;

    const aunNoInicia = fechaHoraPartido.getTime() > ahora.getTime();

    return coincideBusqueda && coincideFecha && aunNoInicia;
  });

  const partidosOrdenados = [...partidosFiltrados].sort((a, b) => {
    return (
      new Date(a.fecha_partido.replace(" ", "T")).getTime() -
      new Date(b.fecha_partido.replace(" ", "T")).getTime()
    );
  });

  const partidosAgrupados = partidosOrdenados.reduce<Record<string, Partido[]>>(
    (grupos, partido) => {
      const fecha = obtenerFecha(partido.fecha_partido);

      if (!grupos[fecha]) {
        grupos[fecha] = [];
      }

      grupos[fecha].push(partido);

      return grupos;
    },
    {}
  );

  const fechasDisponibles = Array.from(
    new Set(
      partidos
        .filter((partido) => {
          const fechaHoraPartido = parseFechaUTC(partido.fecha_partido);
          return fechaHoraPartido.getTime() > ahora.getTime();
        })
        .map((partido) => obtenerFecha(partido.fecha_partido))
        .filter(Boolean)
    )
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-3 py-4 md:p-6">
        <div className="mb-5 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-1">
            Comparador de Cuotas
          </h1>

          <p className="text-sm md:text-base text-slate-400">
            Mundial 2026
          </p>
        </div>

        <div
          className="
    sticky
    top-0
    z-20
    -mx-3
    px-3
    py-3
    mb-5
    bg-slate-950/95
    backdrop-blur
    border-b
    border-slate-900
    md:static
    md:mx-0
    md:px-0
    md:py-0
    md:mb-8
    md:bg-transparent
    md:border-b-0
  "
        >
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Buscar equipo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="
        flex-1
        rounded-xl
        bg-slate-900
        border
        border-slate-800
        px-4
        py-3
        text-white
        text-sm
        md:text-base
        outline-none
        focus:border-green-500
      "
            />

            <div className="flex gap-3">
              <input
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                className="
          min-w-0
          flex-1
          rounded-xl
          bg-slate-900
          border
          border-slate-800
          px-4
          py-3
          text-white
          text-sm
          md:text-base
          outline-none
          focus:border-green-500
        "
              />

              {fechaSeleccionada && (
                <button
                  type="button"
                  onClick={() => setFechaSeleccionada("")}
                  className="
            shrink-0
            rounded-xl
            bg-slate-800
            px-4
            py-3
            text-sm
            font-semibold
            hover:bg-slate-700
          "
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>


        {!loadingPartidos && fechasDisponibles.length > 0 && (
          <div className="mb-8">
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() => setFechaSeleccionada("")}
                className={`
                  shrink-0
                  rounded-xl
                  px-4
                  py-2
                  text-sm
                  font-bold
                  transition
                  ${fechaSeleccionada === ""
                    ? "bg-green-500 text-slate-950"
                    : "bg-slate-900 border border-slate-800 text-white hover:border-green-500"
                  }
                `}
              >
                Todos
              </button>

              {fechasDisponibles.map((fecha) => (
                <button
                  key={fecha}
                  type="button"
                  onClick={() => setFechaSeleccionada(fecha)}
                  className={`
                    shrink-0
                    rounded-xl
                    px-4
                    py-2
                    text-sm
                    font-bold
                    transition
                    ${fechaSeleccionada === fecha
                      ? "bg-green-500 text-slate-950"
                      : "bg-slate-900 border border-slate-800 text-white hover:border-green-500"
                    }
                  `}
                >
                  {formatearFechaCorta(fecha)}
                </button>
              ))}
            </div>
          </div>
        )}

        {!loadingPartidos && Object.keys(partidosAgrupados).length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            No se encontraron partidos
          </div>
        )}

        <div className="space-y-6">
          {Object.entries(partidosAgrupados).map(([fecha, partidos]) => (
            <section
              key={fecha}
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-800
                bg-slate-900
              "
            >
              <div
                className="
                  bg-slate-800/80
                  px-4
                  py-3
                  border-b
                  border-slate-700
                "
              >
                <h2 className="text-sm md:text-base font-bold capitalize text-slate-100">
                  {formatearFecha(fecha)}
                </h2>
              </div>
              <div className="divide-y divide-slate-800">
                {partidos.map((partido) => (
                  <div key={partido.partido_id}>
                    <button
                      type="button"
                      onClick={() =>
                        setPartidoAbiertoId((actual) =>
                          actual === partido.partido_id ? null : partido.partido_id
                        )
                      }
                      className={`
                        group
                        w-full
                        grid
                        grid-cols-[64px_1fr_auto]
                        md:grid-cols-[80px_1fr_auto]
                        gap-3
                        items-center
                        px-4
                        py-4
                        text-left
                        transition
                        ${partidoAbiertoId === partido.partido_id
                          ? "bg-slate-800/90 border-l-4 border-green-500"
                          : "hover:bg-slate-800/70"
                        }
                      `}
                    >
                      <div className="text-sm font-bold text-slate-400">
                        {formatearHora(partido.fecha_partido)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-col gap-1">
                          <div className="font-semibold text-white truncate">
                            {partido.equipo_local}
                          </div>

                          <div className="font-semibold text-white truncate">
                            {partido.equipo_visitante}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        <span
                          className="
                            text-green-400
                            font-semibold
                            text-sm
                            opacity-80
                            group-hover:opacity-100
                            whitespace-nowrap
                          "
                        >
                          {partidoAbiertoId === partido.partido_id
                            ? "Ocultar cuotas ↑"
                            : "Ver cuotas ↓"}
                        </span>
                      </div>
                    </button>

                    {partidoAbiertoId === partido.partido_id && (
                      <div className="border-t border-slate-800 bg-slate-950/60 px-4 py-5">
                        <PartidoDetalleContent
                          partidoId={partido.partido_id}
                          mostrarEncabezado={false}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}