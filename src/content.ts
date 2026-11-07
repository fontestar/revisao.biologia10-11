/* ============================================================================
   CONTEÚDO DA REVISÃO — ARQUIVO PRINCIPAL DE EDIÇÃO
   ============================================================================

   É AQUI que você edita TUDO do conteúdo acadêmico:
   título, descrição, partes, teoria, flashcards, questões,
   gabarito (derivado), questões discursivas e vídeos.

   O arquivo está dividido em 4 blocos, nesta ordem:

     1. TIPOS          — o "formato" de cada conteúdo (raramente muda)
     2. CONTEÚDO       — os dados da revisão  ← EDITE AQUI
     3. CÁLCULOS       — contagens e gabarito derivados automaticamente
     4. UTILITÁRIOS    — dois auxiliares minúsculos usados pela interface

   NOTAÇÃO MATEMÁTICA
   ------------------
   Em qualquer texto você pode escrever matemática entre cifrões:
     $...$    → matemática na linha,  ex: "a velocidade $v$ em $m/s$"
     $$...$$  → matemática destacada
   A interface converte isso em notação real (KaTeX) automaticamente.
   Nunca escreva a_ij, x^2 ou sqrt(x) soltos no texto.
   ============================================================================ */


/* ──────────
   1. TIPOS
   ────────── */

// O "formato" de cada conteúdo. A interface só sabe desenhar estes
// tipos na tela — o conteúdo em si fica no bloco 2, logo abaixo.

/** Nome de um ícone (lucide-react) usado para identificar uma parte. */
export type PartIconName =
  | "dna"          // genética, hereditariedade
  | "leaf"         // botânica, fotossíntese, ecologia
  | "microscope"   // citologia, microbiologia
  | "bug"          // zoologia de invertebrados, parasitologia
  | "fish"         // ictiologia, anatomia de vertebrados
  | "heart-pulse"  // fisiologia, sistema circulatório
  | "brain"        // sistema nervoso
  | "bone"         // sistema esquelético
  | "eye"          // sistema sensorial, visão
  | "activity"     // fisiologia geral, homeostase
  | "stethoscope"  // anatomia, medicina
  | "pill"         // farmacologia, saúde
  | "syringe"      // vacinas, imunologia
  | "flask-conical"// laboratório, experimentos
  | "worm"         // verminoses, parasitologia
  | "flower"       // botânica, morfologia vegetal
  | "tree"         // ecologia, biomas
  | "apple"        // nutrição, saúde
  | "wheat"        // nutrição, carboidratos
  | "citrus"       // vitaminas, nutrição
  | "egg"          // embriologia, reprodução
  | "paw-print"    // zoologia de vertebrados
  | "shield-plus"  // sistema imune, defesa
  | "git-branch"   // interação gênica, ramificações
  | "book-open";   // uso geral

export interface Objective {
  id: string;
  text: string;
}

/**
 * Estado de uma parte/conteúdo. Fica aqui (e não em progress.tsx)
 * para que componentes de servidor possam usá-lo sem precisar
 * importar do módulo de progresso, que é só do navegador.
 */
export type PartStatus = "not-started" | "in-progress" | "completed";

/** Blocos de teoria — permitem montar uma página de leitura rica e modular. */
export type TheoryBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; style?: "bullet" | "number"; items: string[] }
  | { type: "definition"; term: string; text: string }
  | {
      type: "callout";
      variant?: "info" | "warning" | "success";
      title?: string;
      text: string;
    }
  | { type: "example"; title?: string; text: string }
  | { type: "formula"; text: string; caption?: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "quote"; text: string; source?: string }
  /**
   * Legenda de uma fórmula: o que cada símbolo significa e em qual
   * unidade ele é medido. Use logo depois de um bloco "formula".
   *   { type: "quantities", items: [
   *       { symbol: "v", name: "velocidade", unit: "m/s" },
   *   ]}
   */
  | {
      type: "quantities";
      title?: string;
      items: { symbol: string; name: string; unit?: string }[];
    }
  /**
   * Exemplo resolvido passo a passo (enunciado → passos → resposta).
   * Para um exemplo curto, sem passos, use o bloco "example".
   */
  | {
      type: "solved-example";
      title?: string;
      statement: string;
      steps: string[];
      answer: string;
    }
  /**
   * Imagem, diagrama ou gráfico. Coloque o arquivo na pasta
   * `public/` do projeto e use o caminho a partir dela:
   *   { type: "image", src: "/diagrama.png", alt: "descrição" }
   * O `alt` é obrigatório por acessibilidade.
   */
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
      width?: number;
      height?: number;
    }
  /**
   * Ferramenta interativa embutida na teoria (ver components/interactive.tsx):
   *   "draw" → prancheta livre para o aluno rascunhar esquemas, ciclos e
   *             estruturas (útil em qualquer disciplina).
   */
  | {
      type: "interactive";
      tool: "draw";
      title?: string;
      note?: string;
    }
  /** Lista de conferência para o aluno checar a própria construção/esquema. */
  | { type: "checklist"; title?: string; items: string[] };

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface Alternative {
  id: string;
  text: string;
}

/**
 * Nível de dificuldade declarado do exercício.
 *   1 compreender o conceito · 2 aplicar a fórmula direto
 *   3 interpretar e resolver em etapas · 4 combinar conceitos e desenho
 *   5 desafio no nível da prova
 */
export type ExerciseLevel = 1 | 2 | 3 | 4 | 5;

/**
 * De onde veio o exercício. "professor" = veio do material original da prova;
 * "pratica" = criado para treinar. Fica visível para o aluno não confundir.
 */
export type ExerciseOrigin = "professor" | "pratica";

export interface Question {
  id: string;
  statement: string;
  alternatives: Alternative[];
  /** Id da alternativa correta — fonte única de verdade para gabarito. */
  correctAlternativeId: string;
  explanation?: string;
  level?: ExerciseLevel;
  origin?: ExerciseOrigin;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  durationLabel?: string;
  author?: string;
  /** "exercicios" destaca a playlist na seção de exercícios da página de videoaulas. */
  category?: "aula" | "exercicios";
}

/**
 * Questão discursiva (aberta). Diferente das objetivas, não tem
 * alternativas: o estudante resolve no papel e depois compara com
 * o roteiro de resolução passo a passo.
 */
export interface DiscursiveQuestion {
  id: string;
  /** Rótulo do tema, usado para agrupar as questões na página. */
  topic: string;
  /** Parte da revisão em que o conteúdo foi estudado. */
  relatedPartId?: string;
  statement: string;
  level?: ExerciseLevel;
  origin?: ExerciseOrigin;
  /** Itens que o aluno deve conferir no próprio desenho, quando a questão pedir construção. */
  checklist?: string[];
  /** Passos comentados da resolução, exibidos ao expandir. */
  solutionSteps: string[];
  /** Resposta final resumida. */
  finalAnswer: string;
}

export interface Part {
  id: string;
  number: number;
  title: string;
  description: string;
  icon?: PartIconName;
  objectives: Objective[];
  theory: TheoryBlock[];
  flashcards: Flashcard[];
  questions: Question[];
  videos: Video[];
}

export interface Review {
  /** Nome curto da plataforma/etiqueta, ex: "SISTEMA DE REVISÃO" */
  kicker: string;
  /** Título principal da revisão. */
  title: string;
  /** Frase de apoio, ex: "Revisão para A.O de Biologia" */
  subtitle: string;
  /** Data ou identificação da avaliação (opcional). */
  identifier?: string;
  /** Descrição livre da revisão. */
  description: string;
  /** Dicas curtas de estudo, exibidas em vários pontos da plataforma. */
  studyTips: string[];
  /** Partes da revisão — quantidade totalmente dinâmica. */
  parts: Part[];
  /** Vídeos gerais, não amarrados a uma parte específica. */
  generalVideos: Video[];
  /**
   * Área geral de questões discursivas — reúne conteúdo de várias
   * partes, como um simulado aberto. Aparece em /discursivas.
   */
  discursiveQuestions: DiscursiveQuestion[];
  /** Catálogo da aula de exercícios do professor (aparece em /gabaritos). */
  professorExercises: ProfessorExercise[];
}

/**
 * Uma questão da lista do professor. O enunciado completo está no PDF da
 * aula; aqui ficam o assunto, o que estudar e o gabarito transcrito.
 */
export interface ProfessorExercise {
  number: number;
  topic: string;
  partId: string;
  asks: string;
  study: string[];
  answer: string;
  /** Conferência de coerência feita sem o enunciado (opcional). */
  check?: string;
}


/* ──────────────────────────────────────
/* ──────────────────────────────────────
   2. CONTEÚDO DA REVISÃO  ← EDITE AQUI
   ────────────────────────────────────── */

/*
 * VIDEOAULAS (opcional)
 * Escreva cada playlist/vídeo UMA vez aqui e depois referencie nas
 * partes que ela cobre. Assim, trocar um link é mudar uma linha só.
 *
 *   const AULAS_CITOLOGIA: Video = {
 *     id: "playlist-citologia",
 *     title: "Citologia · playlist completa",
 *     description: "Videoaulas sobre...",
 *     url: "https://youtube.com/playlist?list=...",
 *     author: "Nome do professor ou canal",
 *     category: "exercicios",   // opcional: destaca na seção de exercícios
 *   };
 *
 * Depois, na parte correspondente:  videos: [AULAS_CITOLOGIA],
 */

/* ── VIDEOAULAS DESTA REVISÃO ────────────────────────────
   Playlist completa cobrindo todos os assuntos da prova.
   Ela é referenciada em TODAS as partes, então aparece uma vez
   só na página de videoaulas (com todas as partes listadas) e o
   botão "Assistir videoaulas" de cada parte abre ela.
   ───────────────────────────────────────────────────────── */
const VIDEO_PLAYLIST_BIOLOGIA: Video = {
  id: "playlist-biologia-completa",
  title: "Biologia · playlist completa dos assuntos",
  description: "Videoaulas de todos os assuntos da revisão: genética, interação gênica, evolução e biotecnologia.",
  url: "https://youtube.com/playlist?list=PLJiArVwxXtwBH_m_8WJicy9eZxKfyuKhj&si=FyL8F7zf0v1399Xn",
};

/*
 * ─────────────────────────────────────────────────────────────
 * COMO ADICIONAR UMA PARTE
 * ─────────────────────────────────────────────────────────────
 * Copie o modelo abaixo para dentro do array `parts`. Só
 * id/number/title/description são obrigatórios — uma parte pode
 * começar com teoria e receber flashcards e questões depois.
 *
 * {
 *   id: "citologia",             // vira a URL: /partes/citologia
 *   number: 1,
 *   title: "Citologia",
 *   description: "Resumo curto do assunto.",
 *   icon: "microscope",          // ver PartIconName no bloco 1
 *
 *   objectives: [
 *     { id: "obj-1", text: "Diferenciar célula procariótica de eucariótica" },
 *   ],
 *
 *   theory: [
 *     { type: "heading", text: "Título da seção" },
 *     { type: "paragraph", text: "Explicação curta e direta." },
 *     { type: "definition", term: "Membrana plasmática", text: "..." },
 *     { type: "list", items: ["Ponto 1", "Ponto 2"] },
 *
 *     // imagem/diagrama: coloque o arquivo em public/ e use o caminho
 *     { type: "image", src: "/celula.png", alt: "Esquema de uma célula eucariótica" },
 *
 *     // exemplo resolvido passo a passo (útil em genética, ecologia etc.)
 *     { type: "solved-example",
 *       statement: "Enunciado do exemplo...",
 *       steps: ["Primeiro passo...", "Segundo passo..."],
 *       answer: "Resposta final." },
 *
 *     // tabela comparativa
 *     { type: "table", headers: ["", "Procariótica", "Eucariótica"],
 *       rows: [["Núcleo", "Ausente", "Presente"]] },
 *
 *     { type: "callout", variant: "warning", title: "Atenção", text: "..." },
 *     { type: "checklist", items: ["Revise o esquema da célula", "..."] },
 *   ],
 *
 *   flashcards: [
 *     { id: "fc-1", question: "Pergunta?", answer: "Resposta curta." },
 *   ],
 *
 *   questions: [
 *     { id: "q-1",
 *       statement: "Enunciado...",
 *       level: 2, origin: "pratica",
 *       alternatives: [
 *         { id: "a", text: "..." },
 *         { id: "b", text: "..." },
 *       ],
 *       correctAlternativeId: "b",
 *       explanation: "Por que a B está correta." },
 *   ],
 *
 *   videos: [],
 * }
 *
 * O gabarito, as contagens e as barras de progresso saem sozinhos
 * desses dados — não há nada para atualizar à mão depois.
 *
 * Blocos de teoria disponíveis: heading, paragraph, list, definition,
 * callout, example, formula, quantities, solved-example, table, quote,
 * image, checklist, interactive (prancheta "draw").
 * ─────────────────────────────────────────────────────────────
 */

