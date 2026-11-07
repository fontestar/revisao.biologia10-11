import { SectionLabel, EmptyState, VideoCard } from "@/components/ui";
import { allVideos, review, type Video } from "@/content";


export const metadata = {
  title: `Videoaulas · ${review.kicker}`,
};

/** Agrupa os vídeos em duas seções: aulas/conteúdo e playlists de exercícios. */
function byCategory(videos: { video: Video; parts: { number: number; title: string; id: string }[] }[]) {
  return {
    aulas: videos.filter((v) => v.video.category !== "exercicios"),
    exercicios: videos.filter((v) => v.video.category === "exercicios"),
  };
}

function VideoSection({
  title,
  subtitle,
  videos,
}: {
  title: string;
  subtitle: string;
  videos: { video: Video; parts: { number: number; title: string; id: string }[] }[];
}) {
  return (
    <section>
      <h2 className="font-display text-xl font-medium text-ink sm:text-2xl">{title}</h2>
      <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map(({ video, parts: covered }) => (
          <div key={video.id} className="flex flex-col gap-1.5">
            <VideoCard
              video={video}
              eyebrow={
                covered.length > 0
                  ? `Partes ${covered.map((p) => String(p.number).padStart(2, "0")).join(" · ")}`
                  : "Geral"
              }
            />
            {covered.length > 0 ? (
              <p className="px-1 text-xs text-ink-faint">
                Cobre: {covered.map((p) => p.title).join(" · ")}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function VideoaulasPage() {
  const videos = allVideos();
  const { aulas, exercicios } = byCategory(videos);

  return (
    <div className="px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <SectionLabel>Recursos gerais</SectionLabel>
        <h1 className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">Aulas em vídeo</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
          Todo o conteúdo em vídeo desta revisão, organizado em aulas e playlists de exercícios.
          Cada vídeo abre no YouTube em uma nova aba.
        </p>

        {videos.length > 0 ? (
          <div className="mt-10 flex flex-col gap-14">
            {aulas.length > 0 ? (
              <VideoSection
                title="Aulas e conteúdo"
                subtitle="Para estudar a teoria dos três capítulos."
                videos={aulas}
              />
            ) : null}

            {exercicios.length > 0 ? (
              <VideoSection
                title="Playlists de exercícios"
                subtitle="Para praticar depois de estudar: uma playlist por assunto."
                videos={exercicios}
              />
            ) : null}
          </div>
        ) : (
          <EmptyState
            className="mt-10"
            title="As videoaulas aparecerão aqui."
            description="Nenhuma playlist foi adicionada ainda. Quando houver, cada uma mostrará as partes que cobre."
          />
        )}
      </div>
    </div>
  );
}
