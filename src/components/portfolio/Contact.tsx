import { useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { buildBookingUrl, bookingErrors, profile, type Booking } from "@/data/profile";
import { Reveal, SectionHeading } from "./shared";
export function Contact() {
  const [booking, setBooking] = useState<Booking>({ name: "", preferred: "", message: "" });
  const [errors, setErrors] = useState({ name: "", preferred: "" });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = bookingErrors(booking);
    setErrors(next);
    if (next.name || next.preferred) return;
    window.open(buildBookingUrl(booking), "_blank", "noopener,noreferrer");
  };
  return (
    <section id="contact" className="section contact-section">
      <div className="container contact-grid">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Get in touch"
            subtitle="For clinical opportunities, collaborations or your next appointment."
          />
          <Reveal className="contact-list">
            <a href={profile.phoneHref}>
              <span className="icon-tile">
                <Phone />
              </span>
              <span>
                <small>PHONE</small>
                <strong>{profile.phone}</strong>
              </span>
              <ArrowUpRight />
            </a>
            <a href={`mailto:${profile.email}`}>
              <span className="icon-tile">
                <Mail />
              </span>
              <span>
                <small>EMAIL</small>
                <strong>{profile.email}</strong>
              </span>
              <ArrowUpRight />
            </a>
            <div className="contact-location">
              <span className="icon-tile">
                <MapPin />
              </span>
              <span>
                <small>LOCATION</small>
                <strong>{profile.location}</strong>
              </span>
            </div>
          </Reveal>
          <Reveal className="contact-signature">
            <span className="signature">Mohamed Samy</span>
            <span>GENERAL DENTIST · DENTAL CONTENT CREATOR</span>
          </Reveal>
        </div>
        <Reveal className="booking-card">
          <span className="icon-tile">
            <FaWhatsapp aria-hidden="true" />
          </span>
          <h3>
            Book an Appointment
            <br />
            on WhatsApp
          </h3>
          <form noValidate onSubmit={submit}>
            <label htmlFor="booking-name">
              Your name <span>*</span>
            </label>
            <input
              id="booking-name"
              name="name"
              autoComplete="name"
              placeholder="Full name"
              value={booking.name}
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              onChange={(event) => setBooking({ ...booking, name: event.target.value })}
            />
            {errors.name && (
              <p className="field-error" id="name-error">
                {errors.name}
              </p>
            )}
            <label htmlFor="booking-time">
              Preferred day & time <span>*</span>
            </label>
            <input
              id="booking-time"
              type="datetime-local"
              name="preferred"
              value={booking.preferred}
              required
              aria-invalid={Boolean(errors.preferred)}
              aria-describedby={errors.preferred ? "time-error" : undefined}
              onChange={(event) => setBooking({ ...booking, preferred: event.target.value })}
            />
            {errors.preferred && (
              <p className="field-error" id="time-error">
                {errors.preferred}
              </p>
            )}
            <label htmlFor="booking-message">
              Your message <span className="optional">(optional)</span>
            </label>
            <textarea
              id="booking-message"
              rows={3}
              placeholder="How can I help you?"
              value={booking.message}
              onChange={(event) => setBooking({ ...booking, message: event.target.value })}
            />
            <Button variant="accent" size="lg" type="submit">
              <FaWhatsapp aria-hidden="true" />
              Book Appointment
              <ArrowUpRight />
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
