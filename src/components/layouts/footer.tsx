export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col items-center gap-3 text-center text-sm text-slate-400">
          <div>
            © {new Date().getFullYear()} ⚽ Odds Comparador
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span>Mundial 2026</span>
            <span>•</span>
            <span>Cuotas actualizadas cada hora</span>
          </div>

          <div>
            Desarrollado con ❤️ por ludopatas como tú
          </div>
        </div>
      </div>
    </footer>
  );
}