export const review: Review = {
  kicker: "Biologia",
  title: "Revisão de Biologia",
  subtitle: "Genética, interação gênica, evolução e biotecnologia, explicados como gente fala.",
  identifier: undefined,
  description:
    "Revisão em 6 partes, cada uma com teoria escrita de um jeito simples e direto, objetivos, 13 flashcards e 8 questões. No fim tem um simulado com 10 questões discursivas no formato da prova e o gabarito de todas as questões objetivas. Tudo sai automaticamente dos dados - é só estudar.",
  studyTips: [
    "Genética é conta de padaria: monte o quadro de Punnett e tudo se resolve. Não tente fazer de cabeça.",
    "Desenhe enquanto estuda: heredogramas, cromossomos e árvores evolutivas fazem muito mais sentido no papel do que só lendo.",
    "Leia a questão duas vezes e sublinhe o que ela PEDE. Metade dos erros é responder outra coisa.",
  ],
  parts: [
    /* ═══════════════════════════════════════════════════════
       PARTE 1 — GENÉTICA BÁSICA E 1ª LEI DE MENDEL
       ═══════════════════════════════════════════════════════ */
    {
      id: "genetica-basica-primeira-lei",
      number: 1,
      title: "Genética básica e 1ª Lei de Mendel",
      description:
        "DNA, genes e alelos do jeito simples; genótipo × fenótipo; dominância; a 1ª Lei de Mendel com quadro de Punnett; probabilidade (regras do E e do OU); cruzamento-teste; e ausência de dominância.",
      icon: "dna",
      objectives: [
        { id: "obj-1", text: "Explicar DNA, gene, alelo e cromossomo com uma analogia" },
        { id: "obj-2", text: "Diferenciar genótipo de fenótipo" },
        { id: "obj-3", text: "Aplicar a 1ª Lei de Mendel no quadro de Punnett (Aa × Aa)" },
        { id: "obj-4", text: "Usar as regras do E (multiplicar) e do OU (somar) em probabilidade" },
        { id: "obj-5", text: "Fazer cruzamento-teste para descobrir genótipo" },
        { id: "obj-6", text: "Reconhecer dominância incompleta e codominância" },
      ],
      theory: [
        { type: "heading", text: "O que é genética, na prática" },
        {
          type: "paragraph",
          text: "Genética estuda por que você se parece com seus pais: a **hereditariedade**, ou seja, a passagem de características de uma geração para a outra. A mágica mora numa molécula chamada **DNA**.",
        },
        {
          type: "paragraph",
          text: "Pensa no DNA como um **livro de receitas** da sua vida. Cada **gene** é uma receita (por exemplo, a receita da cor do seu olho). E cada **alelo** é uma versão dessa receita - tipo a mesma receita de bolo feita por duas pessoas: o resultado é parecido, mas não idêntico. Um gene da cor do olho pode ter a versão 'castanho' (A) e a versão 'azul' (a).",
        },
        {
          type: "table",
          headers: ["Palavra", "É isso aqui", "Analogia"],
          rows: [
            ["DNA", "A molécula que guarda a informação genética", "O livro inteiro"],
            ["Gene", "Um pedaço do DNA = uma receita", "Uma receita do livro"],
            ["Alelo", "Versão de um gene", "A mesma receita com variação"],
            ["Cromossomo", "DNA enrolado com proteínas, carregando vários genes", "Um capítulo do livro"],
            ["Lócus", "O 'endereço' do gene no cromossomo", "O número da página"],
            ["Genoma", "Todo o material genético do organismo", "A biblioteca inteira"],
          ],
        },
        { type: "heading", text: "Genótipo × fenótipo: a receita e o bolo" },
        {
          type: "paragraph",
          text: "**Genótipo** é o que está escrito nos seus genes - a receita (AA, Aa, aa). **Fenótipo** é o que dá para ver - o bolo pronto (olho castanho, cabelo liso). O fenótipo nasce do genótipo junto com o ambiente.",
        },
        {
          type: "example",
          title: "Exemplo",
          text: "Genótipo $AA$ para cor de olho pode dar fenótipo 'olho castanho'. Você pode carregar a versão recessiva $a$ no genótipo ($Aa$) sem ela aparecer - o $A$ 'ganha' dela.",
        },
        { type: "heading", text: "Homozigoto e heterozigoto" },
        {
          type: "paragraph",
          text: "Você recebe um alelo do pai e um da mãe. Se os dois forem iguais, você é **homozigoto** ($AA$ ou $aa$). Se forem diferentes, é **heterozigoto** ($Aa$). Simples assim.",
        },
        { type: "heading", text: "Dominância: quem manda no fenótipo" },
        {
          type: "paragraph",
          text: "Na **dominância completa**, basta um alelo dominante (letra maiúscula, $A$) para ele aparecer no fenótipo. O recessivo ($a$) só aparece quando está em dobro ($aa$). Então $AA$ e $Aa$ têm o mesmo fenótipo.",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Cuidado com a pegadinha",
          text: "Dominante NÃO quer dizer 'mais comum' nem 'melhor'. É só o alelo que aparece quando está presente. O tipo sanguíneo O, por exemplo, é recessivo e é o mais comum no Brasil.",
        },
        { type: "heading", text: "A 1ª Lei de Mendel (lei da segregação)" },
        {
          type: "paragraph",
          text: "Mendel descobriu que, na hora de formar os gametas (espermatozoide e óvulo), os dois alelos de um par se **separam** - cada gameta leva só um. Por isso o cruzamento $Aa \\times Aa$ sempre dá o mesmo resultado. Olha o quadro de Punnett:",
        },
        {
          type: "table",
          headers: ["", "$A$ (pai)", "$a$ (pai)"],
          rows: [
            ["$A$ (mãe)", "$AA$", "$Aa$"],
            ["$a$ (mãe)", "$Aa$", "$aa$"],
          ],
        },
        {
          type: "paragraph",
          text: "Resultado: **1 $AA$ : 2 $Aa$ : 1 $aa$** → proporção genotípica **1:2:1**. Como $AA$ e $Aa$ têm o mesmo fenótipo dominante, a proporção fenotípica vira **3:1** (75% dominante, 25% recessivo).",
        },
        {
          type: "solved-example",
          title: "E quando a prova pede quantidade?",
          statement: "De 80 filhotes de $Aa \\times Aa$, quantos devem ser recessivos?",
          steps: [
            "Fenótipo recessivo só vem de $aa$ → 1 de 4 = $\\dfrac{1}{4}$ = 25%.",
            "$\\dfrac{1}{4} \\times 80 = 20$.",
          ],
          answer: "20 filhotes recessivos.",
        },
        { type: "heading", text: "Probabilidade: as regras do E e do OU" },
        {
          type: "paragraph",
          text: "Tem duas regrinhas que resolvem quase tudo: **regra do E** (os dois têm que acontecer) → **multiplica**. **Regra do OU** (um ou outro basta) → **soma** (e se os dois podem acontecer junto, subtrai a interseção).",
        },
        { type: "formula", text: "P(A \\text{ e } B) = P(A) \\times P(B) \\qquad P(A \\text{ ou } B) = P(A) + P(B) - P(A \\text{ e } B)" },
        {
          type: "solved-example",
          title: "Regra do E",
          statement: "P(menina) = 1/2 e P(albino) = 1/4. Qual a P de nascer menina E albina?",
          steps: ["São independentes → multiplica: $\\dfrac{1}{2} \\times \\dfrac{1}{4} = \\dfrac{1}{8} = 12{,}5\\%$."],
          answer: "1/8 (12,5%).",
        },
        {
          type: "solved-example",
          title: "Regra do OU",
          statement: "Mesma situação: qual a P de nascer menina OU albina?",
          steps: [
            "Soma: $\\dfrac{1}{2} + \\dfrac{1}{4} = \\dfrac{3}{4}$.",
            "Mas 'menina E albina' foi contada duas vezes → subtrai: $\\dfrac{3}{4} - \\dfrac{1}{8} = \\dfrac{5}{8} = 62{,}5\\%$.",
            "Se os eventos não podem acontecer juntos, é só somar mesmo.",
          ],
          answer: "5/8 (62,5%).",
        },
        { type: "heading", text: "Cruzamento-teste (testcross)" },
        {
          type: "paragraph",
          text: "Quer saber se um indivíduo dominante é $AA$ ou $Aa$? Faz o **cruzamento-teste**: cruza ele com um homozigoto recessivo ($aa$). Se sair QUALQUER descendente recessivo, o indivíduo era $Aa$ (porque o $a$ dele apareceu). Se sair 100% dominante, ele é $AA$.",
        },
        {
          type: "example",
          title: "Exemplo",
          text: "Cobaia preta ($B?$) cruzou com branca ($bb$) e nasceram só filhotes pretos → a preta é provavelmente $BB$. Se fosse $Bb$, teria saído branco (prob. 1/2 por filhote).",
        },
        {
          type: "paragraph",
          text: "O **retrocruzamento** é o mesmo cruzamento feito de volta, com um dos pais originais - usado exatamente para esse tipo de teste.",
        },
        { type: "heading", text: "Quando não há dominância" },
        {
          type: "list",
          items: [
            "**Dominância incompleta:** o heterozigoto fica no meio. Cabelo: $CC$ crespo × $LL$ liso → $CL$ ondulado (100%).",
            "**Codominância:** os dois alelos aparecem juntos, sem misturar. É o caso do tipo sanguíneo $I^AI^B$ = AB (os dois marcam presença). Outro exemplo clássico: boi de pelo curto × branco malhado → filho malhado de duas cores.",
          ],
        },
        { type: "heading", text: "Erros que derrubam na prova" },
        { type: "list", items: [
          "Esquecer que gameta leva só UM alelo de cada par.",
          "Confundir 1:2:1 (genótipos) com 3:1 (fenótipos).",
          "Usar soma no lugar de multiplicação no 'E'.",
          "Achar que cruzamento-teste prova $AA$ com poucos filhos - só dá certeza se sair recessivo; se não sair, é 'provavelmente $AA$'.",
        ]},
        { type: "heading", text: "Resumo" },
        { type: "table", headers: ["Tema", "Guarde"], rows: [
          ["DNA/gene/alelo", "DNA = livro; gene = receita; alelo = versão da receita"],
          ["Genótipo × fenótipo", "Receita × bolo pronto"],
          ["$Aa \\times Aa$", "1:2:1 genótipos · 3:1 fenótipos"],
          ["Regra do E / OU", "E multiplica · OU soma (menos a interseção)"],
          ["Cruzamento-teste", "Cruza com $aa$: se sair recessivo, era $Aa$"],
          ["Sem dominância", "Incompleta = meio-termo · codominância = os dois juntos"],
        ]},
      ],
      flashcards: [
        { id: "fc-1", question: "O que é hereditariedade?", answer: "A passagem de características dos pais para os filhos." },
        { id: "fc-2", question: "O que é um gene?", answer: "Um pedaço do DNA com a 'receita' de uma característica." },
        { id: "fc-3", question: "O que são alelos?", answer: "Versões diferentes de um mesmo gene (ex.: A e a)." },
        { id: "fc-4", question: "O que é genótipo?", answer: "A constituição genética (AA, Aa, aa) - a 'receita'." },
        { id: "fc-5", question: "O que é fenótipo?", answer: "A característica que aparece de verdade (o 'bolo pronto')." },
        { id: "fc-6", question: "O que é heterozigoto?", answer: "Indivíduo com alelos diferentes: $Aa$." },
        { id: "fc-7", question: "Enuncie a 1ª Lei de Mendel.", answer: "Na formação dos gametas, os alelos de um par se separam - cada gameta leva um só." },
        { id: "fc-8", question: "Em $Aa \\times Aa$, quais as proporções?", answer: "Genótipos 1:2:1 · fenótipos 3:1." },
        { id: "fc-9", question: "Regra do E (probabilidade)?", answer: "Eventos que acontecem JUNTOS → multiplica as probabilidades." },
        { id: "fc-10", question: "Regra do OU?", answer: "Um OU outro basta → soma as probabilidades (menos a interseção, se houver)." },
        { id: "fc-11", question: "Para que serve o cruzamento-teste?", answer: "Para descobrir se um dominante é $AA$ ou $Aa$: cruza com $aa$; se sair recessivo, era $Aa$." },
        { id: "fc-12", question: "Dominância incompleta é o quê?", answer: "O heterozigoto mostra um fenótipo intermediário (ex.: cabelo ondulado $CL$)." },
        { id: "fc-13", question: "Codominância é o quê?", answer: "Os dois alelos aparecem juntos no fenótipo (ex.: tipo sanguíneo AB)." },
      ],
      questions: [
        { id: "q-1", level: 1, origin: "pratica",
          statement: "Alelos são:",
          alternatives: [
            { id: "a", text: "Versões diferentes de um mesmo gene" },
            { id: "b", text: "Cromossomos de células diferentes" },
            { id: "c", text: "Pedaços do DNA que formam um cromossomo" },
            { id: "d", text: "Características observáveis" }
          ],
          correctAlternativeId: "a",
          explanation: "Alelo = versão do gene (A e a). Gene é o pedaço do DNA; cromossomo carrega vários genes; fenótipo é o observável." },
        { id: "q-2", level: 1, origin: "pratica",
          statement: "Genótipo e fenótipo, na analogia da receita:",
          alternatives: [
            { id: "a", text: "Genótipo é o bolo pronto e fenótipo é a receita" },
            { id: "b", text: "São a mesma coisa" },
            { id: "c", text: "Genótipo é a receita (AA/Aa/aa) e fenótipo é o bolo pronto" },
            { id: "d", text: "Nenhum dos dois existe" }
          ],
          correctAlternativeId: "c",
          explanation: "Genótipo = o que está escrito nos genes (receita). Fenótipo = o que aparece (bolo)." },
        { id: "q-3", level: 2, origin: "pratica",
          statement: "No cruzamento $Aa \\times Aa$ com dominância completa, a proporção fenotípica é:",
          alternatives: [
            { id: "a", text: "3:1" },
            { id: "b", text: "1:2:1" },
            { id: "c", text: "1:1" },
            { id: "d", text: "9:3:3:1" }
          ],
          correctAlternativeId: "a",
          explanation: "1:2:1 é genotípica (AA:Aa:aa). Fenotipicamente AA e Aa são iguais → 3:1." },
        { id: "q-4", level: 2, origin: "pratica",
          statement: "P(menina) = 1/2 e P(albino) = 1/4. A probabilidade de nascer menina E albina (regra do E) é:",
          alternatives: [
            { id: "a", text: "1/2" },
            { id: "b", text: "3/4" },
            { id: "c", text: "1/8" },
            { id: "d", text: "5/8" }
          ],
          correctAlternativeId: "c",
          explanation: "'E' (junto) → multiplica: $\\dfrac{1}{2} \\times \\dfrac{1}{4} = \\dfrac{1}{8}$." },
        { id: "q-5", level: 3, origin: "pratica",
          statement: "Mesmos dados: P(menina OU albina), pela regra do OU, é:",
          alternatives: [
            { id: "a", text: "1/8" },
            { id: "b", text: "5/8" },
            { id: "c", text: "1/2" },
            { id: "d", text: "3/4" }
          ],
          correctAlternativeId: "b",
          explanation: "OU → soma e tira a dupla contagem: $\\dfrac{1}{2} + \\dfrac{1}{4} - \\dfrac{1}{8} = \\dfrac{5}{8}$." },
        { id: "q-6", level: 3, origin: "pratica",
          statement: "No cruzamento-teste, um animal de fenótipo dominante cruzou com homozigoto recessivo ($aa$) e nasceram 10 filhotes, todos dominantes. A conclusão correta é:",
          alternatives: [
            { id: "a", text: "Ele é provavelmente $AA$, pois se fosse $Aa$ cada filhote teria 50% de chance de ser recessivo" },
            { id: "b", text: "Ele é obrigatoriamente $AA$" },
            { id: "c", text: "Ele é $Aa$ com certeza" },
            { id: "d", text: "Nada se pode concluir" }
          ],
          correctAlternativeId: "a",
          explanation: "Se fosse $Aa$, a chance de 10 filhos todos dominantes seria $(1/2)^{10}$, muito pequena. Com poucos filhos não dá certeza absoluta - dá 'provavelmente $AA$'. Certeza só vem se nascer recessivo." },
        { id: "q-7", level: 2, origin: "pratica",
          statement: "Retrocruzamento $Aa \\times aa$ produz descendentes na proporção:",
          alternatives: [
            { id: "a", text: "1:2:1" },
            { id: "b", text: "3:1" },
            { id: "c", text: "1:1 (Aa : aa)" },
            { id: "d", text: "100% aa" }
          ],
          correctAlternativeId: "c",
          explanation: "Gametas: $A$, $a$ de um lado e $a$ do outro → $Aa$ e $aa$ → 1:1 (50% dominante, 50% recessivo)." },
        { id: "q-8", level: 2, origin: "pratica",
          statement: "Na ausência de dominância, o cruzamento $CC \\times LL$ (cabelo crespo × liso) gera:",
          alternatives: [
            { id: "a", text: "100% crespos" },
            { id: "b", text: "100% lisos" },
            { id: "c", text: "50% crespos, 50% lisos" },
            { id: "d", text: "100% ondulados ($CL$)" },
          ],
          correctAlternativeId: "d",
          explanation: "Dominância incompleta: heterozigoto $CL$ = ondulado. Todos recebem $C$ e $L$ → 100% $CL$." },
      ],
      videos: [VIDEO_PLAYLIST_BIOLOGIA],
    },
    /* ═══════════════════════════════════════════════════════
       PARTE 2 — GRUPOS SANGUÍNEOS, GENES LETAIS, HERANÇA SEXUAL E HEREDOGRAMAS
       ═══════════════════════════════════════════════════════ */
    {
      id: "grupos-sanguineos-letais-sexo-heredogramas",
      number: 2,
      title: "Grupos sanguíneos, genes letais e herança sexual",
      description:
        "Sistema ABO e fator Rh, genes letais, herança ligada ao X (daltonismo e hemofilia) e como ler heredogramas passo a passo.",
      icon: "heart-pulse",
      objectives: [
        { id: "obj-1", text: "Resolver cruzamentos do sistema ABO e lembrar doador/receptor universal" },
        { id: "obj-2", text: "Explicar o fator Rh e a eritroblastose fetal" },
        { id: "obj-3", text: "Calcular proporções com genes letais (homozigose letal)" },
        { id: "obj-4", text: "Resolver problemas de herança ligada ao X" },
        { id: "obj-5", text: "Ler e interpretar heredogramas para achar genótipos e probabilidades" },
      ],
      theory: [
        { type: "heading", text: "Sistema ABO: três alelos, um gene" },
        {
          type: "paragraph",
          text: "O tipo sanguíneo vem de um gene com **três alelos**: $I^A$, $I^B$ e $i$. Aqui acontece **codominância**: $I^A$ e $I^B$ têm a mesma força e os dois aparecem juntos no tipo AB. Os dois dominam o $i$.",
        },
        {
          type: "table",
          headers: ["Genótipo", "Tipo sanguíneo"],
          rows: [
            ["$I^AI^A$ ou $I^Ai$", "A"],
            ["$I^BI^B$ ou $I^Bi$", "B"],
            ["$I^AI^B$", "AB"],
            ["$ii$", "O"],
          ],
        },
        {
          type: "paragraph",
          text: "Macete de fenótipo → genótipo: tipo A pode ser $I^AI^A$ ou $I^Ai$; tipo B pode ser $I^BI^B$ ou $I^Bi$; tipo AB só pode ser $I^AI^B$; tipo O só pode ser $ii$.",
        },
        {
          type: "solved-example",
          title: "Cruzamento ABO",
          statement: "Pai $I^Ai$ (tipo A) × mãe $I^Bi$ (tipo B). Qual a P de filho tipo O?",
          steps: [
            "Gametas do pai: $I^A$, $i$. Da mãe: $I^B$, $i$.",
            "Combinações: $I^AI^B$ (AB), $I^Ai$ (A), $I^Bi$ (B), $ii$ (O).",
            "Só 1 em 4 é $ii$ → $\\dfrac{1}{4}$ = 25%.",
          ],
          answer: "25%.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Doação de sangue",
          text: "**Doador universal:** tipo O negativo (O−) - não tem antígenos A, B nem Rh. **Receptor universal:** tipo AB positivo (AB+) - tem os três antígenos, então não produz anticorpos contra nenhum. O plasma segue regra inversa, mas na prova vale a regra clássica.",
        },
        { type: "heading", text: "Fator Rh e eritroblastose fetal" },
        {
          type: "paragraph",
          text: "Além do ABO, tem o fator Rh: alelo dominante $R$ (Rh+) e recessivo $r$ (Rh−). Então $RR$ e $Rr$ são Rh+; só $rr$ é Rh−.",
        },
        {
          type: "paragraph",
          text: "A **eritroblastose fetal** (doença hemolítica do recém-nascido) acontece quando a mãe é **Rh− e fica sensibilizada**: o primeiro contato dela com sangue Rh+ (transfusão ou um filho Rh+) faz o corpo dela fabricar **anticorpos anti-Rh**. Na próxima gestação com feto Rh+, esses anticorpos passam pela placenta e atacam as hemácias do bebê.",
        },
        { type: "list", items: [
          "Primeiro contato com sangue Rh+ → sensibilização (a mãe passa a ter os anticorpos).",
          "Gestação seguinte com feto Rh+ → risco real de eritroblastose.",
          "Hoje existe prévention com imunoglobulina anti-Rh, que impede a sensibilização.",
        ]},
        { type: "heading", text: "Genes letais" },
        {
          type: "paragraph",
          text: "Alelo letal é aquele que mata em **homozigose** (dose dupla). Na hora de contar, esse genótipo **não entra** entre os sobreviventes - e a proporção muda!",
        },
        {
          type: "table",
          headers: ["Situação", "Quadro inicial", "Sobreviventes", "Proporção final"],
          rows: [
            ["Letal recessivo: $aa$ morre", "1 $AA$ : 2 $Aa$ : 1 $aa$", "$aa$ sai", "1 $AA$ : 2 $Aa$ → 1/3 e 2/3"],
            ["Letal dominante em homozigose: $AA$ morre", "1 $AA$ : 2 $Aa$ : 1 $aa$", "$AA$ sai", "2 $Aa$ : 1 $aa$ → 2/3 e 1/3"],
          ],
        },
        {
          type: "solved-example",
          title: "Questão clássica de prova",
          statement: "Moscas $Aa \\times Aa$, com $aa$ letal, dieron 180 adultos. Quantos são $Aa$?",
          steps: [
            "Sobreviventes: 1 $AA$ : 2 $Aa$ → heterozigotos são $\\dfrac{2}{3}$.",
            "$\\dfrac{2}{3} \\times 180 = 120$.",
          ],
          answer: "120 heterozigotos.",
        },
        { type: "heading", text: "Herança ligada ao sexo (X)" },
        {
          type: "paragraph",
          text: "Mulher tem cromossomos XX; homem, XY. Alguns genes ficam só no X - e aí a herança muda, porque o homem tem só uma cópia. Os clássicos: **daltonismo** e **hemofilia**, ambos recessivos ligados ao X.",
        },
        {
          type: "paragraph",
          text: "Representação: $X^D$ = normal, $X^d$ = daltônico. Mulher $X^dX^d$ é daltônica; $X^DX^d$ é **portadora** (normal, mas carrega). Homem $X^dY$ é daltônico - basta um $X^d$.",
        },
        {
          type: "solved-example",
          title: "Cruzamento clássico",
          statement: "Mulher portadora ($X^DX^d$) × homem normal ($X^DY$). Qual a P de nascer filho homem daltônico?",
          steps: [
            "Gametas da mãe: $X^D$, $X^d$. Do pai: $X^D$, $Y$.",
            "Filhos homens pegam o $Y$ do pai: $X^DY$ (normal) ou $X^dY$ (daltônico) → 1 em 2 dos homens.",
            "Como metade dos filhos é homem: P(menino daltônico) = $\\dfrac{1}{2} \\times \\dfrac{1}{2} = \\dfrac{1}{4}$ = 25%.",
            "Filhas nunca são daltônicas nesse cruzamento (recebem $X^D$ do pai), mas 50% são portadoras.",
          ],
          answer: "25% de chance de filho homem daltônico.",
        },
        {
          type: "paragraph",
          text: "**Herança influenciada pelo sexo** é quando o mesmo alelo age diferente no homem e na mulher - exemplo clássico: a calvície é dominante no homem e recessiva na mulher.",
        },
        { type: "heading", text: "Heredogramas, passo a passo" },
        {
          type: "paragraph",
          text: "Heredograma é a árvore genealógica da família. Símbolos: **quadrado** = homem, **círculo** = mulher, **símbolo cheio** = afetado, **vazio** = não afetado. Linhas horizontais = casal; verticais descem pros filhos; algarismos romanos = gerações.",
        },
        { type: "list", style: "number", items: [
          "Pergunte primeiro: a característica é dominante ou recessiva? Se dois pais NÃO afetados têm filho afetado → é **recessiva** (e os pais são heterozigotos).",
          "Se o afetado tem sempre pelo menos um pai afetado → tende a ser **dominante**.",
          "Se a característica pula geração e aparece mais em homens → desconfie de **ligada ao X recessiva**.",
          "Aí é só atribuir letras e calcular a probabilidade pedida.",
        ]},
        {
          type: "solved-example",
          title: "Lendo um heredograma",
          statement: "No heredograma, um casal não afetado tem uma filha afetada (característica recessiva). Qual a P de o próximo filho ser afetado?",
          steps: [
            "Filha afetada recessiva = $aa$ → ela recebeu $a$ do pai e $a$ da mãe.",
            "Pais não afetados com $a$ → os dois são $Aa$.",
            "Próximo filho: $Aa \\times Aa$ → P($aa$) = $\\dfrac{1}{4}$ = 25%.",
          ],
          answer: "25%.",
        },
        { type: "heading", text: "Resumo" },
        { type: "table", headers: ["Tema", "Guarde"], rows: [
          ["ABO", "$I^A$, $I^B$ codominantes; $i$ recessivo; O = $ii$; doador univ. O−, receptor univ. AB+"],
          ["Rh", "$rr$ = Rh−; mãe Rh− sensibilizada + feto Rh+ → eritroblastose"],
          ["Letal recessivo $aa$", "Sobreviventes 1 $AA$ : 2 $Aa$ → 2/3 heterozigotos"],
          ["Letal dominante $AA$", "Sobreviventes 2 $Aa$ : 1 $aa$ → 2/3 $Aa$"],
          ["Ligada ao X", "Homem $X^dY$ é afetado; mulher precisa de $X^dX^d$; portadora $X^DX^d$"],
          ["Heredograma", "Pais não afetados + filho afetado → recessiva e pais $Aa$"],
        ]},
      ],
      flashcards: [
        { id: "fc-1", question: "Quais os alelos do sistema ABO e como se relacionam?", answer: "$I^A$ e $I^B$ (codominantes) e $i$ (recessivo). AB = $I^AI^B$; O = $ii$." },
        { id: "fc-2", question: "Quem é o doador universal e quem é o receptor universal?", answer: "Doador universal: O−. Receptor universal: AB+." },
        { id: "fc-3", question: "Qual genótipo é Rh negativo?", answer: "$rr$. ($RR$ e $Rr$ são Rh+.)" },
        { id: "fc-4", question: "O que causa a eritroblastose fetal?", answer: "Mãe $rr$ sensibilizada (contato com sangue Rh+) gera anticorpos anti-Rh que atacam o feto Rh+ na próxima gestação." },
        { id: "fc-5", question: "O que é gene letal?", answer: "Alelo que mata em homozigose; esse genótipo sai da contagem dos sobreviventes." },
        { id: "fc-6", question: "$Aa \\times Aa$ com $aa$ letal: fração de $Aa$ entre os adultos?", answer: "2/3 (sobreviventes 1 $AA$ : 2 $Aa$)." },
        { id: "fc-7", question: "$Aa \\times Aa$ com $AA$ letal (dose dupla): fração de $Aa$ entre os sobreviventes?", answer: "2/3 (sobrevivem 2 $Aa$ : 1 $aa$)." },
        { id: "fc-8", question: "Daltonismo é ligado a qual cromossomo?", answer: "Ao X, recessivo. Homem $X^dY$ é daltônico; mulher precisa de $X^dX^d$." },
        { id: "fc-9", question: "Quem é 'portadora' em herança ligada ao X?", answer: "A mulher $X^DX^d$: normal, mas carrega o alelo recessivo e pode passar pros filhos." },
        { id: "fc-10", question: "No heredograma, quadrado e círculo representam o quê?", answer: "Quadrado = homem; círculo = mulher; cheio = afetado." },
        { id: "fc-11", question: "Pais não afetados têm filho afetado: o que isso indica?", answer: "Que a característica é recessiva e os pais são heterozigotos ($Aa$)." },
        { id: "fc-12", question: "No heredograma ligado ao X, por que aparece mais em homens?", answer: "Porque o homem tem só um X - basta um alelo recessivo pra se manifestar." },
        { id: "fc-13", question: "Mãe portadora $X^DX^d$ × pai normal: P de filho homem daltônico?", answer: "1/4 (25%): metade dos filhos é homem e metade desses reçoit $X^d$." },
      ],
      questions: [
        { id: "q-1", level: 2, origin: "pratica",
          statement: "Pai $I^Ai$ × mãe $I^Bi$. A probabilidade de filho tipo O ($ii$) é:",
          alternatives: [
            { id: "a", text: "0%" },
            { id: "b", text: "50%" },
            { id: "c", text: "25%" },
            { id: "d", text: "75%" }
          ],
          correctAlternativeId: "c",
          explanation: "Gametas $I^A$/$i$ e $I^B$/$i$ → 4 combinações, só $ii$ é tipo O → 1/4 = 25%." },
        { id: "q-2", level: 1, origin: "pratica",
          statement: "Sobre doação de sangue no sistema ABO/Rh:",
          alternatives: [
            { id: "a", text: "Doador universal é AB+ e receptor universal é O−" },
            { id: "b", text: "Doador universal é O− e receptor universal é AB+" },
            { id: "c", text: "Todo mundo pode doar pra todo mundo" },
            { id: "d", text: "O− só pode doar pra O−" },
          ],
          correctAlternativeId: "b",
          explanation: "O− não tem antígenos (doa pra todos). AB+ tem todos os antígenos, então não produz anticorpos contra nenhum (recebe de todos)." },
        { id: "q-3", level: 3, origin: "pratica",
          statement: "Uma mulher Rh− ($rr$) recebeu transfusão de sangue Rh+ e teve um primeiro filho normal. O risco na próxima gestação com feto Rh+ é:",
          alternatives: [
            { id: "a", text: "Nenhum, porque o primeiro filho foi normal" },
            { id: "b", text: "Alto: ela ficou sensibilizada e os anticorpos anti-Rh podem causar eritroblastose no feto Rh+" },
            { id: "c", text: "Só se o feto for Rh−" },
            { id: "d", text: "Risco só se ela doar sangue" },
          ],
          correctAlternativeId: "b",
          explanation: "O contato com sangue Rh+ sensibilizou a mãe (ela fez anticorpos anti-Rh). Na próxima gestação com feto Rh+, os anticorpos atravessam a placenta e atacam as hemácias do bebê." },
        { id: "q-4", level: 3, origin: "pratica",
          statement: "Moscas $Aa \\times Aa$ com $aa$ letal produziram 180 adultos. Quantos são heterozigotos?",
          alternatives: [
            { id: "a", text: "60" },
            { id: "b", text: "120" },
            { id: "c", text: "90" },
            { id: "d", text: "45" }
          ],
          correctAlternativeId: "b",
          explanation: "$aa$ morre → sobreviventes 1 $AA$ : 2 $Aa$ → $Aa$ = 2/3. $\\dfrac{2}{3} \\times 180 = 120$." },
        { id: "q-5", level: 3, origin: "pratica",
          statement: "Em $Aa \\times Aa$, o alelo $A$ é letal em homozigose ($AA$ morre). Entre os sobreviventes, a fração de $aa$ é:",
          alternatives: [
            { id: "a", text: "1/3" },
            { id: "b", text: "1/4" },
            { id: "c", text: "2/3" },
            { id: "d", text: "1/2" }
          ],
          correctAlternativeId: "a",
          explanation: "$AA$ sai → sobram 2 $Aa$ : 1 $aa$ → $aa$ = 1/3 dos sobreviventes." },
        { id: "q-6", level: 3, origin: "pratica",
          statement: "Mãe portadora de daltonismo ($X^DX^d$) × pai normal ($X^DY$). A P de nascer um filho homem daltônico é:",
          alternatives: [
            { id: "a", text: "1/2" },
            { id: "b", text: "1/8" },
            { id: "c", text: "1/4" },
            { id: "d", text: "0%" }
          ],
          correctAlternativeId: "c",
          explanation: "Metade dos filhos é homem ($Y$ do pai); desses, metade recebe $X^d$ → $\\dfrac{1}{2} \\times \\dfrac{1}{2} = \\dfrac{1}{4}$." },
        { id: "q-7", level: 4, origin: "pratica",
          statement: "Num heredograma recessivo, um casal não afetado tem uma filha afetada. A P de o próximo filho (de qualquer sexo) ser afetado é:",
          alternatives: [
            { id: "a", text: "50%" },
            { id: "b", text: "25%" },
            { id: "c", text: "75%" },
            { id: "d", text: "100%" }
          ],
          correctAlternativeId: "b",
          explanation: "Filha afetada $aa$ → pais são $Aa \\times Aa$ → próximo filho $aa$ com P = 1/4 = 25%." },
        { id: "q-8", level: 1, origin: "pratica",
          statement: "Um homem com sangue AB+ pode doar hemácias para:",
          alternatives: [
            { id: "a", text: "Qualquer pessoa" },
            { id: "b", text: "A, B, AB e O" },
            { id: "c", text: "Somente O−" },
            { id: "d", text: "Somente AB+" }
          ],
          correctAlternativeId: "d",
          explanation: "AB+ tem antígenos A, B e Rh → só pode doar para quem também tem os três: AB+ (e AB− em emergências, mas a regra clássica é AB+)." },
      ],
      videos: [VIDEO_PLAYLIST_BIOLOGIA],
    },
    /* ═══════════════════════════════════════════════════════
       PARTE 3 — 2ª LEI DE MENDEL E HERANÇA QUANTITATIVA
       ═══════════════════════════════════════════════════════ */
    {
      id: "segunda-lei-e-heranca-quantitativa",
      number: 3,
      title: "2ª Lei de Mendel e herança quantitativa",
      description:
        "Segregação independente, fórmula dos gametas (2^n), quadro 4×4 e proporção 9:3:3:1; e poligenia com triângulo de Pascal, curva de Gauss e cálculos de altura/peso.",
      icon: "activity",
      objectives: [
        { id: "obj-1", text: "Aplicar a 2ª Lei: gametas de um di-híbrido e o quadro 4×4" },
        { id: "obj-2", text: "Usar a fórmula 2^n para o número de gametas" },
        { id: "obj-3", text: "Calcular probabilidades no di-híbrido separando os genes" },
        { id: "obj-4", text: "Resolver problemas de herança quantitativa (2n+1, contribuição, proporções de Pascal)" },
      ],
      theory: [
        { type: "heading", text: "A 2ª Lei: genes em cromossomos diferentes" },
        {
          type: "paragraph",
          text: "A 1ª lei cuida de UM gene ($Aa \\times Aa$). A **2ª Lei de Mendel** (segregação independente) cuida de DOIS genes ao mesmo tempo, quando eles estão em cromossomos diferentes (ou bem longe no mesmo): na formação dos gametas, os alelos se separam **independentemente** - a escolha de um não interfere na do outro.",
        },
        { type: "heading", text: "Quantos gametas? A fórmula 2^n" },
        { type: "formula", text: "\\text{nº de gametas} = 2^n" },
        {
          type: "quantities",
          items: [{ symbol: "n", name: "número de genes heterozigotos (Aa, Bb, Cc...)" }],
        },
        {
          type: "example",
          title: "Exemplo",
          text: "$AaBb$ tem $n = 2$ → $2^2 = 4$ gametas: $AB$, $Ab$, $aB$, $ab$. Um tri-híbrido $AaBbCc$ ($n=3$) faria $2^3 = 8$ gametas.",
        },
        { type: "heading", text: "O quadro 4×4: AaBb × AaBb" },
        {
          type: "paragraph",
          text: "Coloque os 4 gametas de cada lado e cruze tudo - dá 16 casas:",
        },
        {
          type: "table",
          headers: ["", "$AB$", "$Ab$", "$aB$", "$ab$"],
          rows: [
            ["$AB$", "$AABB$", "$AABb$", "$AaBB$", "$AaBb$"],
            ["$Ab$", "$AABb$", "$AAbb$", "$AaBb$", "$Aabb$"],
            ["$aB$", "$AaBB$", "$AaBb$", "$aaBB$", "$aaBb$"],
            ["$ab$", "$AaBb$", "$Aabb$", "$aaBb$", "$aabb$"],
          ],
        },
        {
          type: "paragraph",
          text: "Contando os FENÓTIPOS (com dominância completa nos dois): quem tem pelo menos um $A$ e um $B$ ($A_B_$) = 9; só $A$ = 3; só $B$ = 3; nenhum = 1. A proporción clássica:",
        },
        { type: "formula", text: "9 : 3 : 3 : 1 \\; (\\text{de } 16)" },
        { type: "callout", variant: "info", title: "A notação com traço", text: "$A_B_$ = 'tem $A$ (AA ou Aa) E $B$ (BB ou Bb)'. Traço = tanto faz." },
        { type: "heading", text: "Probabilidade sem desenhar 16 casas" },
        {
          type: "solved-example",
          title: "Separando os genes",
          statement: "Em $AaBb \\times AaBb$, qual a P de nascer $aaB_$?",
          steps: [
            "Gene A: $Aa \\times Aa$ → $P(aa) = \\dfrac{1}{4}$.",
            "Gene B: $Bb \\times Bb$ → $P(B_) = \\dfrac{3}{4}$.",
            "Independentes → multiplica: $\\dfrac{1}{4} \\times \\dfrac{3}{4} = \\dfrac{3}{16}$.",
          ],
          answer: "3/16.",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Exceção",
          text: "Se os dois genes ficam próximos no MESMO cromossomo (ligação gênica), eles não segregam independente e a 9:3:3:1 não vale. Na prova do EM, assuma independente a não ser que diga o contrário.",
        },
        { type: "heading", text: "Herança quantitativa: muitos genes, uma característica" },
        {
          type: "paragraph",
          text: "Altura, peso, cor da pele... essas características não são 'tem/não tem' - elas variam continuamente. Isso acontece porque **vários genes** atuam juntos, cada um somando um pouquinho: é a **poligenia** (herança quantitativa). No modelo da prova, cada **alelo aditivo** soma uma mesma quantidade.",
        },
        {
          type: "paragraph",
          text: "O número de fenótipos na F2 vem da fórmula:",
        },
        { type: "formula", text: "2n + 1" },
        {
          type: "paragraph",
          text: "E as proporções de cada classe fenotípica saem do **triângulo de Pascal** - que vira uma **curva de sino (Gauss)**: a classe do meio é a mais comum, e as pontas vão rareando.",
        },
        {
          type: "table",
          headers: ["Nº de alelos aditivos (2n)", "Triângulo de Pascal", "Proporções"],
          rows: [
            ["2 (n=1)", "1 : 2 : 1", "1:2:1"],
            ["4 (n=2)", "1 : 4 : 6 : 4 : 1", "1:4:6:4:1"],
            ["6 (n=3)", "1 : 6 : 15 : 20 : 15 : 6 : 1", "1:6:15:20:15:6:1"],
          ],
        },
        { type: "heading", text: "Quanto cada alelo soma?" },
        { type: "formula", text: "\\text{contribuição} = \\dfrac{\\text{máximo} - \\text{mínimo}}{2n}" },
        {
          type: "callout",
          variant: "info",
          title: "O denominador 4^n",
          text: "Na F2 de $n$ pares heterozigotos, o total de combinações é $4^n$. Para $n=3$: $4^3 = 64$. É esse o denominador das frações.",
        },
        {
          type: "solved-example",
          title: "O problema do milho (clássico de prova)",
          statement: "Milho varia de 150 cm a 300 cm. Cruzaram-se linhagens homozigóticas dos extremos; a F2 mostrou 7 fenótipos e tinha 384 plantas. Responda: a) quantos alelos aditivos? b) quanto cada um soma? c) quantas plantas medem 250 cm?",
          steps: [
            "**a)** 7 fenótipos → $7 = 2n+1$ → $n = 3$ pares → $2n = 6$ alelos aditivos.",
            "**b)** $(300 - 150) / 6 = 25$ cm por alelo.",
            "**c)** 250 cm = 150 + 100 = 150 + 4×25 → classe de 4 alelos → na série 1:6:15:20:15:6:1, a classe 4 é $\\dfrac{15}{64}$.",
            "$\\dfrac{15}{64} \\times 384 = 90$ plantas.",
          ],
          answer: "a) 6 alelos (3 pares) · b) 25 cm · c) 90 plantas.",
        },
        { type: "heading", text: "Resumo" },
        { type: "table", headers: ["Tema", "Guarde"], rows: [
          ["Gametas", "$2^n$ (n = genes heterozigotos)"],
          ["$AaBb \\times AaBb$", "16 casas · 9:3:3:1"],
          ["Probabilidade", "Separe por gene e multiplique (ex.: $aaB_ = \\dfrac{3}{16}$)"],
          ["Poligenia", "$2n+1$ fenótipos · Pascal · curva de sino"],
          ["Contribuição", "(máx − mín) / $2n$"],
          ["Denominador F2", "$4^n$ (n=3 → 64)"],
        ]},
      ],
      flashcards: [
        { id: "fc-1", question: "O que diz a 2ª Lei de Mendel?", answer: "Genes em cromossomos diferentes segregam de forma independente na formação dos gametas." },
        { id: "fc-2", question: "Fórmula do número de gametas?", answer: "$2^n$, com $n$ = número de genes heterozigotos." },
        { id: "fc-3", question: "Gametas de $AaBb$?", answer: "$AB$, $Ab$, $aB$, $ab$ (4)." },
        { id: "fc-4", question: "Quantos gametas faz $AaBbCc$?", answer: "$2^3 = 8$." },
        { id: "fc-5", question: "Proporção fenotípica do di-híbrido?", answer: "9:3:3:1 (de 16)." },
        { id: "fc-6", question: "P de $aaB_$ em $AaBb \\times AaBb$?", answer: "$\\dfrac{1}{4} \\times \\dfrac{3}{4} = \\dfrac{3}{16}$." },
        { id: "fc-7", question: "O que quebra a 2ª lei?", answer: "Ligação gênica: genes próximos no mesmo cromossomo." },
        { id: "fc-8", question: "O que é herança quantitativa (poligenia)?", answer: "Vários genes somando pouco cada um → variação contínua (altura, peso)." },
        { id: "fc-9", question: "Fórmula do nº de fenótipos na F2?", answer: "$2n + 1$." },
        { id: "fc-10", question: "Proporções com 3 pares de genes (Pascal)?", answer: "1:6:15:20:15:6:1 (soma 64) - curva de sino." },
        { id: "fc-11", question: "Como acha a contribuição de cada alelo aditivo?", answer: "(fenótipo máx − mín) ÷ $2n$." },
        { id: "fc-12", question: "De onde vem o denominador 64?", answer: "$4^3 = 64$ combinações na F2 de 3 pares heterozigotos." },
        { id: "fc-13", question: "Milho 150-300 cm, 7 fenótipos: quanto vale cada alelo?", answer: "(300−150)/6 = 25 cm." },
      ],
      questions: [
        { id: "q-1", level: 1, origin: "pratica",
          statement: "Um indivíduo $AaBb$ produz quantos tipos de gametas?",
          alternatives: [
            { id: "a", text: "2" },
            { id: "b", text: "8" },
            { id: "c", text: "4" },
            { id: "d", text: "16" }
          ],
          correctAlternativeId: "c",
          explanation: "$2^n = 2^2 = 4$ gametas ($AB$, $Ab$, $aB$, $ab$)." },
        { id: "q-2", level: 2, origin: "pratica",
          statement: "Pela fórmula $2^n$, um tri-híbrido $AaBbCc$ produz quantos gametas?",
          alternatives: [
            { id: "a", text: "6" },
            { id: "b", text: "27" },
            { id: "c", text: "9" },
            { id: "d", text: "8" }
          ],
          correctAlternativeId: "d",
          explanation: "$n = 3$ → $2^3 = 8$ gametas." },
        { id: "q-3", level: 2, origin: "pratica",
          statement: "Em $AaBb \\times AaBb$ com dominância completa, a proporção fenotípica é:",
          alternatives: [
            { id: "a", text: "9:3:3:1" },
            { id: "b", text: "1:2:1" },
            { id: "c", text: "3:1" },
            { id: "d", text: "1:1:1:1" }
          ],
          correctAlternativeId: "a",
          explanation: "16 descendentes: 9 $A_B_$, 3 $A_bb$, 3 $aaB_$, 1 $aabb$ → 9:3:3:1." },
        { id: "q-4", level: 2, origin: "pratica",
          statement: "Em $AaBb \\times AaBb$, P de $aaB_$ é:",
          alternatives: [
            { id: "a", text: "1/16" }, { id: "b", text: "3/16" }, { id: "c", text: "9/16" }, { id: "d", text: "1/4" },
          ],
          correctAlternativeId: "b",
          explanation: "$P(aa) = 1/4$, $P(B_) = 3/4$ → $\\dfrac{1}{4} \\times \\dfrac{3}{4} = \\dfrac{3}{16}$." },
        { id: "q-5", level: 3, origin: "pratica",
          statement: "De 320 descendentes de $AaBb \\times AaBb$, quantos devem ser $A_B_$ (duas dominantes)?",
          alternatives: [
            { id: "a", text: "60" },
            { id: "b", text: "240" },
            { id: "c", text: "180" },
            { id: "d", text: "80" }
          ],
          correctAlternativeId: "c",
          explanation: "$A_B_ = \\dfrac{9}{16}$ → $\\dfrac{9}{16} \\times 320 = 180$." },
        { id: "q-6", level: 2, origin: "pratica",
          statement: "Uma F2 mostra 7 fenótipos de uma característica quantitativa. Quantos pares de genes?",
          alternatives: [
            { id: "a", text: "2" },
            { id: "b", text: "6" },
            { id: "c", text: "7" },
            { id: "d", text: "3" }
          ],
          correctAlternativeId: "d",
          explanation: "$7 = 2n+1$ → $n = 3$ pares (6 alelos aditivos)." },
        { id: "q-7", level: 3, origin: "pratica",
          statement: "Plantas variam de 100 cm a 220 cm com 3 pares de genes. Quanto cada alelo aditivo soma?",
          alternatives: [
            { id: "a", text: "60 cm" },
            { id: "b", text: "30 cm" },
            { id: "c", text: "40 cm" },
            { id: "d", text: "20 cm" }
          ],
          correctAlternativeId: "d",
          explanation: "3 pares → $2n = 6$ alelos. $(220-100)/6 = 20$ cm." },
        { id: "q-8", level: 3, origin: "pratica",
          statement: "No milho (150-300 cm, 7 fenótipos), numa F2 de 384 plantas, quantas medem 250 cm?",
          alternatives: [
            { id: "a", text: "60" },
            { id: "b", text: "120" },
            { id: "c", text: "90" },
            { id: "d", text: "30" }
          ],
          correctAlternativeId: "c",
          explanation: "250 cm = 150 + 4×25 → classe 4 alelos = $\\dfrac{15}{64}$. $\\dfrac{15}{64} \\times 384 = 90$." },
      ],
      videos: [VIDEO_PLAYLIST_BIOLOGIA],
    },
    /* ═══════════════════════════════════════════════════════
       PARTE 4 — INTERAÇÃO GÊNICA E PLEIOTROPIA
       ═══════════════════════════════════════════════════════ */
    {
      id: "interacao-genica-e-pleiotropia",
      number: 4,
      title: "Interação gênica e pleiotropia",
      description:
        "Quando vários genes controlam UMA característica: interação simples (9:3:3:1), epistasia dominante (12:3:1), epistasia recessiva (9:3:4) e complementar (9:7); e pleiotropia (um gene, várias características).",
      icon: "git-branch",
      objectives: [
        { id: "obj-1", text: "Diferenciar 2ª Lei, pleiotropia e interação gênica" },
        { id: "obj-2", text: "Reconhecer as proporções 9:3:3:1, 12:3:1, 9:3:4 e 9:7" },
        { id: "obj-3", text: "Resolver cruzamentos de epistasia e complementar" },
        { id: "obj-4", text: "Dar exemplo de pleiotropia" },
      ],
      theory: [
        { type: "heading", text: "Três jeitos de um gene aparecer" },
        {
          type: "list",
          items: [
            "**2ª Lei de Mendel:** genes diferentes controlam características DIFERENTES (olho e cabelo) → 9:3:3:1.",
            "**Pleiotropia:** UM gene controla VÁrias características. Exemplo clássico: a anemia falciforme - um gene muda a hemoglobina e isso afeta o sangue inteiro (anemia, dores, resistência à malária...).",
            "**Interação gênica:** VÁRIOS genes controlam UMA só característica. É o foco desta parte.",
          ],
        },
        { type: "heading", text: "Interação simples: crista de galinha (9:3:3:1)" },
        {
          type: "paragraph",
          text: "Dois genes ($C$ e $P$) decidem o formato da crista: $C_P_$ = crista de noz; $C_pp$ = ervilha; $ccP_$ = rosa; $ccpp$ = simples. Cruzando $CcPp \\times CcPp$, a proporção é a mesma da 2ª lei - **9:3:3:1** - porque são dois genes independentes agindo na MESMA característica.",
        },
        { type: "heading", text: "Epistasia dominante (12:3:1)" },
        {
          type: "paragraph",
          text: "**Epistasia** é quando um gene **mascara** o efeito do outro. Na dominante, um alelo dominante de um gene esconde o outro gene inteiro. Exemplo: gene $W$ (dominante) inibe a pigmentação → $W_ $ = branco, não importa o resto. Só quem é $ww$ mostra cor: $wwB_$ = preto, $wwbb$ = albino.",
        },
        {
          type: "solved-example",
          title: "Cruzamento $WwBb \\times WwBb$",
          statement: "Qual a proporção fenotípica e qual a P de filho branco?",
          steps: [
            "$W_ $ (WW ou Ww) = $\\dfrac{3}{4}$ → branco, qualquer que seja o gene B.",
            "$wwB_$: $\\dfrac{1}{4} \\times \\dfrac{3}{4} = \\dfrac{3}{16}$ → preto.",
            "$wwbb$: $\\dfrac{1}{4} \\times \\dfrac{1}{4} = \\dfrac{1}{16}$ → albino.",
            "Proporção: $\\dfrac{12}{16} : \\dfrac{3}{16} : \\dfrac{1}{16}$ = **12:3:1**. P(branco) = 12/16 = 75%.",
          ],
          answer: "12:3:1 (branco:preto:albino); P(branco) = 75%.",
        },
        { type: "heading", text: "Epistasia recessiva (9:3:4)" },
        {
          type: "paragraph",
          text: "Aqui quem mascara é um homozigoto RECESSIVO. Exemplo clássico: cor de pelo de labrador. Gene $B$: $B_$ = preto, $bb$ = chocolate. Gene $E$: $E_$ permite depositar o pigmento; $ee$ = amarelo (epistático - esconde o B).",
        },
        {
          type: "paragraph",
          text: "Cruzando $BbEe \\times BbEe$: $B_E_$ = preto ($\\dfrac{9}{16}$); $bbE_$ = chocolate ($\\dfrac{3}{16}$); $B_ee$ e $bbee$ = amarelo ($\\dfrac{4}{16}$). Proporção **9:3:4**.",
        },
        { type: "heading", text: "Interação complementar / duplo-recessiva (9:7)" },
        {
          type: "paragraph",
          text: "Dois genes precisam estar funcionando para a característica aparecer. Exemplo: surdez hereditária - precisa de $D$ e $E$ bons. Quem tem $D_E_$ ouve (9/16); qualquer homozigoto recessivo ($D_ee$, $ddE_$, $ddee$) é surdo (7/16). Cruzando $DdEe \\times DdEe$: **9:7** (ouvintes : surdos).",
        },
        {
          type: "solved-example",
          title: "Contando em cima do 9:7",
          statement: "De 112 filhotes de $DdEe \\times DdEe$, quantos devem ser surdos?",
          steps: [
            "P(surdo) = $\\dfrac{7}{16}$.",
            "$\\dfrac{7}{16} \\times 112 = 49$.",
          ],
          answer: "49 surdos (e 63 ouvintes).",
        },
        { type: "heading", text: "Resumo das proporções" },
        {
          type: "table",
          headers: ["Tipo de interação", "Proporção", "Exemplo clássico"],
          rows: [
            ["Interação simples (2 genes, 1 característica)", "9:3:3:1", "Crista de galinha"],
            ["Epistasia dominante", "12:3:1", "Pelagem branca (gene W inibe)"],
            ["Epistasia recessiva", "9:3:4", "Labrador (preto/chocolate/amarelo)"],
            ["Complementar (duplo-recessiva)", "9:7", "Surdez hereditária"],
            ["Pleiotropia", "-", "1 gene → várias características (anemia falciforme)"],
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Como não se perder",
          text: "Se o enunciado dá a proporção, só decorar o significado: 9:3:3:1 = interação simples; 12:3:1 = epistasia dominante; 9:3:4 = epistasia recessiva; 9:7 = complementar. Se o enunciado dá os genes, monte a tabela e conte.",
        },
      ],
      flashcards: [
        { id: "fc-1", question: "O que é pleiotropia?", answer: "Um único gene controlando várias características (ex.: anemia falciforme)." },
        { id: "fc-2", question: "O que é interação gênica?", answer: "Vários genes controlando uma mesma característica." },
        { id: "fc-3", question: "Qual a diferença entre 2ª lei e interação gênica?", answer: "2ª lei: genes diferentes, características diferentes (9:3:3:1 entre características). Interação: vários genes, UMA característica." },
        { id: "fc-4", question: "Proporção da interação simples (crista de galinha)?", answer: "9:3:3:1." },
        { id: "fc-5", question: "Proporção da epistasia dominante?", answer: "12:3:1 (o dominante mascara o outro gene)." },
        { id: "fc-6", question: "Proporção da epistasia recessiva?", answer: "9:3:4 (ex.: labrador preto/chocolate/amarelo)." },
        { id: "fc-7", question: "Proporção da interação complementar (surdez)?", answer: "9:7 (precisa dos dois genes bons)." },
        { id: "fc-8", question: "Em $WwBb \\times WwBb$ (W inibe pigmento), P de branco?", answer: "12/16 = 75% (todo $W_ $ é branco)." },
        { id: "fc-9", question: "Em $BbEe \\times BbEe$ (labrador), P de chocolate?", answer: "$bbE_$ = 3/16." },
        { id: "fc-10", question: "Em $DdEe \\times DdEe$ complementar, P de surdo?", answer: "7/16." },
        { id: "fc-11", question: "De 112 filhos de $DdEe \\times DdEe$, quantos surdos?", answer: "$\\dfrac{7}{16} \\times 112 = 49$." },
        { id: "fc-12", question: "Crista de galinha $CcPp \\times CcPp$: P de crista simples ($ccpp$)?", answer: "1/16." },
        { id: "fc-13", question: "O que é epistasia?", answer: "Um gene que mascara (esconde) o efeito de outro gene." },
      ],
      questions: [
        { id: "q-1", level: 1, origin: "pratica",
          statement: "Pleiotropia é:",
          alternatives: [
            { id: "a", text: "Um gene controlando várias características" },
            { id: "b", text: "Vários genes controlando uma característica" },
            { id: "c", text: "Gene que não funciona" },
            { id: "d", text: "Cromossomo extra" }
          ],
          correctAlternativeId: "a",
          explanation: "Pleiotropia = 1 gene → várias características (anemia falciforme). Interação gênica é o contrário (vários genes → 1 característica)." },
        { id: "q-2", level: 2, origin: "pratica",
          statement: "Crista de galinha: $CcPp \\times CcPp$. A P de filhote com crista simples ($ccpp$) é:",
          alternatives: [
            { id: "a", text: "1/4" },
            { id: "b", text: "3/16" },
            { id: "c", text: "9/16" },
            { id: "d", text: "1/16" }
          ],
          correctAlternativeId: "d",
          explanation: "cc = 1/4 e pp = 1/4 → $\\dfrac{1}{4} \\times \\dfrac{1}{4} = \\dfrac{1}{16}$ (a classe 1 da proporção 9:3:3:1)." },
        { id: "q-3", level: 3, origin: "pratica",
          statement: "Epistasia dominante: $WwBb \\times WwBb$, com $W$ branco dominante que inibe a cor. A P de filho branco é:",
          alternatives: [
            { id: "a", text: "1/4" }, { id: "b", text: "1/2" }, { id: "c", text: "3/4" }, { id: "d", text: "12/16 = 3/4" },
          ],
          correctAlternativeId: "d",
          explanation: "Todo $W_ $ é branco: $P(W_) = \\dfrac{3}{4}$ = 12/16 - é o 12 da proporção 12:3:1. (3/4 e 12/16 são o mesmo número; a banca costuma presentar 12/16.)" },
        { id: "q-4", level: 3, origin: "pratica",
          statement: "Labrador (epistasia recessiva): $BbEe \\times BbEe$, com $ee$ amarelo. A P de filhote chocolate ($bbE_$) é:",
          alternatives: [
            { id: "a", text: "9/16" },
            { id: "b", text: "4/16" },
            { id: "c", text: "3/16" },
            { id: "d", text: "1/16" }
          ],
          correctAlternativeId: "c",
          explanation: "$P(bb) = \\dfrac{1}{4}$ e $P(E_) = \\dfrac{3}{4}$ → $\\dfrac{3}{16}$ (o 3 do meio da proporção 9:3:4)." },
        { id: "q-5", level: 3, origin: "pratica",
          statement: "Surdez complementar: $DdEe \\times DdEe$ (precisa de $D$ e $E$). A proporção de surdos é:",
          alternatives: [
            { id: "a", text: "9:7" },
            { id: "b", text: "12:3:1" },
            { id: "c", text: "7:9" },
            { id: "d", text: "9:3:4" }
          ],
          correctAlternativeId: "a",
          explanation: "Só $D_E_$ ouve (9/16); todo o resto é surdo (7/16) → proporção ouvintes:surdos = 9:7, ou seja, surdos = 7/16." },
        { id: "q-6", level: 3, origin: "pratica",
          statement: "De 112 filhotes de $DdEe \\times DdEe$ (complementar), quantos são ouvintes ($D_E_$)?",
          alternatives: [
            { id: "a", text: "49" }, { id: "b", text: "63" }, { id: "c", text: "56" }, { id: "d", text: "84" },
          ],
          correctAlternativeId: "b",
          explanation: "Ouvintes = $\\dfrac{9}{16}$ → $\\dfrac{9}{16} \\times 112 = 63$." },
        { id: "q-7", level: 2, origin: "pratica",
          statement: "Um cruzamento di-híbrido deu a proporção 12:3:1. Isso indica:",
          alternatives: [
            { id: "a", text: "Epistasia recessiva" },
            { id: "b", text: "Epistasia dominante" },
            { id: "c", text: "Interação complementar" },
            { id: "d", text: "2ª lei pura" }
          ],
          correctAlternativeId: "b",
          explanation: "12:3:1 = um alelo dominante de um gene mascara o outro (epistasia dominante). 9:3:4 seria recessiva; 9:7 complementar; 9:3:3:1 simples." },
        { id: "q-8", level: 2, origin: "pratica",
          statement: "Um cruzamento di-híbrido deu 9:3:4. Isso é:",
          alternatives: [
            { id: "a", text: "Codominância" },
            { id: "b", text: "Epistasia dominante" },
            { id: "c", text: "Complementar" },
            { id: "d", text: "Epistasia recessiva" }
          ],
          correctAlternativeId: "d",
          explanation: "9:3:4 = homozigoto recessivo de um gene esconde o outro (epistasia recessiva, ex.: labrador)." },
      ],
      videos: [VIDEO_PLAYLIST_BIOLOGIA],
    },
    /* ═══════════════════════════════════════════════════════
       PARTE 5 — EVOLUÇÃO E GENÉTICA DE POPULAÇÕES
       ═══════════════════════════════════════════════════════ */
    {
      id: "evolucao-e-genetica-de-populacoes",
      number: 5,
      title: "Evolução e genética de populações",
      description:
        "Lamarck × Darwin, seleção natural e seus 3 tipos, evidências da evolução, especiação, homologia × analogia e Hardy-Weinberg com cálculos.",
      icon: "fish",
      objectives: [
        { id: "obj-1", text: "Comparar Lamarck e Darwin usando o exemplo das girafas" },
        { id: "obj-2", text: "Classificar seleção estabilizadora, direcional e disruptiva" },
        { id: "obj-3", text: "Diferenciar homólogo, análogo e vestigial" },
        { id: "obj-4", text: "Explicar especiação alopátrica e simpátrica" },
        { id: "obj-5", text: "Resolver problemas de Hardy-Weinberg" },
      ],
      theory: [
        { type: "heading", text: "Evolução em uma frase" },
        {
          type: "paragraph",
          text: "**Evolução** é a mudança hereditária das populações ao longo das gerações. Não é você mudando durante a vida - é a população inteira, geração após geração, ficando diferente.",
        },
        { type: "heading", text: "Lamarck: a ideia antiga" },
        {
          type: "paragraph",
          text: "Lamarck achava que o ambiente 'mandava' mudar: **uso e desuso** (órgão usado cresce, pouco usado atrofia) e **herança dos caracteres adquiridos** (o que você ganha na vida passa pros filhos). A frase dele: 'a função faz o órgão'.",
        },
        {
          type: "example",
          title: "Girafas segundo Lamarck",
          text: "A girafa esticaria o pescoço para pegar folha alta e o filho nascia com pescoço comprido. Bonito, mas não é assim que funciona - características adquiridas na vida não vão pro DNA dos gametas.",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Importante",
          text: "Lamarckismo é HISTÓRIA da ciência, não o mecanismo aceito hoje. Na prova, se pedirem a 'explicação moderna', é Darwin/seleção natural.",
        },
        { type: "heading", text: "Darwin: seleção natural" },
        {
          type: "paragraph",
          text: "Darwin publicó **A Origem das espécie** em **1859**. A ideia dele: numa população já existem **variações** (todo mundo é diferente). O ambiente não cria nada - ele **seleciona**: quem tem característica vantajosa naquele ambiente sobrevive e deixa mais filhos. Com o tempo, a população muda. A frase do material: 'o órgão faz a função'.",
        },
        {
          type: "example",
          title: "Girafas segundo Darwin",
          text: "Já nasciam girafas de pescoço curto e de pescoço longo. As de pescoço longo comeram melhor e deixaram mais filhos. A 'vontade' de esticar não teve nada a ver.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Detalhe",
          text: "Darwin não soube explicar de onde vinham as variações (a genética de Mendel veio depois).",
        },
        {
          type: "table",
          headers: ["", "Lamarck", "Darwin"],
          rows: [
            ["O ambiente...", "...induz as mudanças", "...seleciona as que já existem"],
            ["Mecanismo", "Uso/desuso + herança do adquirido", "Seleção natural e reprodução diferencial"],
            ["Girafas", "Pescoço esticou e foi herdado", "Variações já existiam; as maiores venceram"],
            ["Frase", "'A função faz o órgão'", "'O órgão faz a função'"],
          ],
        },
        { type: "heading", text: "Seleção natural no mundo real" },
        { type: "list", items: [
          "**Melanismo industrial:** antes da Revolução Industrial, mariposas claras se camuflavam; a fuligem escureceu as árvores e as escuras passaram a ser favorecidas.",
          "**Resistência bacteriana:** já existem bactérias resistentes; o antibiótico mata as suscetíveis e as resistentes se reproduzem. O remédio não cria resistência - ele a seleciona.",
        ]},
        { type: "heading", text: "Os 3 tipos de seleção" },
        {
          type: "table",
          headers: ["Tipo", "Favorece", "Exemplo"],
          rows: [
            ["Estabilizadora", "O INTERMEDIÁRIO (reduz os extremos)", "Anemia falciforme na África: heterozigoto resiste à malária"],
            ["Direcional", "UM extremo", "Resistência a antibióticos; melanismo industrial"],
            ["Disruptiva", "Os DOIS extremos (desfavorece o meio)", "Coloração dos guppies"],
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Cuidado",
          text: "Anemia falciforme só é vantajosa onde tem malária. Não é 'boa' em todo lugar - prova gosta de cobrar isso.",
        },
        { type: "heading", text: "Evidências da evolução" },
        { type: "list", items: [
          "**Fósseis** (restos/vestígios preservados - inseto em âmbar, pegada de dinossauro, Vale dos Dinossauros na Paraíba): a **paleontologia** mostra seres antigos e mudanças no tempo.",
          "**Provas anatômicas:** órgãos **vestigiais** (reduzidos, ex.: apêndice), **homólogos** (mesma origem, funções diferentes) e **análogos** (mesma função, origens diferentes).",
          "**Embriologia comparada:** embriões parecidos em espécie diferentes indicam ancestral comum.",
        ]},
        {
          type: "callout",
          variant: "info",
          title: "Homólogo × análogo (cai direto)",
          text: "Asa de morcego (membro anterior, com ossos) × asa de inseto (exoesqueleto): mesma função, origens diferentes → **análogas** → **evolução convergente**. Homólogas (mesma origem) é que provam parentesco → **evolução divergente** / irradiação adaptativa.",
        },
        { type: "heading", text: "Especiação" },
        {
          type: "paragraph",
          text: "Nova espécie surge quando duas populações acumulam tantas diferenças que surge o **isolamento reprodutivo** (não conseguem mais ter filhos férteis juntos).",
        },
        { type: "table", headers: ["", "Alopátrica", "Simpátrica"], rows: [
          ["Barreira geográfica?", "Sim - separa fisicamente", "Não - mesma região"],
          ["Como", "Sem fluxo gênico, acumulam diferenças até o isolamento reprodutivo", "Barreiras não geográficas (ex.: cromossômicas)"],
        ]},
        {
          type: "paragraph",
          text: "**Anagênese** = uma linhagem se transforma ao longo do tempo (sem ramificar). **Cladogênese** = a linhagem ramifica em duas ou mais. Não são sinônimos de alopátrica/simpátrica - aquelas são geográficas; estas são o padrão da árvore.",
        },
        { type: "heading", text: "Genética de popolazioni e Hardy-Weinberg" },
        {
          type: "paragraph",
          text: "**População** = indivíduos da mesma espécie numa área. A genética de populações mede as **frequências alélicas** (p, q) e **genotípicas**. O teorema de **Hardy-Weinberg** diz: numa população grande, com cruzamentos ao acaso e sem mutação/seleção/migração, as frequências ficam constantes - **equilíbrio genético**. Em populações pequenas, a **deriva genética** (acaso) muda as frequências.",
        },
        { type: "formula", text: "p + q = 1 \\qquad\\qquad p^2 + 2pq + q^2 = 1" },
        {
          type: "quantities",
          items: [
            { symbol: "p", name: "frequência do alelo dominante" },
            { symbol: "q", name: "frequência do alelo recessivo" },
            { symbol: "p^2 / 2pq / q^2", name: "frequências dos genótipos AA / Aa / aa" },
          ],
        },
        {
          type: "paragraph",
          text: "A 2ª fórmula é só $(p+q)^2$ aberto. Truque: em dominância completa, o fenótipo recessivo = $q^2$ → para achar $q$, tira a **raiz quadrada**. Use valores entre 0 e 1 (16% vira 0,16).",
        },
        {
          type: "solved-example",
          title: "16% da população tem miopia (recessiva)",
          statement: "Calcule p, q e as frequências genotípicas (gene M/m).",
          steps: [
            "$q^2 = 0{,}16$ → $q = \\sqrt{0{,}16} = 0{,}4$.",
            "$p = 1 - 0{,}4 = 0{,}6$.",
            "$p^2 = 0{,}36$ (MM) · $2pq = 0{,}48$ (Mm) · $q^2 = 0{,}16$ (mm).",
          ],
          answer: "MM 36% · Mm 48% · mm 16%.",
        },
        {
          type: "solved-example",
          title: "900 Rh− em 10.000 pessoas",
          statement: "Qual a % de Rh+ homozigotos ($RR$)?",
          steps: [
            "$q^2 = \\dfrac{900}{10000} = 0{,}09$ → $q = 0{,}3$ (alelo $r$).",
            "$p = 0{,}7$ → $p^2 = 0{,}49$.",
          ],
          answer: "49% são $RR$.",
        },
        { type: "heading", text: "Resumo" },
        { type: "table", headers: ["Tema", "Guarde"], rows: [
          ["Lamarck × Darwin", "Lamarck: meio induz e herda · Darwin: meio seleciona variações já existentes"],
          ["Tipos de seleção", "Estabilizadora (meio) · direcional (extremo) · disruptiva (dois extremos)"],
          ["Homólogo × análogo", "Mesma origem × mesma função; divergente × convergente"],
          ["Especiação", "Alopátrica (barreira) × simpátrica (mesma área); anagênese × cladogênese"],
          ["Hardy-Weinberg", "$p+q=1$ · $p^2+2pq+q^2=1$ · recessivo = $q^2$ → tira a raiz"],
        ]},
      ],
      flashcards: [
        { id: "fc-1", question: "O que é evolução?", answer: "Mudança hereditária das populações ao longo das gerações." },
        { id: "fc-2", question: "Quais as duas leis de Lamarck?", answer: "Uso e desuso; herança dos caracteres adquiridos." },
        { id: "fc-3", question: "Obra de Darwin e ano?", answer: "A Origem das espécie, 1859." },
        { id: "fc-4", question: "Como Darwin explica a girafa?", answer: "Já havia variação de pescoço; as maiores se reproduziram mais (seleção)." },
        { id: "fc-5", question: "Seleção direcional favorece quem?", answer: "Um dos fenótipos extremos (ex.: resistência a antibióticos)." },
        { id: "fc-6", question: "Seleção estabilizadora favorece quem?", answer: "Os intermediários (reduz os extremos) - ex.: anemia falciforme na África." },
        { id: "fc-7", question: "Homólogo × análogo?", answer: "Homólogo: mesma origem, funções diferentes. Análogo: mesma função, origens diferentes (convergente)." },
        { id: "fc-8", question: "Asas de morcego e inseto são homólogas ou análogas?", answer: "Análogas (convergentes) - mesma função, origens diferentes." },
        { id: "fc-9", question: "Especiação alopátrica vs simpátrica?", answer: "Alopátrica: barreira geográfica separa. Simpátrica: mesma região, sem barreira física." },
        { id: "fc-10", question: "Anagênese × cladogênese?", answer: "Anagênese: linhagem se transforma. Cladogênese: linhagem ramifica." },
        { id: "fc-11", question: "Fórmulas de Hardy-Weinberg?", answer: "$p+q=1$ e $p^2+2pq+q^2=1$." },
        { id: "fc-12", question: "Se 16% tem fenótipo recessivo, quanto vale q?", answer: "$q = \\sqrt{0{,}16} = 0{,}4$." },
        { id: "fc-13", question: "O que é deriva genética?", answer: "Mudança aleatória das frequências alélicas pelo acaso, forte em populações pequenas." },
      ],
      questions: [
        { id: "q-1", level: 1, origin: "pratica",
          statement: "Segundo Lamarck, a girafa ficou de pescoço comprido porque:",
          alternatives: [
            { id: "a", text: "As de pescoço curto morreram de fome" },
            { id: "b", text: "Ela esticou o pescoço pelo uso e transmitiu isso aos filhos" },
            { id: "c", text: "O ambiente induziu mutações no pescoço" },
            { id: "d", text: "A seleção natural escolheu as maiores" },
          ],
          correctAlternativeId: "b",
          explanation: "Lamarck = uso/desuso + herança do adquirido ('a função faz o órgão'). Darwin (d) é a outra teoria." },
        { id: "q-2", level: 2, origin: "pratica",
          statement: "O melanismo industrial das mariposas é exemplo de:",
          alternatives: [
            { id: "a", text: "Seleção estabilizadora" }, { id: "b", text: "Seleção direcional" }, { id: "c", text: "Seleção disruptiva" }, { id: "d", text: "Deriva genética" },
          ],
          correctAlternativeId: "b",
          explanation: "A fuligem favoreceu UM extremo (as escuras) → direcional. Mesma lógica da resistência a antibióticos." },
        { id: "q-3", level: 2, origin: "pratica",
          statement: "Asas de morcego e de inseto são:",
          alternatives: [
            { id: "a", text: "Análogas (evolução convergente)" },
            { id: "b", text: "Homólogas" },
            { id: "c", text: "Vestigiais" },
            { id: "d", text: "Nenhuma das anteriores" }
          ],
          correctAlternativeId: "a",
          explanation: "Mesma função (voar), origens diferentes (membro anterior × exoesqueleto) → análogas/convergentes. Não provam parentesco." },
        { id: "q-4", level: 2, origin: "pratica",
          statement: "Especiação que ocorre SEM barreira geográfica é a:",
          alternatives: [
            { id: "a", text: "Simpátrica" },
            { id: "b", text: "Alopátrica" },
            { id: "c", text: "Anagenética" },
            { id: "d", text: "Cladogenética" }
          ],
          correctAlternativeId: "a",
          explanation: "Alopátrica = barreira física. Simpátrica = mesma área. Anagênese/cladogênese são padrões da árvore evolutiva." },
        { id: "q-5", level: 3, origin: "pratica",
          statement: "Numa população em equilíbrio, 16% tem miopia (recessiva). A frequência de heterozigotos (Mm) é:",
          alternatives: [
            { id: "a", text: "16%" },
            { id: "b", text: "32%" },
            { id: "c", text: "64%" },
            { id: "d", text: "48%" }
          ],
          correctAlternativeId: "d",
          explanation: "$q^2 = 0{,}16$ → $q = 0{,}4$; $p = 0{,}6$; $2pq = 2 \\times 0{,}6 \\times 0{,}4 = 0{,}48 = 48%$." },
        { id: "q-6", level: 3, origin: "pratica",
          statement: "De 10.000 pessoas, 900 são Rh−. A % de Rh+ homozigotos ($RR$) é:",
          alternatives: [
            { id: "a", text: "9%" },
            { id: "b", text: "49%" },
            { id: "c", text: "42%" },
            { id: "d", text: "91%" }
          ],
          correctAlternativeId: "b",
          explanation: "$q^2 = 0{,}09$ → $q = 0{,}3$; $p = 0{,}7$; $p^2 = 0{,}49 = 49%$." },
        { id: "q-7", level: 2, origin: "pratica",
          statement: "Se 36% tem a característica recessiva, a frequência do alelo dominante (p) vale:",
          alternatives: [
            { id: "a", text: "0,4" },
            { id: "b", text: "0,6" },
            { id: "c", text: "0,36" },
            { id: "d", text: "0,64" }
          ],
          correctAlternativeId: "a",
          explanation: "$q^2 = 0{,}36$ → $q = 0{,}6$ (recessivo); $p = 1 - 0{,}6 = 0{,}4$ (dominante)." },
        { id: "q-8", level: 3, origin: "pratica",
          statement: "O uso indiscriminado de antibióticos favorece bactéries resistentes porque:",
          alternatives: [
            { id: "a", text: "O antibiótico causa mutações de resistência" },
            { id: "b", text: "Ele enfraquece o sistema imune" },
            { id: "c", text: "As bactéries 'aprendem' a se defender" },
            { id: "d", text: "Ele seleciona as bactéries que já eram resistentes, que sobrevivem e se reproduzem" }
          ],
          correctAlternativeId: "d",
          explanation: "A resistência já existia na população (variação). O antibiótico elimina as suscetíveis → as resistentes são selecionadas. Ele não cria a resistência." },
      ],
      videos: [VIDEO_PLAYLIST_BIOLOGIA],
    },
    /* ═══════════════════════════════════════════════════════
       PARTE 6 — BIOTECNOLOGIA
       ═══════════════════════════════════════════════════════ */
    {
      id: "biotecnologia",
      number: 6,
      title: "Biotecnologia",
      description:
        "DNA recombinante, plasmídeos e enzimas de restrição, transgênicos × OGM, terapia gênica, vacinas, DNA fingerprint, mtDNA, PCR, Projeto Genoma, clonagem e células-tronco.",
      icon: "flask-conical",
      objectives: [
        { id: "obj-1", text: "Explicar DNA recombinante, plasmídeos e enzimas de restrição" },
        { id: "obj-2", text: "Diferenciar OGM de transgênico e transgenia de terapia gênica" },
        { id: "obj-3", text: "Comparar vacinas gênicas e tradicionais" },
        { id: "obj-4", text: "Explicar DNA fingerprint, paternidade, DNA mitocondrial e PCR" },
        { id: "obj-5", text: "Resumir Projeto Genoma Humano, clonagem e células-tronco" },
      ],
      theory: [
        { type: "heading", text: "O que é biotecnologia?" },
        {
          type: "paragraph",
          text: "É usar seres vivos, células ou moléculas (como o DNA) para criar produtos e serviços. Exemplos que caem: insulina humana, hormônio de crescimento, vacinas, bioinseticidas e organismos transgênicos.",
        },
        { type: "heading", text: "DNA recombinante: cortar e colar genes" },
        {
          type: "paragraph",
          text: "A **tecnologia do DNA recombinante** (engenharia genética) serve para localizar, isolar, alterar e estudar pedaços de DNA. A ferramenta principal são as **enzimas de restrição** - 'tesouras moleculares' que as bactérias produzem naturalmente e que cortam o DNA numa sequência específica. Foram descobertas por volta de **1970**.",
        },
        {
          type: "paragraph",
          text: "O outro ingrediente é o **plasmídeo**: um anelzinho circular de DNA das bactéries, separado do cromossomo. Na engenharia genética ele serve de **vetor** - e 'vetor', nesse contexto, é só uma estrutura que **transporta** o gene de um organismo para outro.",
        },
        { type: "list", style: "number", items: [
          "Pega o gene de interesse e corta com enzima de restrição.",
          "Corta um plasmídeo bacteriano com a MESMA enzima.",
          "Cola o gene dentro do plasmídeo → **DNA recombinante**.",
          "Coloca o plasmídeo numa bactéria, que passa a fabricar a proteína do gene (ex.: insulina humana - feito pela primeira vez numa *E. coli* nos anos 1980).",
        ]},
        { type: "heading", text: "OGM × transgênico" },
        {
          type: "table",
          headers: ["", "OGM", "Transgênico"],
          rows: [
            ["É...", "Organismo Geneticamente Modificado", "Organismo que recebeu gene de OUTRA espécie"],
            ["Relação", "Todo transgênico é OGM", "Nem todo OGM é transgênico"],
          ],
        },
        { type: "paragraph", text: "No Brasil, OGMs são regulados pela **Lei de Biossegurança nº 11.105/2005**." },
        { type: "heading", text: "Terapia gênica" },
        {
          type: "paragraph",
          text: "É entregar um **gene funcional** para as células de uma pessoa, para tratar uma doença genética - geralmente usando um vírus modificado como vetor (ex.: adenovírus). Diferente da transgenia, que altera o organismo de forma hereditária, a terapia gênica trata o INDIVÍDUO.",
        },
        {
          type: "example",
          title: "Reconheça na prova",
          text: "'Adenovírus modificado entregou gene normal a uma célula com gene anormal' → isso é **terapia gênica**, com o objetivo de tratar a condição genética.",
        },
        { type: "heading", text: "Vacinas: gênicas × tradicionais" },
        {
          type: "table",
          headers: ["Tipo", "O que entra no corpo", "Exemplo"],
          rows: [
            ["Gênica (mRNA)", "Só a instrução genética; a célula produz a proteína do vírus e o imune aprende", "Vacinas de mRNA (Pfizer)"],
            ["Atenuada", "Vírus/bactéria viva, mas enfraquecida", "Sarampo"],
            ["Inativada", "Agente morto, incapaz de se reproduzir", "CoronaVac"],
            ["Subunidades", "Só proteínas do agente, feitas em laboratório", "HPV"],
          ],
        },
        { type: "heading", text: "DNA fingerprint, paternidade e mtDNA" },
        {
          type: "paragraph",
          text: "O **DNA fingerprint** usa regiões do DNA com sequências repetidas em tandem, cujo número varia de pessoa pra pessoa - cada um tem um padrão único de fragmentos. Serve para **crime** e **paternidade**. Amostras: sangue, cabelo, saliva, sêmen... No teste de paternidade, **metade dos fragmentos do filho vem da mãe e metade do pai**. Exceção: gêmeos monozigóticos (idênticos).",
        },
        {
          type: "paragraph",
          text: "O **DNA mitocondrial** fica nas mitocôndrias e vem **só da mãe** (o óvulo traz as mitocôndrias; as do espermatozoide não sobrevivem). Por isso marca a **linhagem materna**: todo mundo recebe da mãe, mas só as mulheres passam adiante.",
        },
        { type: "heading", text: "PCR e Projeto Genoma Humano" },
        {
          type: "paragraph",
          text: "**PCR** (Reação em Cadeia da Polimerase) **amplifica** um trecho de DNA - faz zilhões de cópias a partir de uma amostra mínima. É diferente de teste de DNA (que compara padrões): PCR copia, teste compara.",
        },
        {
          type: "paragraph",
          text: "O **Projeto Genoma Humano** reuniu cientistas de **18 países** e, em **abril de 2003**, anunciou ~**99% do genoma** sequenciado com **99,99%** de precisão. Sequenciar ≠ saber a função de cada gene.",
        },
        { type: "heading", text: "Clonagem e células-tronco" },
        {
          type: "paragraph",
          text: "**Clonagem** gera cópias idênticas (bactérias, plantas, gêmeos monozigóticos). A ovelha **Dolly** (anunciada em **fevereiro de 1997** por **Ian Wilmut**, Instituto Roslin) provou que dá pra clonar um mamífero de célula adulta.",
        },
        { type: "table", headers: ["", "Reprodutiva", "Terapêutica"], rows: [
          ["Objetivo", "Gerar um organismo", "Gerar células/tecidos para tratamento"],
          ["O blastocisto...", "Vai para um útero", "Fica no lab e vira fonte de células-tronco"],
        ]},
        {
          type: "paragraph",
          text: "**Células-tronco** se copiam e se transformam em outros tipos. Do maior pro menor potencial: **totipotente** (tudo, inclusive placenta) > **pluripotente** (quase tudo do corpo) > **multipotente** (algumas linhagens) > **oligopotente** (poucos tipos) > **unipotente** (um só tipo).",
        },
        { type: "heading", text: "Resumo" },
        { type: "table", headers: ["Tema", "Guarde"], rows: [
          ["DNA recombinante", "Enzima de restrição corta (1970) + plasmídeo transporta (vetor)"],
          ["OGM × transgênico", "Todo transgênico é OGM; nem todo OGM é transgênico · Lei 11.105/2005"],
          ["Terapia gênica", "Gene funcional no indivíduo (vetor viral), sem mudar a hereditariedade"],
          ["Vacinas", "Gênica (mRNA) × atenuada × inativada (CoronaVac) × subunidade"],
          ["Fingerprint", "Padrão único de fragmentos; paternidade: metade mãe, metade pai"],
          ["mtDNA / PCR", "mtDNA só da mãe · PCR amplifica DNA"],
          ["Genoma Humano", "18 países, abr/2003, ~99%, 99,99%"],
          ["Dolly / clonagem", "Fev/1997, Ian Wilmut, Roslin; terapêutica = células-tronco"],
          ["Células-tronco", "Totipotente > pluripotente > multipotente > oligopotente > unipotente"],
        ]},
      ],
      flashcards: [
        { id: "fc-1", question: "O que são enzimas de restrição?", answer: "Tesouras moleculares que cortam o DNA em sequências específicas (descobertas ~1970)." },
        { id: "fc-2", question: "O que é um plasmídeo e o que é 'vetor' nesse contexto?", answer: "Anel de DNA da bactéria; vetor = estrutura que transporta o gene pra outro organismo." },
        { id: "fc-3", question: "Relação OGM × transgênico?", answer: "Todo transgênico é OGM; nem todo OGM é transgênico." },
        { id: "fc-4", question: "O que é terapia gênica?", answer: "Entregar um gene funcional às células de uma pessoa para tratar doença genética." },
        { id: "fc-5", question: "CoronaVac é exemplo de qual tipo de vacina?", answer: "Inativada (agente morto)." },
        { id: "fc-6", question: "Como funciona a vacina gênica (mRNA)?", answer: "Entrega a instrução genética; a célula produz a proteína do patógeno e o imune aprende." },
        { id: "fc-7", question: "Para que serve o DNA fingerprint?", answer: "Identificar pessoas por padrões únicos de fragmentos de DNA (crime e paternidade)." },
        { id: "fc-8", question: "No teste de paternidade, de onde vêm os fragmentos do filho?", answer: "Metade da mãe, metade do pai." },
        { id: "fc-9", question: "De quem vem o DNA mitocondrial?", answer: "Só da mãe (linhagem materna)." },
        { id: "fc-10", question: "O que o PCR faz?", answer: "Amplifica (faz zilhões de cópias de) um trecho de DNA." },
        { id: "fc-11", question: "Projeto Genoma Humano: quando e com que precisão?", answer: "Abril de 2003; ~99% sequenciado a 99,99% de precisão; 18 países." },
        { id: "fc-12", question: "Quem clonou a Dolly e quando?", answer: "Ian Wilmut, Instituto Roslin, fevereiro de 1997." },
        { id: "fc-13", question: "Ordem de potencial das células-tronco?", answer: "Totipotente > pluripotente > multipotente > oligopotente > unipotente." },
      ],
      questions: [
        { id: "q-1", level: 1, origin: "pratica",
          statement: "A relação correta entre OGM e transgênico é:",
          alternatives: [
            { id: "a", text: "Todo OGM é transgênico" },
            { id: "b", text: "São sinônimos" },
            { id: "c", text: "Todo transgênico é OGM, mas nem todo OGM é transgênico" },
            { id: "d", text: "Nenhum OGM é transgênico" },
          ],
          correctAlternativeId: "c",
          explanation: "Transgênico = gene de outra espécie → caso particular de OGM." },
        { id: "q-2", level: 2, origin: "pratica",
          statement: "Os peixes GloFish fluorescentes foram criados porque receberam:",
          alternatives: [
            { id: "a", text: "O núcleo inteiro de uma célula de medusa" },
            { id: "b", text: "RNA de medusa" },
            { id: "c", text: "Um segmento de DNA da medusa, com o gene da proteína GFP" },
            { id: "d", text: "Mitocôndrias de medusa" }
          ],
          correctAlternativeId: "c",
          explanation: "Só o gene da GFP (segmento de DNA), não o núcleo inteiro - é transgenia." },
        { id: "q-3", level: 2, origin: "pratica",
          statement: "Um adenovírus modificado entregou um gene normal a uma célula humana com gene defeituoso. A técnica é:",
          alternatives: [
            { id: "a", text: "Transgenia" },
            { id: "b", text: "PCR" },
            { id: "c", text: "Clonagem" },
            { id: "d", text: "Terapia gênica" }
          ],
          correctAlternativeId: "d",
          explanation: "Gene funcional entregue a um INDIVÍDUO por vetor viral = terapia gênica." },
        { id: "q-4", level: 2, origin: "pratica",
          statement: "O PCR faz o quê?",
          alternatives: [
            { id: "a", text: "Corta o DNA em vários pontos" },
            { id: "b", text: "Amplifica (faz muitas cópias de) um trecho de DNA" },
            { id: "c", text: "Compara padrões de DNA entre pessoas" },
            { id: "d", text: "Sequencia o genoma inteiro" }
          ],
          correctAlternativeId: "b",
          explanation: "PCR = amplificação. Comparar padrões é teste de DNA; sequenciar genoma é outra técnica." },
        { id: "q-5", level: 1, origin: "pratica",
          statement: "O Projeto Genoma Humano foi concluído em:",
          alternatives: [
            { id: "a", text: "1953" },
            { id: "b", text: "1990" },
            { id: "c", text: "2020" },
            { id: "d", text: "abril de 2003" }
          ],
          correctAlternativeId: "d",
          explanation: "Abril de 2003, 18 países, ~99% do genoma a 99,99% de precisão." },
        { id: "q-6", level: 2, origin: "pratica",
          statement: "No teste de paternidade por DNA, os fragmentos do filho vêm:",
          alternatives: [
            { id: "a", text: "Metade da mãe e metade do pai" },
            { id: "b", text: "Todo do pai" },
            { id: "c", text: "Todo da mãe" },
            { id: "d", text: "De nenhum dos dois" }
          ],
          correctAlternativeId: "a",
          explanation: "Metade do óvulo (mãe), metade do espermatozoide (pai)." },
        { id: "q-7", level: 2, origin: "pratica",
          statement: "O DNA mitocondrial é herdado de quem?",
          alternatives: [
            { id: "a", text: "Só da mãe" },
            { id: "b", text: "Do pai" },
            { id: "c", text: "Dos dois" },
            { id: "d", text: "Dos avós" }
          ],
          correctAlternativeId: "a",
          explanation: "Só a mãe transmite (as mitocôndrias vêm do óvulo) → marca a linhagem materna." },
        { id: "q-8", level: 2, origin: "pratica",
          statement: "A clonagem terapêutica difere da reprodutiva porque:",
          alternatives: [
            { id: "a", text: "O blastocisto fica no laboratório e vira fonte de células-tronco para tratamento, em vez de ir para um útero" },
            { id: "b", text: "Usa células adultas" },
            { id: "c", text: "Não usa DNA" },
            { id: "d", text: "Só funciona em plantas" }
          ],
          correctAlternativeId: "a",
          explanation: "Nas duas os passos iniciais são iguais; na terapêutica o embrião não vai pro útero - vira células-tronco." },
      ],
      videos: [VIDEO_PLAYLIST_BIOLOGIA],
    },
  ],
  generalVideos: [],

  discursiveQuestions: [
    {
      id: "sim-1", topic: "Genética", relatedPartId: "genetica-basica-primeira-lei", level: 4, origin: "pratica",
      statement:
        "Uma cobaia de pelo preto (predomínio do alelo $B$) foi cruzada com uma de pelo branco ($bb$).\n\na) O que é cruzamento-teste e para que serve?\nb) Nasceram 8 filhotes, todos pretos. O que se pode concluir sobre o genótipo da cobaia preta?\nc) Se a cobaia preta fosse $Bb$, qual seria a probabilidade de os 8 filhotes saírem todos pretos?",
      solutionSteps: [
        "a) Cruzamento-teste = cruzar o organismo de fenótipo dominante com um homozigoto recessivo ($bb$) para descobrir se ele é $BB$ ou $Bb$.",
        "b) Todos pretos → nenhum recessivo apareceu → a preta é provavelmente $BB$ (se fosse $Bb$, cada filhote teria 50% de chance de sair branco).",
        "c) Se fosse $Bb$: P(todos pretos) = $(\\dfrac{1}{2})^8 = \\dfrac{1}{256} \\approx 0{,}4\\%$.",
      ],
      finalAnswer: "a) teste com $bb$ · b) provavelmente $BB$ · c) 1/256.",
    },
    {
      id: "sim-2", topic: "Interação gênica", relatedPartId: "interacao-genica-e-pleiotropia", level: 4, origin: "pratica",
      statement:
        "Em galinhas, dois genes ($C$ e $P$) definem a crista. Cruzando $CcPp \\times CcPp$:\n\na) Monte a distribuição fenotípica (proporção).\nb) Qual a P de uma crista 'simples' ($ccpp$)?\nc) Essa interação é igual à 2ª Lei de Mendel? Explique a diferença.",
      solutionSteps: [
        "a) $C_P_$ = noz (9/16), $C_pp$ = ervilha (3/16), $ccP_$ = rosa (3/16), $ccpp$ = simples (1/16) → 9:3:3:1.",
        "b) P(simples) = $\\dfrac{1}{4} \\times \\dfrac{1}{4} = \\dfrac{1}{16}$.",
        "c) A proporção é a mesma (9:3:3:1), mas aqui os dois genes agem na MESMA característica (interação gênica); na 2ª lei eles agem em características diferentes.",
      ],
      finalAnswer: "a) 9:3:3:1 · b) 1/16 · c) mesma proporção, mas interação gênica = vários genes numa só característica.",
    },
    {
      id: "sim-3", topic: "2ª Lei de Mendel", relatedPartId: "segunda-lei-e-heranca-quantitativa", level: 4, origin: "pratica",
      statement:
        "Indivíduos $AaBb \\times AaBb$ (dominância completa nos dois genes):\n\na) Quais os gametas de cada um?\nb) Qual a proporção fenotípica clássica?\nc) De 160 descendentes, quantos devem ser $aabb$?",
      solutionSteps: [
        "a) Gametas: $AB$, $Ab$, $aB$, $ab$ (4 = $2^2$).",
        "b) 16 combinações → fenótipos 9:3:3:1.",
        "c) $P(aabb) = \\dfrac{1}{4} \\times \\dfrac{1}{4} = \\dfrac{1}{16}$ → $\\dfrac{1}{16} \\times 160 = 10$.",
      ],
      finalAnswer: "a) AB, Ab, aB, ab · b) 9:3:3:1 · c) 10 descendentes $aabb$.",
    },
    {
      id: "sim-4", topic: "Herança quantitativa", relatedPartId: "segunda-lei-e-heranca-quantitativa", level: 5, origin: "pratica",
      statement:
        "Uma planta varia de 100 cm a 220 cm (herança poligênica). A F2 mostrou 5 fenótipos e tinha 256 plantas.\n\na) Quantos pares de genes e quantos alelos aditivos?\nb) Quanto cada alelo aditivo soma?\nc) Quantas plantas medem 160 cm?",
      solutionSteps: [
        "a) 5 fenótipos → $5 = 2n+1$ → $n = 2$ pares → $2n = 4$ alelos aditivos.",
        "b) $(220 - 100) / 4 = 30$ cm por alelo.",
        "c) 160 cm = 100 + 60 = 100 + 2×30 → classe de 2 alelos. Pascal com 4 alelos: 1:4:6:4:1 → classe 2 = $\\dfrac{6}{16}$. $\\dfrac{6}{16} \\times 256 = 96$.",
      ],
      finalAnswer: "a) 2 pares / 4 alelos · b) 30 cm · c) 96 plantas.",
    },
    {
      id: "sim-5", topic: "Biotecnologia", relatedPartId: "biotecnologia", level: 4, origin: "pratica",
      statement:
        "a) Explique a diferença entre OGM e organismo transgênico, com exemplo.\nb) Um adenovírus foi modificado para inserir um gene normal numa célula humana com gene defeituoso. Nomeie a técnica e o objetivo.\nc) Por que essa técnica é diferente de transgenia?",
      solutionSteps: [
        "a) OGM = organismo geneticamente modificado; transgênico = recebeu gene de OUTRA espécie (ex.: GloFish com gene de medusa). Todo transgênico é OGM; nem todo OGM é transgênico.",
        "b) É **terapia gênica**: o objetivo é fornecer um gene funcional para tratar a condição genética.",
        "c) A transgenia altera o organismo de forma hereditária; a terapia gênica trata o INDIVÍDUO (suas células), sem passar pros filhos.",
      ],
      finalAnswer: "a) OGM × transgênico · b) terapia gênica (tratar com gene funcional) · c) terapia gênica não é hereditária.",
    },
    {
      id: "sim-6", topic: "Biotecnologia", relatedPartId: "biotecnologia", level: 3, origin: "pratica",
      statement:
        "a) Como funciona uma vacina gênica de mRNA?\nb) Quais os 3 tipos principais de vacinas tradicionais e dê um exemplo de cada?\nc) O que o PCR faz e por que ele é diferente do teste de DNA?",
      solutionSteps: [
        "a) Ela entrega só a instrução genética (mRNA); a célula produz a proteína do vírus e o sistema imune aprende a reconhecê-la (ex.: Pfizer).",
        "b) Atenuada (vírus enfraquecido - sarampo), inativada (morto - CoronaVac), subunidades (só proteínas - HPV).",
        "c) PCR amplifica (faz cópias de) um trecho de DNA. Teste de DNA compara padrões de fragmentos entre pessoas. PCR copia; teste compara.",
      ],
      finalAnswer: "a) mRNA → célula produz a proteína → imune aprende · b) atenuada/inativada/subunidades · c) PCR amplifica; teste de DNA compara.",
    },
    {
      id: "sim-7", topic: "Evolução", relatedPartId: "evolucao-e-genetica-de-populacoes", level: 4, origin: "pratica",
      statement:
        "Compare Lamarck e Darwin usando o exemplo da girafa:\n\na) Como Lamarck explicaria o pescoço comprido?\nb) Como Darwin explicaria?\nc) Qual dessas explicações é aceita hoje e por quê?",
      solutionSteps: [
        "a) Lamarck: a girafa esticou o pescoço pelo uso (para pegar folhas altas) e transmitiu aos filhos - 'a função faz o órgão'; herança dos caracteres adquiridos.",
        "b) Darwin: já existiam girafas de pescoço curto e comprido; as de pescoço comprido comeram melhor e deixaram mais descendentes - seleção natural sobre variações pré-existentes.",
        "c) A de Darwin. Hoje sabemos que características adquiridas durante a vida não alteram o DNA dos gametas e não são herdadas.",
      ],
      finalAnswer: "a) uso/desuso + herança do adquirido · b) seleção de variações já existentes · c) Darwin/seleção natural.",
    },
    {
      id: "sim-8", topic: "Genética de populações", relatedPartId: "evolucao-e-genetica-de-populacoes", level: 4, origin: "pratica",
      statement:
        "Numa população em equilíbrio de Hardy-Weinberg há 10.000 pessoas e 900 são Rh negativas ($rr$).\n\na) Qual a frequência do alelo $r$ (q)?\nb) Qual a frequência do alelo $R$ (p)?\nc) Qual a porcentagem de pessoas $RR$ (Rh+ homozigotas)?",
      solutionSteps: [
        "a) $q^2 = \\dfrac{900}{10000} = 0{,}09$ → $q = \\sqrt{0{,}09} = 0{,}3$.",
        "b) $p = 1 - q = 0{,}7$.",
        "c) $p^2 = 0{,}7^2 = 0{,}49$ → **49%**.",
      ],
      finalAnswer: "a) q = 0,3 · b) p = 0,7 · c) 49% são $RR$.",
    },
    {
      id: "sim-9", topic: "Mista: heredograma + X + probabilidade", relatedPartId: "grupos-sanguineos-letais-sexo-heredogramas", level: 5, origin: "pratica",
      statement:
        "Num heredograma, um casal NÃO afetado tem um filho homem com daltonismo (ligado ao X, recessivo).\n\na) Quais os genótipos dos pais?\nb) Qual a P de o próximo filho ser um menino daltônico?\nc) Qual a P de a próxima filha ser portadora?",
      solutionSteps: [
        "a) Filho homem daltônico = $X^dY$: ele recebeu o $Y$ do pai e o $X^d$ da mãe. Como o pai é normal, ele é $X^DY$; a mãe, não afetada mas com $X^d$, é portadora $X^DX^d$.",
        "b) P(menino) = $\\dfrac{1}{2}$; dado menino, P(receber $X^d$ da mãe) = $\\dfrac{1}{2}$ → $\\dfrac{1}{2} \\times \\dfrac{1}{2} = \\dfrac{1}{4}$ = 25%.",
        "c) Filhas recebem $X^D$ do pai (nunca são daltônicas aqui) e $X^d$ da mãe metade das vezes → P(portadora $X^DX^d$) = $\\dfrac{1}{2} \\times \\dfrac{1}{2} = \\dfrac{1}{4}$ = 25%.",
      ],
      finalAnswer: "a) pai $X^DY$, mãe portadora $X^DX^d$ · b) menino daltônico: 25% · c) menina portadora: 25%.",
    },
    {
      id: "sim-10", topic: "Mista: genética + probabilidade + interação", relatedPartId: "genetica-basica-primeira-lei", level: 5, origin: "pratica",
      statement:
        "Pais $Aa \\times Aa$ (albinismo) e ambos tipo sanguíneo A com genótipo $I^Ai$.\n\na) Qual a P de o filho ser albino ($aa$)?\nb) Qual a P de ser tipo sanguíneo O?\nc) Qual a P de ser albino E tipo O, ao mesmo tempo (regra do E)?",
      solutionSteps: [
        "a) $P(aa) = \\dfrac{1}{4}$ (25%).",
        "b) $I^Ai \\times I^Ai$ → $ii$ = $\\dfrac{1}{4}$ (25%).",
        "c) Eventos independentes → multiplica: $\\dfrac{1}{4} \\times \\dfrac{1}{4} = \\dfrac{1}{16}$ (6,25%).",
      ],
      finalAnswer: "a) 25% · b) 25% · c) 1/16 (6,25%).",
    },
  ],

  professorExercises: [
    { number: 1, topic: "Terapia gênica", partId: "biotecnologia", asks: "Identificar e explicar a terapia gênica a partir de adenovírus + gene funcional.", study: ["Terapia gênica", "Vetores virais"], answer: "Terapia gênica; objetivo: fornecer gene funcional para tratar a condição genética." },
    { number: 2, topic: "Lamarckismo", partId: "evolucao", asks: "Identificar a interpretação lamarckista em notícia sobre animais se adaptando em poucas gerações.", study: ["Lamarck", "Seleção natural"], answer: "Interpretação lamarckista (herança de caracteres adquiridos)." },
    { number: 3, topic: "Analogia (asas)", partId: "evolucao", asks: "Explicar a analogia entre asas de morcego e de inseto (origem e evolução convergente).", study: ["Homologia × analogia", "Evolução convergente"], answer: "Análogas: mesma função, origens diferentes (membro anterior × exoesqueleto) → convergência." },
    { number: 4, topic: "GloFish", partId: "biotecnologia", asks: "Analisar criticamente a afirmação de que receberam o núcleo inteiro de célula de medusa.", study: ["Transgenia", "DNA recombinante"], answer: "Incorreto: receberam só o segmento de DNA com o gene da GFP, não o núcleo inteiro.", check: "A alternativa correta era discordar da afirmação." },
    { number: 5, topic: "Herança quantitativa (milho)", partId: "heranca-quantitativa", asks: "Altura 150-300 cm, 7 fenótipos na F2, 384 plantas, 250 cm. Calcular genes, contribuição e quantidade.", study: ["2n+1", "Proporções da F2"], answer: "a) 6 alelos efetivos (3 pares) · b) 25 cm · c) 15/64 × 384 = 90 plantas.", check: "Conferido: 7=2n+1 → n=3; (300−150)/6=25; 250 cm = classe 15/64; 15/64×384=90." },
    { number: 6, topic: "Genes letais", partId: "bases-da-genetica", asks: "Moscas $Aa \\times Aa$ com $aa$ letal; 180 adultos. Quantos heterozigotos?", study: ["Genes letais", "Proporções entre sobreviventes"], answer: "2/3 × 180 = 120 heterozigotos.", check: "Conferido: sobreviventes 1 AA : 2 Aa → 2/3 de 180 = 120." },
    { number: 7, topic: "Albinismo + ABO + probabilidade", partId: "bases-da-genetica", asks: "Joana (A, não albina; pais Aa×Aa, pai tipo O) × Mário (aa, tipo O): P(1º filho menino, albino, tipo A)?", study: ["Probabilidade", "Sistema ABO"], answer: "2/3 × 1/2 × 1/2 × 1/2 = 1/12.", check: "Conferido: 2/3 (Joana Aa) × 1/2 (a) × 1/2 (Iᴬ) × 1/2 (menino) = 1/12." },
    { number: 8, topic: "Heredograma + dominância incompleta", partId: "bases-da-genetica", asks: "Cabelos: CC crespos × LL lisos → 100% CL ondulados. Probabilidade de certa criança ser menina e ondulada?", study: ["Dominância incompleta", "Heredogramas"], answer: "100% ondulados × 1/2 menina = 50%.", check: "Conferido: CC×LL → 100% CL; ×1/2 sexo = 1/2." },
    { number: 9, topic: "Sistema Rh / eritroblastose", partId: "bases-da-genetica", asks: "Mulher Rh− recebeu transfusão Rh+ do pai; 1º filho normal, 2º com doença hemolítica. Genótipos e sensibilização.", study: ["Fator Rh", "Sensibilização materna"], answer: "Mãe $rr$ sensibilizada; marido e pai da mulher com mesmo genótipo; 1º filho Rh−.", check: "Coerente: anticorpos anti-Rh da mãe atacam o 2º feto Rh+." },
    { number: 10, topic: "Sistema ABO + probabilidade", partId: "bases-da-genetica", asks: "Compatibilidade ABO entre pais, filho e nora; prob. de duas filhas com a condição.", study: ["Sistema ABO", "Probabilidade composta"], answer: "Cruzamento final $I^BI^i \\times ii$; cada filha 1/2 → duas filhas: (1/2×1/2)² = 1/16, tipo B.", check: "Conferido: (1/4)² = 1/16." },
  ],};

/* ──────────────────────────────────────
   3. CÁLCULOS DERIVADOS (contagens, gabarito, navegação)
   ────────────────────────────────────── */

// Contagens, gabarito e navegação entre partes são sempre calculados
// a partir do bloco 2 — nunca escritos à mão em dois lugares.

export function getReview(): Review {
  return review;
}

export function getParts(): Part[] {
  return review.parts;
}

export function getPart(id: string): Part | undefined {
  return review.parts.find((part) => part.id === id);
}

export function getAdjacentParts(id: string): {
  prev: Part | undefined;
  next: Part | undefined;
} {
  const parts = getParts();
  const index = parts.findIndex((part) => part.id === id);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? parts[index - 1] : undefined,
    next: index < parts.length - 1 ? parts[index + 1] : undefined,
  };
}

export function countFlashcards(part: Part): number {
  return part.flashcards.length;
}

export function countQuestions(part: Part): number {
  return part.questions.length;
}

export function countObjectives(part: Part): number {
  return part.objectives.length;
}

export function countPartVideos(part: Part): number {
  return part.videos.length;
}

export function totalFlashcards(): number {
  return getParts().reduce((sum, part) => sum + countFlashcards(part), 0);
}

export function totalQuestions(): number {
  return getParts().reduce((sum, part) => sum + countQuestions(part), 0);
}

export function totalObjectives(): number {
  return getParts().reduce((sum, part) => sum + countObjectives(part), 0);
}

/**
 * Lista cada vídeo UMA vez, junto com as partes que ele cobre.
 * Uma mesma playlist pode servir a várias partes — aqui ela
 * aparece uma única vez, com a lista de partes que cobre.
 */
export function allVideos(): { video: Video; parts: Part[] }[] {
  const list: { video: Video; parts: Part[] }[] = [];

  const add = (video: Video, part?: Part) => {
    const found = list.find((item) => item.video.id === video.id);
    if (found) {
      if (part && !found.parts.includes(part)) found.parts.push(part);
    } else {
      list.push({ video, parts: part ? [part] : [] });
    }
  };

  for (const video of review.generalVideos) add(video);
  for (const part of getParts()) {
    for (const video of part.videos) add(video, part);
  }

  return list;
}

/** Quantidade de vídeos distintos (uma playlist repetida conta uma vez). */
export function totalVideos(): number {
  return allVideos().length;
}

/** Letra (A, B, C...) correspondente ao índice de uma alternativa. */
export function letterFor(index: number): string {
  return String.fromCharCode(65 + index);
}

/** Retorna a letra da alternativa correta de uma questão. */
export function correctLetter(question: Question): string {
  const index = question.alternatives.findIndex(
    (alt) => alt.id === question.correctAlternativeId,
  );
  return index >= 0 ? letterFor(index) : "?";
}

export function totalDiscursiveQuestions(): number {
  return review.discursiveQuestions.length;
}

/**
 * Agrupa as questões discursivas por tema, preservando a ordem em
 * que os temas aparecem nos dados (bloco 2 deste arquivo).
 */
export function getDiscursiveQuestionsByTopic(): {
  topic: string;
  questions: DiscursiveQuestion[];
}[] {
  const groups: { topic: string; questions: DiscursiveQuestion[] }[] = [];
  for (const question of review.discursiveQuestions) {
    const existing = groups.find((g) => g.topic === question.topic);
    if (existing) {
      existing.questions.push(question);
    } else {
      groups.push({ topic: question.topic, questions: [question] });
    }
  }
  return groups;
}

/** Gabarito agrupado por parte — sempre derivado das questões, nunca duplicado. */
export function getAnswerKey(): { part: Part; entries: { question: Question; letter: string }[] }[] {
  return getParts()
    .filter((part) => part.questions.length > 0)
    .map((part) => ({
      part,
      entries: part.questions.map((question) => ({
        question,
        letter: correctLetter(question),
      })),
    }));
}


/* ────────────────
   4. UTILITÁRIOS
   ──────────────── */

/** Junta classes condicionalmente, ignorando valores falsy. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Calcula porcentagem segura (evita divisão por zero). */
export function percentage(done: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((done / total) * 100);
}
