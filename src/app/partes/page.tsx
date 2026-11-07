import { SectionLabel, EmptyState } from "@/components/ui";
import { PartCard } from "@/components/study";
import { getParts, review } from "@/content";

export const metadata = {
  title: `Partes · ${review.kicker}`,
};

export default function PartesPage() {
  const parts = getParts();

  return (
    <div className="px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <SectionLabel>Estrutura da revisão</SectionLabel>
        <h1 className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">Partes</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
          Cada parte reúne teoria, flashcards, questões e objetivos de aprendizagem. Comece pela
          primeira e avance no seu ritmo.
        </p>

        {parts.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {parts.map((part) => (
              <PartCard key={part.id} part={part} />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-10"
            title="As partes da revisão aparecerão aqui."
            description="O conteúdo ainda será adicionado. Cada parte vai reunir a teoria resumida, os objetivos, os flashcards e as questões do assunto."
          />
        )}
      </div>
    </div>
  );
}
