import {
  Building2,
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Star,
  Users,
  X,
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

export default function Dashboard() {
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    cargarEmpresas();
  }, []);

  async function cargarEmpresas() {
    setLoading(true);

   const { data, error } = await supabase
  .from("empresas")
  .select("*")
  .order("created_at", { ascending: false });

console.log("DASHBOARD EMPRESAS:", data);
console.log("DASHBOARD ERROR:", error);

    if (error) {
      console.error("Error cargando empresas:", error);
      setLoading(false);
      return;
    }

    setEmpresas(data ?? []);
    setLoading(false);
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    navigate("/admin");
  }

  const empresasFiltradas = empresas.filter((empresa) =>
    empresa.nombre.toLowerCase().includes(search.toLowerCase()) ||
    empresa.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">

      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white">
            <Star size={18} fill="currentColor" />
          </div>

          <span className="font-semibold">
            Rate Experience
          </span>
        </div>

        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          {mobileMenu ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="fixed inset-0 top-16 z-20 bg-white p-5 dark:bg-slate-950 lg:hidden">
          <nav className="space-y-2">

            <button
              className="flex w-full items-center gap-3 rounded-xl bg-teal-50 px-4 py-3 text-left font-medium text-teal-800 dark:bg-teal-950/40 dark:text-teal-300"
              onClick={() => setMobileMenu(false)}
            >
              <LayoutDashboard size={19} />
              Dashboard
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900">
              <Building2 size={19} />
              Empresas
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900">
              <Settings size={19} />
              Configuración
            </button>

            <div className="my-4 border-t border-slate-200 dark:border-slate-800" />

            <button
              onClick={cerrarSesion}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut size={19} />
              Cerrar sesión
            </button>

          </nav>
        </div>
      )}

      <div className="flex">

        {/* SIDEBAR */}
        <aside className="hidden min-h-screen w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex lg:flex-col">

          <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white">
              <Star size={18} fill="currentColor" />
            </div>

            <div>
              <p className="font-semibold tracking-tight">
                Rate Experience
              </p>
              <p className="text-xs text-slate-500">
                Administración
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4">

            <button className="flex w-full items-center gap-3 rounded-xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800 dark:bg-teal-950/40 dark:text-teal-300">
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <button
  onClick={() => navigate("/admin/empresas")}
  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
>
  <Building2 size={18} />
  Empresas
</button>

            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900">
              <Users size={18} />
              Feedback
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900">
              <Settings size={18} />
              Configuración
            </button>

          </nav>

          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <button
              onClick={cerrarSesion}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>

        </aside>

        {/* MAIN */}
        <main className="w-full flex-1">

          <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10">

            {/* TOP */}
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="mb-1 text-sm font-medium text-teal-700 dark:text-teal-400">
                  Panel de administración
                </p>

                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Gestiona tus empresas y sus enlaces de reseñas.
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/empresas/nueva")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800"
              >
                <Plus size={18} />
                Nueva empresa
              </button>

            </div>

            {/* STATS */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <StatCard
                icon={<Building2 size={20} />}
                title="Empresas"
                value={empresas.length.toString()}
                description="Empresas registradas"
              />

              <StatCard
                icon={<Star size={20} />}
                title="Valoraciones"
                value="—"
                description="Próximamente"
              />

              <StatCard
                icon={<Users size={20} />}
                title="Feedback"
                value="—"
                description="Próximamente"
              />

            </div>

            {/* EMPRESAS */}
            <section className="mt-8">

              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-lg font-semibold">
                    Tus empresas
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Gestiona las empresas conectadas a Rate Experience.
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Buscar empresa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-800 dark:bg-slate-900"
                  />
                </div>

              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                {loading ? (

                  <div className="flex min-h-48 items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-teal-700" />
                  </div>

                ) : empresasFiltradas.length === 0 ? (

                  <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">

                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
                      <Building2 size={22} />
                    </div>

                    <h3 className="font-medium">
                      {search
                        ? "No se encontraron empresas"
                        : "Todavía no tienes empresas"}
                    </h3>

                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                      {search
                        ? "Prueba con otro nombre o slug."
                        : "Crea tu primera empresa para comenzar."}
                    </p>

                    {!search && (
                      <button
                        onClick={() => navigate("/admin/empresas/nueva")}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
                      >
                        <Plus size={17} />
                        Crear empresa
                      </button>
                    )}

                  </div>

                ) : (

                  <>
                    {/* DESKTOP TABLE */}
                    <div className="hidden overflow-x-auto md:block">

                      <table className="w-full">

                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-950/50">
                            <th className="px-6 py-4">Empresa</th>
                            <th className="px-6 py-4">URL pública</th>
                            <th className="px-6 py-4">Google Reviews</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                          </tr>
                        </thead>

                        <tbody>

                          {empresasFiltradas.map((empresa) => (

                            <tr
                              key={empresa.id}
                              className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950/50"
                            >

                              <td className="px-6 py-5">

                                <div className="flex items-center gap-3">

                                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400">
                                    <Building2 size={19} />
                                  </div>

                                  <div>
                                    <p className="font-medium">
                                      {empresa.nombre}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                      {empresa.slug}
                                    </p>
                                  </div>

                                </div>

                              </td>

                              <td className="px-6 py-5">
                                <button
                                  onClick={() =>
                                    window.open(
                                      `/r/${empresa.slug}`,
                                      "_blank"
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 text-sm text-teal-700 hover:underline dark:text-teal-400"
                                >
                                  /r/{empresa.slug}
                                  <ExternalLink size={13} />
                                </button>
                              </td>

                              <td className="px-6 py-5">

                                <button
                                  onClick={() =>
                                    window.open(
                                      empresa.google_review_url,
                                      "_blank"
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-400"
                                >
                                  Ver enlace
                                  <ExternalLink size={13} />
                                </button>

                              </td>

                              <td className="px-6 py-5">

                                <div className="flex justify-end">

                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/admin/empresas/${empresa.id}/editar`
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                  >
                                    Editar
                                    <ChevronRight size={15} />
                                  </button>

                                </div>

                              </td>

                            </tr>

                          ))}

                        </tbody>

                      </table>

                    </div>

                    {/* MOBILE CARDS */}
                    <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">

                      {empresasFiltradas.map((empresa) => (

                        <div key={empresa.id} className="p-5">

                          <div className="flex items-start justify-between gap-3">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400">
                                <Building2 size={19} />
                              </div>

                              <div>
                                <p className="font-medium">
                                  {empresa.nombre}
                                </p>

                                <p className="text-xs text-slate-500">
                                  /r/{empresa.slug}
                                </p>
                              </div>

                            </div>

                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                              Activa
                            </span>

                          </div>

                          <div className="mt-4 flex gap-2">

                            <button
                              onClick={() =>
                                window.open(`/r/${empresa.slug}`, "_blank")
                              }
                              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
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
                              className="flex-1 rounded-lg bg-teal-700 py-2 text-sm font-medium text-white hover:bg-teal-800"
                            >
                              Editar
                            </button>

                          </div>

                        </div>

                      ))}

                    </div>
                  </>

                )}

              </div>

            </section>

          </div>

        </main>

      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400">
          {icon}
        </div>

      </div>

      <p className="mt-3 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
}