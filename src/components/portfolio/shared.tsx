import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { appointmentUrl } from "@/data/profile";
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "start",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  align?: "start" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "section-heading section-heading--center" : "section-heading"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </Reveal>
  );
}
export function AppointmentButton({
  accent = false,
  children = "Book Appointment",
  className = "",
}: {
  accent?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Button variant={accent ? "accent" : "default"} size="lg" asChild className={className}>
      <a href={appointmentUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={18} />
        {children}
        <ArrowUpRight size={16} />
      </a>
    </Button>
  );
}
