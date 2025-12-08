import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { FilmesPage } from "../pages/FilmesPage";
import { SalasPage } from "../pages/SalasPage";
import { SessoesPage } from "../pages/SessoesPage";
import { IngressosPage } from "../pages/IngressosPage";
import { ProgramacaoPage } from "../pages/ProgramacaoPage";
import { LanchesPage } from "../pages/LanchesPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/filmes" element={<FilmesPage />} />
      <Route path="/salas" element={<SalasPage />} />
      <Route path="/sessoes" element={<SessoesPage />} />
      <Route path="/ingressos" element={<IngressosPage />} />
      <Route path="/programacao" element={<ProgramacaoPage />} />
      <Route path="/lanches" element={<LanchesPage />} />
    </Routes>
  );
};
