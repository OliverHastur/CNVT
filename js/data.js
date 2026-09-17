/**
 * =====================================================================
 * CATÁLOGO DE EXPERIÊNCIAS
 * =====================================================================
 * Edite este arquivo para personalizar as opções de encontro.
 *
 * Campos de cada experiência:
 *  - id:           identificador único (string, sem espaços)
 *  - title:        título criativo (aparece grande no card)
 *  - description:  frase curta, sem entregar todas as surpresas
 *  - emoji:        um emoji que representa a vibe
 *  - vibe:         "casa" | "explorar"  -> usado pelo Termômetro do Clima
 *                   para filtrar quais cards aparecem primeiro
 *  - isMystery:    true = os detalhes exatos ficam ocultos até o dia
 *  - mysteryHint:  se isMystery=true, uma pista mostrada no lugar dos detalhes
 * =====================================================================
 */

const EXPERIENCES = [
  {
    id: "cinema-em-casa",
    title: "Sessão pra dois",
    description: "Pipoca, doce e um filme escolhido a dedo. Sem pressa.",
    emoji: "🎬",
    vibe: "casa",
    isMystery: false,
  },
  {
    id: "jantar-italiano",
    title: "Massa & vela acesa",
    description: "Uma mesa reservada, prato quente e conversa longa.",
    emoji: "🍝",
    vibe: "explorar",
    isMystery: false,
  },
  {
    id: "trilha-por-do-sol",
    title: "Trilha até o fim da tarde",
    description: "Uma caminhada leve terminando quando Deus quiser.",
    emoji: "🌳",
    vibe: "explorar",
    isMystery: false,
  },
  {
    id: "cafe-e-livraria",
    title: "Café, livros e tempo livre",
    description: "Uma tarde devagar, sem hora pra acabar.",
    emoji: "☕",
    vibe: "explorar",
    isMystery: false,
  },
  {
    id: "surpresa",
    title: "Me surpreenda com comida",
    description: "Você escolhe só a categoria de comida. O restaurante exato é surpresa até o dia.",
    emoji: "🎲",
    vibe: "explorar",
    isMystery: true,
    mysteryHint: "Só vou te contar o bairro no dia. Confia em mim.",
  },
  {
    id: "Acarajé-e-praia",
    title: "Acarajé e praia",
    description: "Uma experiência única com a delícia baiana e a tranquilidade da praia (apesar de não ter camarão).",
    emoji: "🌶️",
    vibe: "explorar",
    isMystery: false,
  },
  {
    id: "Sorvete",
    title: "Sorvete",
    description: "Uma tarde gelada com sabores completamente diferentes (creme de Unicórnio).",
    emoji: "🍦",
    vibe: "casa",
    isMystery: false,
  },
  {
    id: "Purgatorio",
    title: "Purgatório Bar",
    description: "O mais perto de um coma alcóolico que você vai chegar sem precisar de hospital.",
    emoji: "🍹",
    vibe: "Explorar",
    isMystery: false,
  },
  {
    id: "Kart",
    title: "Simulador de Ayrton Senna",
    description: "Competição emocionante com realismo total.",
    emoji: "🏎️",
    vibe: "explorar",
    isMystery: false,
  },
  {
    id: "Parque",
    title: "Passeio no parque (tenho medo de roda gigante)",
    description: "Passaporte completo para o parque.",
    emoji: "🎡",
    vibe: "explorar",
    isMystery: false,
  },
  {
    id: "Solar-do-Unhão",
    title: "Museu e Cinema Solar do Unhão",
    description: "Sem muita explicação.",
    emoji: "🎨",
    vibe: "explorar",
    isMystery: false,
  },
  {
    id: "Palacete-das-Artes",
    title: "Um casarão imponente",
    description: "Abriga exposições temporárias e esculturas, além de um café/restaurante.",
    emoji: "🏛️",
    vibe: "explorar",
    isMystery: false,
  },
  {
    id: "MAB",
    title: "Múseu de Arte da Bahia",
    description: "Simplesmente o museu mais antigo do estado.",
    emoji: "🖼️",
    vibe: "explorar",
    isMystery: false,
  },
  {
    id: "Saladearte",
    title: "Circuito Saladearte",
    description: "Passear, tomar café e ver coisa diferente em um só lugar.",
    emoji: "🎭",
    vibe: "explorar",
    isMystery: false,
  },
  {
    id: "Parque-das-Dunas",
    title: "Passeio no Parque das Dunas",
    description: "Um passeio leve, com direito a trilha e muita natureza.",
    emoji: "🏞️",
    vibe: "explorar",
    isMystery: false,
  },
  {
    id: "Linha Verde",
    title: "Passeio pela Linha Verde",
    description: "Alugar um carro e dar um susto na pobreza faz bem de vez em quando.",
    emoji: "🚗",
    vibe: "explorar",
    isMystery: false,
  },
  {
    id: "Gárcia D'Ávila",
    title: "Castelão",
    description: "Piquenique no meio do castelo Gárcia D'Ávila.",
    emoji: "🏰",
    vibe: "explorar",
    isMystery: false,
  },
  
];

/**
 * Perguntas do "Termômetro do Clima".
 * A resposta escolhida define o valor de `vibe` usado para ordenar o catálogo.
 */
const THERMOMETER_QUESTION = {
  question: "Qual é a vibe de hoje?",
  options: [
    { label: "Algo caseiro e tranquilo", value: "casa", emoji: "🏠" },
    { label: "Quero sair e explorar", value: "explorar", emoji: "🌆" },
  ],
};
