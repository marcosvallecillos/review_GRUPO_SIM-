import {
  ArrowLeft,
  Building2,
  ExternalLink,
  Plus,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Empresa = {
  id: string;
  nombre: string;
  slug: string;
  google_review_url: string;
  created_at: string;
};

export default function Empresas() {
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEmpresas();
  }, []);

  async function cargarEmpresas() {
    setLoading(true);

    const { data, error } = await supabase
      .from("empresas")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("EMPRESAS:", data);
    console.log("ERROR:", error);

    if (error) {
      console.error("Error cargando empresas:", error);
      setLoading(false);
      return;
    }

    setEmpresas(data ?? []);
    setLoading(false);
  }

  const empresasFiltradas = empresas.filter(
    (empresa) =>
      empresa.nombre.toLowerCase().includes(search.toLowerCase()) ||
      empresa.slug.toLowerCase().includes(search.toLowerCase())
  );

  async function eliminarEmpresa(id: string, nombre: string) {
    const confirmar = window.confirm(
      `¿Quieres eliminar "${nombre}"?`
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("empresas")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error eliminando:", error);
      alert("No se ha podido eliminar la empresa.");
      return;
    }

    setEmpresas((actuales) =>
      actuales.filter((empresa) => empresa.id !== id)
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/empresas/nueva")}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
          >
            <Plus size={17} />
            Nueva empresa
          </button>

        </div>
      </header>

      {/* CONTENIDO */}
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">

        <div className="mb-8">
          <p className="mb-1 text-sm font-medium text-teal-700 dark:text-teal-400">
            Administración
          </p>

          <h1 className="text-3xl font-semibold tracking-tight">
            Empresas
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Gestiona todas las empresas de tu plataforma.
          </p>
        </div>

        {/* BUSCADOR */}
        <div className="mb-5 relative max-w-md">

          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Buscar empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-800 dark:bg-slate-900"
          />

        </div>

        {/* LISTA */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          {loading ? (

            <div className="flex min-h-56 items-center justify-center">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-teal-700" />
            </div>

          ) : empresasFiltradas.length === 0 ? (

            <div className="flex min-h-64 flex-col items-center justify-center text-center">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800">
                <Building2 size={25} />
              </div>

              <h2 className="font-semibold">
                {search
                  ? "No se encontraron empresas"
                  : "No hay empresas"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? "Prueba con otro nombre."
                  : "Crea tu primera empresa para comenzar."}
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100 dark:divide-slate-800">

              {empresasFiltradas.map((empresa) => (

                <div
                  key={empresa.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400">
                      <Building2 size={20} />
                    </div>

                    <div>
                      <h3 className="font-medium">
                        {empresa.nombre}
                      </h3>

                      <p className="mt-0.5 text-sm text-slate-500">
                        /r/{empresa.slug}
                      </p>
                    </div>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() =>
                        window.open(
                          `/r/${empresa.slug}`,
                          "_blank"
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <ExternalLink size={15} />
                      Ver página
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/admin/empresas/${empresa.id}/editar`
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800"
                    >
                      <Settings size={15} />
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        eliminarEmpresa(
                          empresa.id,
                          empresa.nombre
                        )
                      }
                      className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </main>
  );
}