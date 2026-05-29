import AppRouter from "./routes/AppRouter";
import Footer from "../src/components/layouts/footer";

export default function App() {

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <main className="flex-1">
        {<AppRouter />}
      </main>

      <Footer />
    </div>
  );
}