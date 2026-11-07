"use client";

/* ============================================================================
   FERRAMENTA INTERATIVA
   ============================================================================
   Prancheta livre: o aluno rascunha esquemas, ciclos, estruturas e
   construções à mão — útil em qualquer disciplina. Funciona a toque (celular) e a mouse (computador).

   Controles: raio/linha/tracejado/ponto, borracha, desfazer, refazer e
   limpar. As linhas grudam nos pontos âncora marcados no fundo.
   ============================================================================ */

import { useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { Check, Eraser, Redo2, Undo2 } from "lucide-react";
import { cn } from "@/content";

const W = 720;
const H = 340;
type P = { x: number; y: number };
type Kind = "ray" | "line" | "dashed" | "point";
type Tool = Kind | "erase";
interface Shape {
  kind: Kind;
  a: P;
  b: P;
}

const INK2 = "var(--color-ink-soft)";
const BRAND = "var(--color-brand)";
const ACCENT = "var(--color-accent)";

const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.y - b.y);
const distToSeg = (p: P, a: P, b: P) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const L = dx * dx + dy * dy;
  if (L === 0) return dist(p, a);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / L));
  return dist(p, { x: a.x + t * dx, y: a.y + t * dy });
};

function Seg({
  a,
  b,
  color,
  dashed = false,
  width = 2.6,
  arrow,
  opacity = 1,
}: {
  a: P;
  b: P;
  color: string;
  dashed?: boolean;
  width?: number;
  arrow?: number;
  opacity?: number;
}) {
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const hx = a.x + (b.x - a.x) * (arrow ?? 0.6);
  const hy = a.y + (b.y - a.y) * (arrow ?? 0.6);
  const a1 = ang + Math.PI * 0.82;
  const a2 = ang - Math.PI * 0.82;
  return (
    <g opacity={opacity}>
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? "7 5" : undefined}
        strokeLinecap="round"
      />
      {arrow !== undefined ? (
        <path
          d={`M ${hx + 11 * Math.cos(a1)} ${hy + 11 * Math.sin(a1)} L ${hx} ${hy} L ${hx + 11 * Math.cos(a2)} ${hy + 11 * Math.sin(a2)}`}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </g>
  );
}

export function DrawingBoard({ title = "Prancheta livre", note }: { title?: string; note?: string }) {
  const [tool, setTool] = useState<Tool>("line");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [past, setPast] = useState<Shape[][]>([]);
  const [future, setFuture] = useState<Shape[][]>([]);
  const [draft, setDraft] = useState<Shape | null>(null);
  const [pending, setPending] = useState<P | null>(null);

  function commit(next: Shape[]) {
    setPast((p) => [...p, shapes]);
    setFuture([]);
    setShapes(next);
  }

  /** Converte o toque/clique para coordenadas do desenho. Lido NA HORA,
   *  dentro do evento — depois ele já não existe. */
  function toSvg(e: ReactPointerEvent<SVGSVGElement>): P {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  }

  function onDown(e: ReactPointerEvent<SVGSVGElement>) {
    e.preventDefault();
    const p = toSvg(e);
    if (tool === "erase") {
      let best = -1;
      let bestD = 16;
      shapes.forEach((s, idx) => {
        const d = s.kind === "point" ? dist(p, s.a) : distToSeg(p, s.a, s.b);
        if (d < bestD) {
          bestD = d;
          best = idx;
        }
      });
      if (best >= 0) commit(shapes.filter((_, idx) => idx !== best));
      return;
    }
    if (tool === "point") {
      commit([...shapes, { kind: "point", a: p, b: p }]);
      return;
    }
    if (pending) {
      if (dist(pending, p) > 4) commit([...shapes, { kind: tool, a: pending, b: p }]);
      setPending(null);
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraft({ kind: tool, a: p, b: p });
  }

  function onMove(e: ReactPointerEvent<SVGSVGElement>) {
    if (!draft) return;
    setDraft({ ...draft, b: toSvg(e) });
  }

  function onUp() {
    if (!draft) return;
    if (dist(draft.a, draft.b) > 8) commit([...shapes, draft]);
    else setPending(draft.a);
    setDraft(null);
  }

  function undo() {
    if (pending) return setPending(null);
    if (past.length === 0) return;
    setFuture((f) => [shapes, ...f]);
    setShapes(past[past.length - 1]);
    setPast((p) => p.slice(0, -1));
  }

  function redo() {
    if (future.length === 0) return;
    setPast((p) => [...p, shapes]);
    setShapes(future[0]);
    setFuture((f) => f.slice(1));
  }

  function clearAll() {
    if (shapes.length === 0 && !pending) return;
    commit([]);
    setPending(null);
  }

  const renderShape = (s: Shape, key: string, faded = false) => {
    if (s.kind === "point") return <circle key={key} cx={s.a.x} cy={s.a.y} r={5} fill={ACCENT} opacity={faded ? 0.5 : 1} />;
    return (
      <Seg
        key={key}
        a={s.a}
        b={s.b}
        color={s.kind === "dashed" ? INK2 : BRAND}
        dashed={s.kind === "dashed"}
        arrow={s.kind === "ray" ? 0.6 : undefined}
        opacity={faded ? 0.5 : 1}
      />
    );
  };

  const tools: { id: Tool; label: string }[] = [
    { id: "ray", label: "Seta →" },
    { id: "line", label: "Linha" },
    { id: "dashed", label: "Tracejado" },
    { id: "point", label: "Ponto" },
    { id: "erase", label: "Borracha" },
  ];

  return (
    <div className="mt-5 rounded-card border border-border bg-surface p-4 sm:p-5">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">{title}</p>
      {note ? <p className="mt-1 text-sm text-ink-soft">{note}</p> : null}
      <p className="mt-1 text-xs text-ink-faint">
        Arraste para traçar, ou toque no começo e depois no fim.
      </p>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={cn(
          "mt-3 h-auto w-full select-none rounded-control border border-border bg-bg",
          tool === "erase" ? "cursor-pointer" : "cursor-crosshair",
        )}
        style={{ touchAction: "none" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={() => setDraft(null)}
        role="application"
        aria-label={`Prancheta de desenho: ${title}. Arraste para traçar linhas.`}
      >
        {shapes.map((s, idx) => renderShape(s, `s${idx}`))}
        {draft ? renderShape(draft, "draft", true) : null}
        {pending ? <circle cx={pending.x} cy={pending.y} r={6} fill="none" stroke={ACCENT} strokeWidth={2.5} /> : null}
      </svg>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tools.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTool(t.id);
              setPending(null);
            }}
            aria-pressed={tool === t.id}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-control border px-3 py-2 text-sm font-medium transition-colors",
              tool === t.id ? "border-brand bg-brand text-brand-contrast" : "border-border text-ink-soft hover:border-border-strong",
            )}
          >
            {t.id === "erase" ? <Eraser className="h-3.5 w-3.5" aria-hidden /> : null}
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={undo}
          disabled={past.length === 0 && !pending}
          className="inline-flex items-center gap-1.5 rounded-control border border-border px-3 py-2 text-sm text-ink-soft disabled:opacity-40"
        >
          <Undo2 className="h-3.5 w-3.5" aria-hidden />
          Desfazer
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={future.length === 0}
          className="inline-flex items-center gap-1.5 rounded-control border border-border px-3 py-2 text-sm text-ink-soft disabled:opacity-40"
        >
          <Redo2 className="h-3.5 w-3.5" aria-hidden />
          Refazer
        </button>
        <button
          type="button"
          onClick={clearAll}
          disabled={shapes.length === 0 && !pending}
          className="rounded-control border border-border px-3 py-2 text-sm text-ink-soft disabled:opacity-40"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────
   Ponte usada pela teoria: { type: "interactive", tool: "draw" }
   ────────────────────────────── */

export function InteractiveTool({ tool, title, note }: { tool: "draw"; title?: string; note?: string }) {
  if (tool === "draw") return <DrawingBoard title={title} note={note} />;
  return null;
}

/** Lista de conferência reutilizável para o aluno checar o próprio esquema. */
export function ConstructionChecklist({ items }: { items: string[] }) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  return (
    <div className="mt-4 rounded-card border border-border bg-surface-muted/60 p-4">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">Confira seu esquema</p>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((it, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
              aria-pressed={Boolean(done[i])}
              className="flex w-full items-start gap-2.5 text-left text-sm leading-relaxed text-ink-soft"
            >
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border",
                  done[i] ? "border-transparent bg-success text-white" : "border-border-strong",
                )}
              >
                {done[i] ? <Check className="h-3 w-3" /> : null}
              </span>
              <span className={done[i] ? "text-ink-faint line-through" : undefined}>{it}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
