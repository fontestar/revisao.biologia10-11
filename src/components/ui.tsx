/* ============================================================================
   PEÇAS VISUAIS REUTILIZÁVEIS
   ============================================================================
   Componentes pequenos e sem estado usados em várias páginas:
   notação matemática (KaTeX), etiquetas, selo de status, vazio,
   dica de estudo, ícone da parte, barra de progresso, card de
   métrica, card de vídeo e o desenho decorativo da capa.
   ============================================================================ */

import katex from "katex";
import "katex/dist/katex.min.css";
import {
  Activity,
  Apple,
  BookOpen,
  Brain,
  Bug,
  Check,
  Circle,
  CircleDot,
  Citrus,
  Dna,
  Egg,
  Eye,
  Fish,
  FlaskConical,
  Flower2,
  GitBranch,
  HeartPulse,
  Inbox,
  Leaf,
  Lightbulb,
  Microscope,
  PawPrint,
  Pill,
  PlayCircle,
  ShieldPlus,
  Stethoscope,
  Syringe,
  TreePine,
  Wheat,
  Worm,
  Bone,
  type LucideIcon,
} from "lucide-react";
import { cn, type PartIconName, type PartStatus, type Video } from "@/content";

/* ──────────────────────────────
   MATEMÁTICA (KaTeX)
   ────────────────────────────── */

/**
 * Renderiza uma expressão matemática (LaTeX) com KaTeX.
 * Funciona no servidor e no cliente · o KaTeX só gera uma string HTML.
 *
 * Chama-se MathExpr (e não Math) para não conflitar com o objeto
 * `Math` nativo do JavaScript.
 */
export function MathExpr({
  latex,
  display = false,
  className,
}: {
  latex: string;
  display?: boolean;
  className?: string;
}) {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode: display,
    output: "html",
    strict: "ignore",
  });

  const Tag = display ? "div" : "span";

  return (
    <Tag
      className={cn(display ? "katex-display-block overflow-x-auto" : "katex-inline", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

type Segment =
  | { type: "text"; value: string }
  | { type: "math"; value: string }
  | { type: "display-math"; value: string };

function splitMath(text: string): Segment[] {
  const segments: Segment[] = [];
  const regex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      segments.push({ type: "display-math", value: match[1] });
    } else if (match[2] !== undefined) {
      segments.push({ type: "math", value: match[2] });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ type: "text", value: text }];
}

/** Converte os trechos $...$ e $$...$$ de um texto em notação matemática. */
function renderMath(text: string, keyPrefix: string) {
  return splitMath(text).map((segment, i) => {
    const key = `${keyPrefix}-${i}`;
    if (segment.type === "math") return <MathExpr key={key} latex={segment.value} />;
    if (segment.type === "display-math") return <MathExpr key={key} latex={segment.value} display />;
    return <span key={key}>{segment.value}</span>;
  });
}

/**
 * Texto usado em teoria, flashcards, questões, alternativas e gabarito.
 *   $...$   → matemática na linha   ·   $$...$$ → matemática destacada
 *   **...** → negrito (os asteriscos somem da tela)
 * O negrito pode conter matemática: "**Ângulo ($i$)**".
 */
export function MathText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g); // índices ímpares = negrito
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold">
            {renderMath(part, `b${i}`)}
          </strong>
        ) : (
          <span key={i}>{renderMath(part, `t${i}`)}</span>
        ),
      )}
    </span>
  );
}

/* ──────────────────────────────
   ETIQUETA DE SEÇÃO
   ────────────────────────────── */

export function SectionLabel({
  children,
  className,
  tone = "brand",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "brand" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em]",
        tone === "brand" ? "text-brand" : "text-ink-faint",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ──────────────────────────────
   SELO DE STATUS
   ────────────────────────────── */

const STATUS_CONFIG: Record<PartStatus, { label: string; icon: LucideIcon; className: string }> = {
  "not-started": {
    label: "Não iniciado",
    icon: Circle,
    className: "bg-surface-muted text-ink-soft",
  },
  "in-progress": {
    label: "Em andamento",
    icon: CircleDot,
    className: "bg-warning-soft text-warning",
  },
  completed: {
    label: "Concluído",
    icon: Check,
    className: "bg-success-soft text-success",
  },
};

/** Mostra o estado de uma parte sem depender só de cor (tem ícone e texto). */
export function StatusPill({ status, className }: { status: PartStatus; className?: string }) {
  const { label, icon: Icon, className: toneClass } = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        toneClass,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  );
}

/* ──────────────────────────────
   ESTADO VAZIO
   ────────────────────────────── */

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  className,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-card border border-dashed border-border-strong bg-surface-muted/60 px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink-faint">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <p className="text-base font-medium text-ink">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm leading-relaxed text-ink-soft">{description}</p>
      ) : null}
      {action}
    </div>
  );
}

/* ──────────────────────────────
   DICA DE ESTUDO
   ────────────────────────────── */

export function StudyTip({ tip, className }: { tip: string; className?: string }) {
  return (
    <div className={cn("flex gap-3 rounded-card border border-border bg-brand-soft/60 p-4", className)}>
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
      <div>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brand">
          Dica de estudo
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{tip}</p>
      </div>
    </div>
  );
}

/* ──────────────────────────────
   ÍCONE DA PARTE
   ────────────────────────────── */

