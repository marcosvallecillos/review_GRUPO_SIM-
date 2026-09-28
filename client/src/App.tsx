import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import NewCompany from "./pages/NewCompany";
import EditCompany from "./pages/EditCompany";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Empresas from "./pages/Empresas";
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Página pública */}
          <Route path="/r/:slug" element={<Home />} />

          {/* Administración */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />

          {/* Empresas */}
          <Route
            path="/admin/empresas/nueva"
            element={<NewCompany />}
          />

          <Route
            path="/admin/empresas/:id/editar"
            element={<EditCompany />}
          />
          <Route path="/admin/empresas" element={<Empresas />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}