export const profile = {
  name: "Dr. Mohamed Samy",
  title: "General Dentist",
  location: "Tanta, Egypt",
  phone: "+20 106 702 4087",
  phoneHref: "tel:+201067024087",
  email: "mohamedsamyakl1999@gmail.com",
  portrait: "/images/mohamed-samy-portrait.png",
  bio: "Dr. Mohamed Samy is a General Dentist with a Bachelor of Dental Surgery (BDS) from Delta University and hands-on experience across multiple dental clinics in Egypt. He is passionate about esthetic dentistry, endodontics and conservative restorative care, combining modern digital tools such as Digital Smile Design and Exocad with magnification (dental loupes) to deliver precise, comfortable and natural-looking results. Holding a Saudi license, a passed Prometric exam and a valid DataFlow, he is fully prepared to practice in the Gulf region. Beyond the clinic, Dr. Mohamed creates dental content to educate patients and make dentistry easier to understand, building trust through clear communication and a patient-first approach.",
  credentials: [
    "Saudi License Holder",
    "Passed Prometric Test",
    "Rank: Health Assistant",
    "Valid DataFlow",
  ],
  chips: ["BDS – Delta University", "Saudi License Holder", "Prometric Passed", "Valid DataFlow"],
  highlights: [
    "Esthetic Dentistry",
    "Endodontics",
    "Digital Dentistry (DSD & Exocad)",
    "Patient Education & Content",
  ],
};
export const appointmentUrl =
  "https://wa.me/201067024087?text=Hello%20Dr.%20Mohamed%2C%20I%20would%20like%20to%20book%20an%20appointment.";
export const navigation = ["Home", "About", "Education", "Portfolio", "Skills", "Contact"] as const;
export const education = {
  degree: "Bachelor of Dental Surgery (BDS)",
  university: "Delta University",
};
export const experience = [
  "Elsalam Dental Clinic",
  "Tiba Dental Clinic",
  "Zidan Dental Clinic",
].map((name) => ({
  name,
  role: "General Dentist",
  description:
    "Provided comprehensive general dental care including restorative, endodontic and esthetic treatments.",
}));
export const skillGroups = [
  {
    title: "Clinical Skills",
    subtitle: "Direct patient care and procedures",
    items: [
      "Infection Control",
      "Local Anesthesia",
      "Rubber Dam Placement",
      "Laser Bleaching",
      "Composite Restorations",
      "Esthetic Dentistry",
      "Dental Loupes (Owner)",
    ],
  },
  {
    title: "Professional & Technical",
    subtitle: "Specialized dental disciplines",
    items: [
      "Endodontics",
      "Rotary Endo",
      "Apex Locator",
      "Pediatric Dentistry",
      "Fixed Prosthodontics",
      "Minor Oral Surgery",
      "Dental Photography",
    ],
  },
  {
    title: "Software & Marketing",
    subtitle: "Digital tools and practice growth",
    items: [
      "Exocad",
      "Digital Smile Design (DSD)",
      "Microsoft Office",
      "Social Media Marketing",
      "Patient Communication",
    ],
  },
];
export const socials = ["Instagram", "TikTok", "YouTube", "Facebook"].map((name) => ({
  name,
  href: "#",
}));
export type Booking = { name: string; preferred: string; message: string };
export function bookingErrors(booking: Booking) {
  return {
    name: booking.name.trim() ? "" : "Please enter your name.",
    preferred: booking.preferred.trim() ? "" : "Please choose your preferred day and time.",
  };
}
export function buildBookingUrl(booking: Booking) {
  return `https://wa.me/201067024087?text=${encodeURIComponent(`Hello Dr. Mohamed, my name is ${booking.name.trim()}. I'd like to book an appointment on ${booking.preferred.trim()}. ${booking.message.trim()}`.trim())}`;
}
export type CourseIcon =
  | "Activity" | "Smile" | "Scissors" | "Sparkles" | "RotateCw" | "Crosshair"
  | "Baby" | "Zap" | "Camera" | "Monitor" | "Megaphone";
export type Course = { title: string; icon: CourseIcon };
export const courses = [
  { title: "Endodontic Course", icon: "Activity" },
  { title: "Orthodontic Course", icon: "Smile" },
  { title: "Minor Surgery Course", icon: "Scissors" },
  { title: "Composite Course", icon: "Sparkles" },
  { title: "Rotary Endodontics", icon: "RotateCw" },
  { title: "Apex Locator Course", icon: "Crosshair" },
  { title: "Pediatric Dentistry", icon: "Baby" },
  { title: "Laser Bleaching", icon: "Zap" },
  { title: "Dental Photography", icon: "Camera" },
  { title: "Exocad & DSD Software", icon: "Monitor" },
  { title: "Dental Practice Marketing", icon: "Megaphone" },
] as const satisfies readonly Course[];
export type CourseTitle = (typeof courses)[number]["title"];
export type CourseTrack = { title: string; icon: CourseIcon; descriptor: string; courseNames: readonly CourseTitle[] };
export const courseTracks: readonly CourseTrack[] = [
  { title: "Endodontics", descriptor: "Root canal care", icon: "Activity", courseNames: ["Endodontic Course", "Rotary Endodontics", "Apex Locator Course"] },
  { title: "Restorative & Esthetic", descriptor: "Natural-looking smiles", icon: "Sparkles", courseNames: ["Composite Course", "Laser Bleaching", "Dental Photography"] },
  { title: "Surgery & Specialties", descriptor: "Surgical and child care", icon: "Scissors", courseNames: ["Minor Surgery Course", "Orthodontic Course", "Pediatric Dentistry"] },
  { title: "Digital & Practice", descriptor: "Modern digital workflow", icon: "Monitor", courseNames: ["Exocad & DSD Software", "Dental Practice Marketing"] },
];
