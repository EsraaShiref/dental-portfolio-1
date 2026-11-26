import { courses, experience } from "./profile";
import { cases } from "./portfolio";

/** Always derived from the live catalogs, including future content additions. */
export const heroStats = [
  { label: "Clinics", value: experience.length },
  { label: "Courses", value: courses.length },
  { label: "Cases documented", value: cases.length },
] as const;