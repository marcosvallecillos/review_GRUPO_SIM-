import { ArrowLeft, Building2, Check, Link, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function NewCompany() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generarSlug = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNombreChange = (value: string) => {
    setNombre(value);

    // Solo genera automáticamente el slug mientras el usuario
    // no lo haya personalizado.
    setSlug(generarSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

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

    setLoading(true);

    const { error } = await supabase.from("empresas").insert({
      nombre: nombreLimpio,
      slug: slugLimpio,
      google_review_url: urlLimpia,
    });

    setLoading(false);

    if (error) {
      console.error("Error creando empresa:", error);

      if (error.code === "23505") {
        setError("Ese slug ya está siendo utilizado por otra empresa.");
      } else {
        setError("No se ha podido crear la empresa. Inténtalo de nuevo.");
      }

      return;
    }

    navigate("/admin/dashboard");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-7 dark:bg-slate-950 sm:px-8">
      <div className="mx-auto max-w-2xl">

        {/* CABECERA */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft size={17} />
            Volver al dashboard
          </button>

          <p className="mb-1 text-sm font-medium text-teal-700 dark:text-teal-400">
            Empresas
          </p>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Nueva empresa
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Añade una empresa y configura su enlace de Google Reviews.
          </p>
        </div>

        {/* FORMULARIO */}
        <form
          onSubmit={handleSubmit}
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
                type="text"
                placeholder="Ej. Grupo Simó"
                value={nombre}
                onChange={(e) => handleNombreChange(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
              type="text"
              placeholder="grupo-simo"
              value={slug}
              onChange={(e) =>
                setSlug(generarSlug(e.target.value))
              }
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />

            <p className="mt-2 text-xs text-slate-500">
              URL pública:
              <span className="ml-1 font-medium text-teal-700 dark:text-teal-400">
                /r/{slug || "nombre-empresa"}
              </span>
            </p>
          </div>

          {/* GOOGLE */}
          <div className="mt-5">
            <label
              htmlFor="googleReviewUrl"
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
                id="googleReviewUrl"
                type="url"
                placeholder="https://search.google.com/..."
                value={googleReviewUrl}
                onChange={(e) => setGoogleReviewUrl(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Este será el enlace al que se enviarán las valoraciones de 4 y 5 estrellas.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          {/* BOTONES */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Check size={17} />
                  Crear empresa
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}