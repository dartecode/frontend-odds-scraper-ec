import { Link, useParams } from "react-router-dom";
import PartidoDetalleContent from "../components/partidos/PartidoDetalleContent";

export default function PartidoDetalle() {
  const { id } = useParams();

  if (!id) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        Partido no encontrado
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <Link
          to="/"
          className="inline-block mb-6 text-sm text-slate-400 hover:text-green-400"
        >
          ← Volver a partidos
        </Link>

        <PartidoDetalleContent
          partidoId={Number(id)}
          mostrarEncabezado={true}
        />
      </div>
    </div>
  );
}