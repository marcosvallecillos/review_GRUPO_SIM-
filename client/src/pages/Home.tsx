import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  LockKeyhole,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";

const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJm7TWlH1SYA0R_WE3Fri3xis";
const STORAGE_KEY = "Grupo-Simó-private-feedback";

const ratingLabels: Record<number, string> = {
  1: "Necesitamos mejorar",
  2: "Podemos hacerlo mejor",
  3: "Buena experiencia",
  4: "¡Muy buen servicio!",
  5: "¡Excelente servicio!",
};

const suggestedComments = ["Todo quedó impecable", "Resolvió el problema rápido"];

export default function Home() {
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSavedHint, setShowSavedHint] = useState(false);

  const activeRating = hoveredRating ?? rating ?? 0;
  const characterCount = comment.length;
  const canSubmit = rating !== null && rating <= 3;

  const mergedComment = useMemo(() => {
    const parts = [...selectedSuggestions];
    if (comment.trim()) parts.push(comment.trim());
    return parts.join(" · ");
  }, [comment, selectedSuggestions]);

  const toggleSuggestion = (suggestion: string) => {
    setSelectedSuggestions((current) =>
      current.includes(suggestion)
        ? current.filter((item) => item !== suggestion)
        : [...current, suggestion],
    );
  };

  const openGoogleReview = () => {
    const reviewWindow = window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
    if (!reviewWindow) window.location.assign(GOOGLE_REVIEW_URL);
  };

  const handleStarClick = (selectedRating: number) => {
    if (selectedRating >= 4) {
      openGoogleReview();
      return;
    }

    setRating(selectedRating);
  };

  const handleSubmit = () => {
    if (!canSubmit || rating === null) return;

    const feedback = {
      id: crypto.randomUUID?.() ?? `${Date.now()}`,
      rating,
      comment: mergedComment,
      createdAt: new Date().toISOString(),
    };

    const currentFeedback = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]",
    ) as typeof feedback[];
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...currentFeedback, feedback]),
    );
    setShowSavedHint(true);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setRating(null);
    setHoveredRating(null);
    setComment("");
    setSelectedSuggestions([]);
    setIsSubmitted(false);
    setShowSavedHint(false);
  };

  if (isSubmitted) {
    return (
      <main className="experience-shell">
        <div className="ambient-glow ambient-glow-one" />
        <div className="ambient-glow ambient-glow-two" />
        <section className="success-state" aria-live="polite">
          <div className="success-icon-wrap">
            <CheckCircle2 size={42} strokeWidth={1.8} />
          </div>
          <p className="eyebrow">Gracias por compartir</p>
          <h1>Tu opinión queda<br />en buenas manos.</h1>
          <p className="success-copy">
            Hemos recibido tu comentario de forma privada. Nos ayuda a seguir
            mejorando la experiencia de cada cliente.
          </p>
          <div className="saved-badge">
            <ShieldCheck size={16} />
            <span>Comentario guardado de forma segura</span>
          </div>
          <button className="secondary-button" onClick={resetForm} type="button">
            Volver a valorar
            <ChevronRight size={18} />
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="experience-shell">
      <div className="ambient-glow ambient-glow-one" />
      <div className="ambient-glow ambient-glow-two" />

      <div className="experience-container">
        <header className="topbar">
          <button className="icon-button" type="button" aria-label="Volver">
            <ArrowLeft size={21} strokeWidth={1.8} />
          </button>
          <div className="brand-lockup">
            <span className="brand-kicker">EVALUATION</span>
            <span className="brand-name">Grupo Simó</span>
          </div>
          <button className="icon-button" type="button" aria-label="Cerrar">
            <X size={21} strokeWidth={1.8} />
          </button>
        </header>

       

        <section className="rating-card card-surface">
          <p className="eyebrow">TU OPINIÓN IMPORTA</p>
          <h1>¿Cómo fue tu experiencia?</h1>
          {activeRating > 0 && (
            <div className="rating-pill">
              <Sparkles size={16} fill="currentColor" />
              <span>{ratingLabels[activeRating]}</span>
            </div>
          )}
          <div
            className="stars-row"
            onMouseLeave={() => setHoveredRating(null)}
            role="radiogroup"
            aria-label="Valoración de una a cinco estrellas"
          >
            {Array.from({ length: 5 }, (_, index) => {
              const starValue = index + 1;
              const isActive = starValue <= activeRating;
              return (
                <button
                  className={`star-button ${isActive ? "is-active" : ""}`}
                  key={starValue}
                  onClick={() => handleStarClick(starValue)}
                  onMouseEnter={() => setHoveredRating(starValue)}
                  role="radio"
                  aria-checked={rating === starValue}
                  aria-label={`${starValue} ${starValue === 1 ? "estrella" : "estrellas"}`}
                  type="button"
                >
                  <Star size={39} strokeWidth={1.45} fill={isActive ? "currentColor" : "none"} />
                </button>
              );
            })}
          </div>
          <p className="rating-helper">Toca las estrellas para calificar a Carlos</p>
        </section>

        {rating !== null && rating <= 3 && (
          <>
            <section className="details-card card-surface">
              <div className="details-heading">
                <h2>Cuéntanos más detalles</h2>
                <span>{characterCount}/500</span>
              </div>
              <div className="suggestion-row" aria-label="Sugerencias de comentario">
                {suggestedComments.map((suggestion) => {
                  const isSelected = selectedSuggestions.includes(suggestion);
                  return (
                    <button
                      className={`suggestion-chip ${isSelected ? "is-selected" : ""}`}
                      key={suggestion}
                      onClick={() => toggleSuggestion(suggestion)}
                      type="button"
                    >
                      {isSelected && <Check size={12} />}
                      {suggestion}
                    </button>
                  );
                })}
              </div>
              <label className="comment-field">
                <span className="sr-only">Escribe aquí tu experiencia</span>
                <textarea
                  maxLength={500}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Escribe aquí tu experiencia, sugerencias o felicitaciones..."
                  value={comment}
                />
              </label>
            </section>

            <section className="submit-area">
              <button className="submit-button" onClick={handleSubmit} type="button">
                <Send size={20} strokeWidth={1.8} />
                <span>Enviar valoración</span>
                <ChevronRight className="button-arrow" size={19} strokeWidth={1.8} />
              </button>
              <p className="privacy-note">
                <LockKeyhole size={13} /> Tus datos y comentarios son procesados de forma segura
              </p>
              {showSavedHint && <p className="save-hint">Tu opinión se ha guardado correctamente.</p>}
            </section>
          </>
        )}

        <footer className="footer-note">
          <CircleUserRound size={16} />
          <span>Una valoración honesta nos ayuda a cuidar cada detalle.</span>
        </footer>
      </div>
    </main>
  );
}
