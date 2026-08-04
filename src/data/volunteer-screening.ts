export type ScreeningQuestion = {
  id: string;
  type: "mcq" | "essay" | "blank";
  prompt: string;
  options?: string[];
  minWords?: number;
  helper?: string;
};

export const MIN_WHY_WORDS = 50;

export const SCREENING_QUESTIONS: ScreeningQuestion[] = [
  {
    id: "why-volunteer",
    type: "essay",
    prompt: "Why do you want to volunteer with Sahaja Yoga?",
    helper: "Please write at least 50 words.",
    minWords: MIN_WHY_WORDS,
  },
  {
    id: "other-yoga-practice",
    type: "mcq",
    prompt: "A seeker tells you they are practicing some other form of yoga. How would you respond?",
    options: [
      "Tell them Sahaja Yoga is the only correct path and they should stop everything else",
      "Avoid the topic so you do not create conflict",
      "Gently invite them to give Sahaja Yoga a try as well, and let them discover for themselves what works for them",
      "Argue that all other yoga forms are misleading",
    ],
  },
  {
    id: "money-question",
    type: "mcq",
    prompt: "A seeker asks, \"Why are you doing all this — do you get money out of it?\" How would you answer?",
    options: [
      "Yes, we receive a small payment for our time",
      "We give back to the community what we ourselves have received from Sahaja Yoga",
      "Change the topic and ignore the question",
      "Tell them it is none of their business",
    ],
  },
  {
    id: "how-much-to-share",
    type: "mcq",
    prompt: "How much should you share with a new seeker during their first interaction?",
    options: [
      "Explain all the chakras and nadis in full detail",
      "Share every personal experience you have ever had",
      "Give a brief introduction and focus more on the experience of meditation — online or offline meditation classes",
      "Discuss deep philosophy and scriptures at length",
    ],
  },
  {
    id: "one-on-one-request",
    type: "mcq",
    prompt: "A new seeker asks for a 1:1 guided meditation session. How would you handle it?",
    options: [
      "Gladly arrange a private one-on-one session",
      "Insist on joining the collective meditation — online or offline — because Sahaja Yoga works in a collective way",
      "Refuse to help them",
      "Offer the session only if they pay for it",
    ],
  },
  {
    id: "seeker-ownership",
    type: "mcq",
    prompt: "A seeker specifically requests that only you continue guiding them. What would you do?",
    options: [
      "Keep the seeker assigned to yourself permanently",
      "Explain that you will always be happy to help, but once your follow-up is complete you will update the seeker's status and release them back into the system so they can continue receiving guidance from the collective",
      "Ignore the platform workflow and continue contacting them outside the system",
      "Tell them they cannot speak to any other volunteer",
    ],
  },
  {
    id: "nearest-center",
    type: "mcq",
    prompt: "A seeker wants to attend the nearest Sahaja Yoga center. How would you guide them?",
    options: [
      "Ask for their PIN code, district or locality, find the nearest center using sycenters.org, send the center details through WhatsApp or SMS, and offer further guidance if required",
      "Ask them to search Google themselves",
      "Tell them to visit any yoga center nearby",
      "Ask them to wait until someone else contacts them",
    ],
  },
  {
    id: "bandhan-blank",
    type: "blank",
    prompt: "Before stepping out of the home we take ______.",
    helper: "Fill in the blank with the phrase you have learned in Sahaja Yoga.",
  },
];
