/** Set to false before publishing unless each story has the patient's written consent */
export const SHOW_UNVERIFIED_STORIES = true;

export type PatientStory = {
  id: string;
  quote: string;
  /** First name + last initial, e.g. "Mohamed K." */
  name: string;
  /** e.g. "Laser Bleaching Patient" */
  treatment: string;
  /** True only when the patient has given written consent. */
  verified: boolean;
  caseId?: string | number;
  image?: string;
};
export const STORY_DURATION_MS = 12000;

export const allStories: PatientStory[] = [
  { id: "story-1", name: "Nour A.", treatment: "Composite Restoration Patient", verified: false, quote: "Dr. Mohamed completely restored four of my front teeth with composite resin, and the results were flawless. What impressed me most was his attention to detail — each tooth was shaped and polished to match the others perfectly. The procedure was essentially pain-free and he explained every step as he worked. I left feeling like I had a brand new smile." },
  { id: "story-2", name: "Mohamed K.", treatment: "Laser Bleaching Patient", verified: false, quote: "I was skeptical about bleaching because I'd heard it causes sensitivity, but Dr. Mohamed's laser protocol was completely different. He applied a protective gel beforehand and monitored the whole session closely. My teeth went up several shades in a single appointment. The professionalism and hygiene in the clinic were second to none." },
  { id: "story-3", name: "Rania T.", treatment: "Wisdom Tooth Extraction Patient", verified: false, quote: "I was extremely anxious about having my wisdom tooth removed, but Dr. Mohamed put me at ease right away. He was calm, precise, and checked on my comfort throughout the procedure. I felt only slight pressure — no sharp pain at all. The post-operative instructions he gave me were thorough and the healing was smooth. I'd recommend him without hesitation." },
  { id: "story-4", name: "Ahmed S.", treatment: "Root Canal Treatment Patient", verified: false, quote: "Dr. Mohamed performed a root canal on one of my upper molars that had been causing severe pain for days. The relief was immediate after the first session. He uses a rotary system which made the process much faster than I expected, and the clinic's sterilization standards were clearly top-tier. I felt completely safe and well looked after throughout." },
];

export const visibleStories = (list: PatientStory[], showUnverified: boolean) =>
  showUnverified ? list : list.filter((story) => story.verified);

export const stories: PatientStory[] = visibleStories(allStories, SHOW_UNVERIFIED_STORIES);
