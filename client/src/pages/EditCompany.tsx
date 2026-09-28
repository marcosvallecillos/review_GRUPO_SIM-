import {
  ArrowLeft,
  Building2,
  Check,
  Link,
  Loader2,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Empresa = {
  id: string;
  nombre: string;
  slug: string;
  google_review_url: string;
};

export default function EditCompany() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [empresa, setEmpresa] = useState<Empresa | null>(null);

  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    cargarEmpresa();
  }, [id]);

  async function cargarEmpresa() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("empresas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error cargando empresa:", error);
      setError("No se ha podido cargar la empresa.");
      setLoading(false);
      return;
    }

    setEmpresa(data);

    setNombre(data.nombre);
    setSlug(data.slug);
    setGoogleReviewUrl(data.google_review_url);

    setLoading(false);
  }

  const generarSlug = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  async function guardarCambios(e: React.FormEvent) {
    e.preventDefault();

    if (!id || saving) return;

    setError("");

    const nombreLimpio = nombre.trim();
    const slugLimpio = slug.trim().toLowerCase();
    const urlLimpia = googleReviewUrl.trim();

    if (!nombreLimpio || !slugLimpio || !urlLimpia) {
      setError("Completa todos los campos.");
      return;
    }

    if (!/^https?:\/\/.+/i.test(urlLimpia)) {
      setError("Introduce una URL válida de Google.");
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("empresas")
      .update({
        nombre: nombreLimpio,
        slug: slugLimpio,
        google_review_url: urlLimpia,
      })
      .eq("id", id)
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error("Error actualizando empresa:", error);

      if (error.code === "23505") {
        setError("Ese slug ya está siendo utilizado por otra empresa.");
      } else {
        setError("No se han podido guardar los cambios.");
      }

      return;
    }

    setEmpresa(data);

    navigate("/admin/dashboard");
  }

  async function eliminarEmpresa() {
    if (!id || deleting) return;

    const confirmado = window.confirm(
      `¿Seguro que quieres eliminar "${empresa?.nombre}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmado) return;

    setDeleting(true);
    setError("");

    const { error } = await supabase
      .from("empresas")
      .delete()
      .eq("id", id);

    setDeleting(false);

    if (error) {
      console.error("Error eliminando empresa:", error);
      setError("No se ha podido eliminar la empresa.");
      return;
    }

    navigate("/admin/dashboard");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="flex min-h-screen items-center justify-center">
          <Loader2
            size={28}
            className="animate-spin text-teal-700"
          />
        </div>
      </main>
    );
  }

  if (!empresa) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-2xl">
          <p className="text-red-600">
            {error || "Empresa no encontrada."}
          </p>

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white"
          >
            <ArrowLeft size={17} />
            Volver
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-7 dark:bg-slate-950 sm:px-8">
      <div className="mx-auto max-w-2xl">

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={17} />
          Volver al dashboard
        </button>

        <div className="mb-8">
          <p className="mb-1 text-sm font-medium text-teal-700 dark:text-teal-400">
            Empresas
          </p>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Editar empresa
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Modifica los datos de {empresa.nombre}.
          </p>
        </div>

        <form
          onSubmit={guardarCambios}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >

          {/* NOMBRE */}
          <div>
            <label
              htmlFor="nombre"
              className="mb-2 block text-sm font-medium"
            >
              Nombre de la empresa
            </label>

            <div className="relative">
              <Building2
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={saving || deleting}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
          </div>

          {/* SLUG */}
          <div className="mt-5">
            <label
              htmlFor="slug"
              className="mb-2 block text-sm font-medium"
            >
              Slug
            </label>

            <input
              id="slug"
              value={slug}
              onChange={(e) =>
                setSlug(generarSlug(e.target.value))
              }
              disabled={saving || deleting}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-700 dark:bg-slate-950"
            />

            <p className="mt-2 text-xs text-slate-500">
              URL pública:
              <span className="ml-1 font-medium text-teal-700 dark:text-teal-400">
                /r/{slug}
              </span>
            </p>
          </div>

          {/* GOOGLE */}
          <div className="mt-5">
            <label
              htmlFor="google"
              className="mb-2 block text-sm font-medium"
            >
              Enlace de Google Reviews
            </label>

            <div className="relative">
              <Link
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="google"
                type="url"
                value={googleReviewUrl}
                onChange={(e) =>
                  setGoogleReviewUrl(e.target.value)
                }
                disabled={saving || deleting}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Las valoraciones de 4 y 5 estrellas utilizarán este enlace.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          {/* ACCIONES */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <button
              type="button"
              onClick={eliminarEmpresa}
              disabled={saving || deleting}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/60 dark:hover:bg-red-950/30"
            >
              {deleting ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Trash2 size={17} />
              )}

              {deleting ? "Eliminando..." : "Eliminar empresa"}
            </button>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                disabled={saving || deleting}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving || deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check size={17} />
                    Guardar cambios
                  </>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}