const PART_ICONS: Record<PartIconName, LucideIcon> = {
  dna: Dna,
  leaf: Leaf,
  microscope: Microscope,
  bug: Bug,
  fish: Fish,
  "heart-pulse": HeartPulse,
  brain: Brain,
  bone: Bone,
  eye: Eye,
  activity: Activity,
  stethoscope: Stethoscope,
  pill: Pill,
  syringe: Syringe,
  "flask-conical": FlaskConical,
  worm: Worm,
  flower: Flower2,
  tree: TreePine,
  apple: Apple,
  wheat: Wheat,
  citrus: Citrus,
  egg: Egg,
  "paw-print": PawPrint,
  "git-branch": GitBranch,
  "shield-plus": ShieldPlus,
  "book-open": BookOpen,
};

export function PartIcon({ name, className }: { name?: PartIconName; className?: string }) {
  const Icon = (name && PART_ICONS[name]) || BookOpen;
  return <Icon className={className} aria-hidden />;
}

/* ──────────────────────────────
   BARRA DE PROGRESSO
   ────────────────────────────── */

export function ProgressBar({
  value,
  className,
  trackClassName,
  barClassName,
  label,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
  label?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn("w-full", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-sunken", trackClassName)}>
        <div
          className={cn("h-full rounded-full bg-brand transition-[width] duration-500 ease-out", barClassName)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────
   CARD DE MÉTRICA
   ────────────────────────────── */

export function MetricCard({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: number | string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Icon className="h-4.5 w-4.5" aria-hidden />
      </span>
      <div>
        <p className="font-display text-xl font-medium leading-none text-ink">{value}</p>
        <p className="mt-1 text-xs text-ink-faint">{label}</p>
      </div>
    </div>
  );
}

/* ──────────────────────────────
   CARD DE VÍDEO
   ────────────────────────────── */

export function VideoCard({ video, eyebrow }: { video: Video; eyebrow?: string }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-card border border-border bg-surface p-5 transition-colors hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <div className="flex items-center justify-between gap-3">
        {eyebrow ? (
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            {eyebrow}
          </span>
        ) : (
          <span />
        )}
        {video.durationLabel ? (
          <span className="text-xs text-ink-faint">{video.durationLabel}</span>
        ) : null}
      </div>

      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand transition-transform group-hover:scale-105">
          <PlayCircle className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h3 className="font-display text-base font-medium leading-snug text-ink">{video.title}</h3>
          {video.description ? (
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{video.description}</p>
          ) : null}
          {video.author ? <p className="mt-2 text-xs text-ink-faint">{video.author}</p> : null}
        </div>
      </div>
    </a>
  );
}

/* ──────────────────────────────
   DESENHO DECORATIVO DA CAPA
   Folha com nervuras, uma célula com núcleo e uma dupla hélice de
   DNA — três imagens que atravessam a Biologia. Puramente decorativo.
   ────────────────────────────── */

export function HeroMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 420" fill="none" role="presentation" aria-hidden="true" className={className}>
      {/* Folha (contorno + nervura central + laterais) */}
      <path
        d="M150 34 C 226 96 236 226 150 386 C 64 226 74 96 150 34 Z"
        stroke="var(--color-brand)"
        strokeWidth="3"
        fill="none"
        opacity="0.4"
      />
      <line x1="150" y1="48" x2="150" y2="376" stroke="var(--color-brand)" strokeWidth="2.5" opacity="0.45" />
      {[-1, 1].map((side) =>
        [0.28, 0.45, 0.62, 0.78].map((t) => {
          const y = 60 + t * 300;
          const w = 62 * Math.sin(Math.PI * t);
          return (
            <path
              key={`${side}-${t}`}
              d={`M 150 ${y} Q ${150 + side * w * 0.7} ${y - 18} ${150 + side * w} ${y - 34}`}
              stroke="var(--color-brand)"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
          );
        }),
      )}

      {/* Célula (membrana dupla, núcleo e organelas) */}
      <circle cx="248" cy="300" r="46" stroke="var(--color-brand)" strokeWidth="2.5" fill="none" opacity="0.4" />
      <circle cx="248" cy="300" r="40" stroke="var(--color-brand)" strokeWidth="1.4" fill="none" opacity="0.25" strokeDasharray="3 4" />
      <circle cx="248" cy="300" r="15" fill="var(--color-accent)" opacity="0.75" />
      <circle cx="228" cy="282" r="5" fill="var(--color-brand)" opacity="0.5" />
      <circle cx="266" cy="316" r="4" fill="var(--color-brand)" opacity="0.45" />
      <circle cx="258" cy="280" r="3.5" fill="var(--color-brand)" opacity="0.4" />

      {/* Dupla hélice de DNA (duas curvas + degraus) */}
      <g stroke="var(--color-brand)" strokeWidth="2.4" opacity="0.45" fill="none">
        <path d="M52 60 C 84 84 20 108 52 132 C 84 156 20 180 52 204" />
        <path d="M84 60 C 52 84 116 108 84 132 C 52 156 116 180 84 204" />
      </g>
      {[
        [68, 72],
        [58, 96],
        [68, 120],
        [58, 144],
        [68, 168],
        [58, 192],
      ].map(([x, y]) => (
        <line key={`${x}-${y}`} x1={x - 8} y1={y} x2={x + 8} y2={y} stroke="var(--color-accent)" strokeWidth="2.2" opacity="0.55" />
      ))}
    </svg>
  );
}
