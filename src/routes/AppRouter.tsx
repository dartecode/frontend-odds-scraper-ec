import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import PartidoDetalle from "../pages/PartidoDetalle";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/partido/:id" element={<PartidoDetalle />} />
      </Routes>
    </BrowserRouter>
  );
}