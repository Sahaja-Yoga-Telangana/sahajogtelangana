import { MIN_WHY_WORDS, SCREENING_QUESTIONS } from "@/data/volunteer-screening";

const MCQ_CORRECT_INDEX: Record<string, number> = {
  "other-yoga-practice": 2,
  "money-question": 1,
  "how-much-to-share": 2,
  "one-on-one-request": 1,
  "seeker-ownership": 1,
  "nearest-center": 0,
};

const ACCEPTED_BANDHAN = [
  "bandhan",
  "takebandhan",
  "takeabandhan",
  "givebandhan",
  "giveabandhan",
  "dobandhan",
  "doabandhan",
  "putbandhan",
  "putabandhan",
  "awakenkundalini",
  "awakenyourkundalini",
  "raisekundalini",
  "raiseyourkundalini",
  "liftkundalini",
  "liftyourkundalini",
];

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[\s.,!?'"-]/g, "");
}

export function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function scoreAssessment(
  answers: Record<string, string>
): { score: number; maxScore: number; wordCount: number } {
  const mcqQuestions = SCREENING_QUESTIONS.filter((q) => q.type === "mcq");
  const blankQuestion = SCREENING_QUESTIONS.find((q) => q.type === "blank");
  const essay = SCREENING_QUESTIONS.find((q) => q.type === "essay");

  let score = 0;
  const maxScore = mcqQuestions.length + 1;

  for (const question of mcqQuestions) {
    const correctIndex = MCQ_CORRECT_INDEX[question.id];
    if (correctIndex === undefined) continue;
    const answer = String(answers[question.id] || "").trim();
    const answeredIndex = question.options?.indexOf(answer);
    if (answeredIndex === correctIndex) score += 1;
  }

  if (blankQuestion) {
    const normalized = normalizeText(String(answers[blankQuestion.id] || ""));
    if (ACCEPTED_BANDHAN.includes(normalized)) score += 1;
  }

  const wordCount = essay ? countWords(String(answers[essay.id] || "")) : 0;

  return { score, maxScore, wordCount };
}
