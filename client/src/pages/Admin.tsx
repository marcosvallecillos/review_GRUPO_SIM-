import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      // 400 = credenciales inválidas; cualquier otro caso es un fallo de red/servidor
      setError(
        error.status === 400
          ? "Correo o contraseña incorrectos. Revísalos e inténtalo de nuevo."
          : "No hemos podido conectar. Inténtalo de nuevo en unos minutos."
      );
      return;
    }
navigate("/admin/dashboard");
    // TODO: redirigir al panel (p. ej. navigate("/admin/dashboard"))
  };

  const inputClass =
    "w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] text-slate-900 " +
    "placeholder:text-slate-400 transition-colors " +
    "focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-700 " +
    "disabled:opacity-60 " +
    "dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 " +
    (error
      ? "border-red-500 dark:border-red-400"
      : "border-slate-300 dark:border-slate-700");

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-5 py-12 dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Panel de administración
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            Accede con tu cuenta para gestionar el contenido.
          </p>
        </header>

        <form onSubmit={handleLogin} noValidate className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="tu@correo.com"
              required
              autoFocus
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? "login-error" : undefined}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Tu contraseña"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? "login-error" : undefined}
                className={inputClass + " pr-16"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3.5 text-sm font-medium text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 dark:text-slate-400 dark:hover:text-slate-100"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {error && (
            <p
              id="login-error"
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-950"
          >
            {loading && (
              <svg
                className="h-4 w-4 animate-spin motion-reduce:animate-none"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.3"
                />
                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {loading ? "Iniciando sesión…" : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </main>
  );
}