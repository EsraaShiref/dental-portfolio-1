import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { heroStats } from "@/data/hero";
import {
  appointmentUrl,
  bookingErrors,
  buildBookingUrl,
  experience,
  experienceHighlights,
  skillGroups,
  courses,
  courseTracks,
} from "@/data/profile";
import {
  type ComparisonCase,
  activeCategories,
  caseImages,
  cases,
  cases as allCases,
  videos,
  categoryLabel,
  filterCases,
  INITIAL_VISIBLE,
} from "@/data/portfolio";
describe("Portfolio rules", () => {
  it("derives Home clinic statistics from all experience entries", () => {
    expect(heroStats[0].value).toBe(experience.length);
    expect(heroStats[0].value).toBe(3);
  });
  it("derives Home course statistics from the full course catalog", () => {
    expect(heroStats[1].value).toBe(courses.length);
    expect(heroStats[1].value).toBe(11);
  });
  it("derives documented case statistics from every portfolio case", () => {
    expect(heroStats[2].value).toBe(cases.length);
    expect(heroStats[2].value).toBe(22);
  });
  it("groups all eleven existing courses into the four supplied tracks without duplicates", () => {
    expect(courseTracks.map((track) => [track.title, track.icon, [...track.courseNames]])).toEqual([
      ["Endodontics", "Activity", ["Endodontic Course", "Rotary Endodontics", "Apex Locator Course"]],
      ["Restorative & Esthetic", "Sparkles", ["Composite Course", "Laser Bleaching", "Dental Photography"]],
      ["Surgery & Specialties", "Scissors", ["Minor Surgery Course", "Orthodontic Course", "Pediatric Dentistry"]],
      ["Digital & Practice", "Monitor", ["Exocad & DSD Software", "Dental Practice Marketing"]],
    ]);
    const names = courseTracks.flatMap((track) => [...track.courseNames]);
    expect(names).toHaveLength(11);
    expect(new Set(names).size).toBe(courses.length);
    expect([...names].sort()).toEqual(courses.map((course) => course.title).sort());
  });
  it("gives each course track its short descriptor", () => {
    expect(courseTracks.map((t) => t.descriptor)).toEqual(["Root canal care", "Natural-looking smiles", "Surgical and child care", "Modern digital workflow"]);
  });
  it("preserves the original icons for every course", () => {
    expect(courses.map((course) => [course.title, course.icon])).toEqual([
      ["Endodontic Course", "Activity"], ["Orthodontic Course", "Smile"],
      ["Minor Surgery Course", "Scissors"], ["Composite Course", "Sparkles"],
      ["Rotary Endodontics", "RotateCw"], ["Apex Locator Course", "Crosshair"],
      ["Pediatric Dentistry", "Baby"], ["Laser Bleaching", "Zap"],
      ["Dental Photography", "Camera"], ["Exocad & DSD Software", "Monitor"],
      ["Dental Practice Marketing", "Megaphone"],
    ]);
  });
  it("uses the exact shared appointment link", () => {
    expect(appointmentUrl).toBe(
      "https://wa.me/201067024087?text=Hello%20Dr.%20Mohamed%2C%20I%20would%20like%20to%20book%20an%20appointment.",
    );
  });
  it("requires name and preferred day/time", () => {
    expect(bookingErrors({ name: "  ", preferred: "", message: "" })).toEqual({
      name: "Please enter your name.",
      preferred: "Please choose your preferred day and time.",
    });
    expect(bookingErrors({ name: "Sarah", preferred: "2026-12-01T10:30", message: "" })).toEqual({
      name: "",
      preferred: "",
    });
  });
  it("encodes the supplied booking fields for WhatsApp", () => {
    const url = new URL(
      buildBookingUrl({
        name: " Sarah ",
        preferred: "2026-12-01T10:30",
        message: "A check-up & consultation",
      }),
    );
    expect(url.pathname).toBe("/201067024087");
    expect(url.searchParams.get("text")).toBe(
      "Hello Dr. Mohamed, my name is Sarah. I'd like to book an appointment on 2026-12-01T10:30. A check-up & consultation",
    );
  });
  it("contains only the three supplied clinics", () => {
    expect(experience.map((item) => item.clinic)).toEqual([
      "Elsalam Dental Clinic",
      "Tiba Dental Clinic",
      "Zidan Dental Clinic",
    ]);
  });
  it("keeps General Dentist as the role at all three clinics", () => {
    expect(experience.map((item) => item.role)).toEqual([
      "General Dentist", "General Dentist", "General Dentist",
    ]);
  });
  it("leaves periods, descriptions and highlights absent for all three clinics", () => {
    expect(experience).toHaveLength(3);
    for (const entry of experience) {
      expect(Object.keys(entry).sort()).toEqual(["clinic", "id", "role"]);
    }
  });
  it("limits optional clinic highlights to the first three", () => {
    const entry = { id: "test", clinic: "Test clinic", role: "General Dentist" };
    expect(experienceHighlights(entry)).toEqual([]);
    expect(experienceHighlights({ ...entry, highlights: [] })).toEqual([]);
    expect(experienceHighlights({ ...entry, highlights: ["a", "b"] })).toEqual(["a", "b"]);
    expect(experienceHighlights({ ...entry, highlights: ["a", "b", "c", "d"] })).toEqual(["a", "b", "c"]);
  });
  it("contains exactly the supplied skill groups and items", () => {
    expect(skillGroups.map((group) => group.items)).toEqual([
      [
        "Infection Control",
        "Local Anesthesia",
        "Rubber Dam Placement",
        "Laser Bleaching",
        "Composite Restorations",
        "Esthetic Dentistry",
        "Dental Loupes (Owner)",
      ],
      [
        "Endodontics",
        "Rotary Endo",
        "Apex Locator",
        "Pediatric Dentistry",
        "Fixed Prosthodontics",
        "Minor Oral Surgery",
        "Dental Photography",
      ],
      [
        "Exocad",
        "Digital Smile Design (DSD)",
        "Microsoft Office",
        "Social Media Marketing",
        "Patient Communication",
      ],
    ]);
  });
  it("shows exactly the three supplied portrait videos", () => {
    expect(videos.map((video) => video.src)).toEqual([
      "/cases/Content-Creator/Video-1.mp4",
      "/cases/Content-Creator/Video-2.mp4",
      "/cases/Content-Creator/Video-3.mp4",
    ]);
    for (const v of videos) expect(existsSync(`public${v.src}`)).toBe(true);
  });
  it("shows filter chips only for categories with real cases", () => {
    expect(activeCategories).toEqual(["Restorative", "Prosthodontics", "Endodontics", "Surgery"]);
  });
  it("contains exactly the real cases per category", () => {
    const count = (c: string) => cases.filter((item) => item.category === c).length;
    expect(count("Restorative")).toBe(6);
    expect(count("Prosthodontics")).toBe(7);
    expect(count("Endodontics")).toBe(5);
    expect(count("Surgery")).toBe(4);
    const surgery = cases.filter((i) => i.category === "Surgery");
    expect(surgery.map((i) => i.kind)).toEqual(["single", "single", "single", "single"]);
    expect(surgery.map((i) => caseImages(i))).toEqual([
      ["/cases/surgery/surgery-1.jpeg"],
      ["/cases/surgery/surgery-2.jpeg"],
      ["/cases/surgery/surgery-3.jpeg"],
      ["/cases/surgery/surgery-4.jpeg"],
    ]);
  });
  it("points prosthodontics cases at the fixed image pairs", () => {
    const fixed = cases.find((i) => i.id === "fixed-3");
    expect(fixed && caseImages(fixed)).toEqual([
      "/cases/prosthodontics/fixed-3-before.jpeg",
      "/cases/prosthodontics/fixed-3-after.jpeg",
    ]);
  });
  it("ships every case image file in public", () => {
    for (const item of cases) {
      for (const src of caseImages(item)) {
        expect(existsSync(`public${src}`), `${src} is missing`).toBe(true);
      }
    }
  });
  it("has no CONFIRM markers in case data", () => {
    expect(JSON.stringify(cases)).not.toMatch(/CONFIRM/);
  });
  it("fills the card edge to edge but keeps the whole film in the lightbox", () => {
    const css = readFileSync("src/styles.css", "utf8");
    expect(css).toMatch(/\.comparison\s*\{[^}]*aspect-ratio:\s*4\/5/);
    expect(css).toMatch(
      /\.comparison\s+img\s*\{[^}]*object-fit:\s*cover;[^}]*object-position:\s*center/,
    );
    expect(css).toMatch(/\.comparison--contain\s+img\s*\{[^}]*object-fit:\s*contain/);
    expect(css).toMatch(
      /\.media-lightbox \.comparison\s*\{[^}]*background:\s*var\(--hero-dark\)/,
    );
    expect(css).not.toMatch(/comparison--radiograph/);
  });
  it("shows Prosthodontics to visitors as Fixed with matching titles", () => {
    expect(categoryLabel("Prosthodontics")).toBe("Fixed");
    const titles = cases.filter((c) => c.category === "Prosthodontics").map((c) => c.title);
    expect(titles[0]).toBe("Fixed Case 1");
    expect(titles).toEqual(Array.from({ length: 7 }, (_, i) => `Fixed Case ${i + 1}`));
    expect(JSON.stringify(cases)).not.toMatch(/Prosthodontics [Cc]ase/);
  });
  it("starts with 6 cases and mixes categories in All", () => {
    expect(INITIAL_VISIBLE).toBe(6);
    expect(filterCases(cases, "All").slice(0, 4).map((c) => c.category)).toEqual([
      "Restorative", "Prosthodontics", "Endodontics", "Surgery",
    ]);
    expect(filterCases(cases, "All")).toHaveLength(22);
  });
  it("removes only the duplicate Fixed record and keeps the Restorative case", () => {
    expect(cases.some((item) => item.id === "fixed-1")).toBe(false);
    const restorative = cases.find((item) => item.id === "restorative-1");
    expect(restorative && caseImages(restorative)).toEqual([
      "/cases/restorative/restorative-1-before.jpeg", "/cases/restorative/restorative-1-after.jpeg",
    ]);
  });
  it("keeps each renumbered Fixed case linked to its original photos and matching alt text", () => {
    const fixed = cases.filter((item) => item.category === "Prosthodontics");
    expect(fixed).toHaveLength(7);
    fixed.forEach((item, index) => {
      expect(item.id).toBe(`fixed-${index + 2}`);
      expect(caseImages(item)).toEqual([
        `/cases/prosthodontics/fixed-${index + 2}-before.jpeg`,
        `/cases/prosthodontics/fixed-${index + 2}-after.jpeg`,
      ]);
      expect(item.kind === "comparison" && item.alt).toEqual({
        before: `Fixed case ${index + 1} – before treatment`,
        after: `Fixed case ${index + 1} – after treatment`,
      });
    });
  });
  it("uses square cards for every case", () => {
    expect(cases.every((c) => c.aspect === "square")).toBe(true);
  });
});
