import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronRight, Mail, Menu, Phone, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { navigationOffset, scrollingDown } from "@/lib/mobile-navigation";
import { appointmentUrl, navigation, profile } from "@/data/profile";
import { AppointmentButton } from "./shared";
import { useDesktopFooterVisible } from "@/hooks/use-desktop-footer-visible";
export function Navbar() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pendingAnchor = useRef<string | null>(null);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("portfolio:menu", { detail: open }));
    const closeOnDesktop = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, [open]);
  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 20);
      let current = "home";
      for (const name of navigation) {
        const element = document.getElementById(name.toLowerCase());
        if (element && element.getBoundingClientRect().top <= navigationOffset(window.innerWidth)) current = name.toLowerCase();
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const links = navigation.map((name) => (
    <a
      key={name}
      href={`#${name.toLowerCase()}`}
      className={active === name.toLowerCase() ? "nav-link active" : "nav-link"}
      aria-current={active === name.toLowerCase() ? "location" : undefined}
      onClick={(event) => {
        if (open) {
          event.preventDefault();
          pendingAnchor.current = name.toLowerCase();
        }
        setOpen(false);
      }}
    >
      {name}<ChevronRight className="drawer-chevron" aria-hidden="true" />
    </a>
  ));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav-inner">
        <a className="brand" href="#home">
          <img className="avatar-logo" src="/doctor-avatar.png" alt="Dr. Mohamed Samy" width="44" height="44" />
          <span>
            Dr. Mohamed Samy<small>GENERAL DENTIST</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links}
        </nav>
        <AppointmentButton className="nav-appointment" />
        <DialogTrigger asChild><Button
          variant="ghost"
          size="icon"
          className="mobile-menu"
          ref={menuButton}
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls="mobile-navigation-drawer"
        >
          {open ? <X /> : <Menu />}
        </Button></DialogTrigger>
      </div>
        <DialogContent id="mobile-navigation-drawer" position="drawer" className="mobile-drawer" overlayClassName="mobile-drawer-backdrop" onCloseAutoFocus={(event) => {
          event.preventDefault();
          menuButton.current?.focus({ preventScroll: true });
          const anchor = pendingAnchor.current;
          pendingAnchor.current = null;
          if (!anchor) return;
          // Navigate only after the modal has released its scroll lock and focus.
          setTimeout(() => {
            window.history.pushState(null, "", `#${anchor}`);
            document.getElementById(anchor)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
          }, 0);
        }}>
          <div className="drawer-header">
            <img className="avatar-logo" src="/doctor-avatar.png" alt="Dr. Mohamed Samy" width="44" height="44" />
            <div className="min-w-0"><DialogTitle>{profile.name}</DialogTitle>
            <DialogDescription>General Dentist</DialogDescription></div>
          </div>
          <nav aria-label="Mobile navigation">{links}</nav>
          <div className="drawer-bottom" onClick={(event) => { if (event.target instanceof Element && event.target.closest("a")) setOpen(false); }}>
            <AppointmentButton />
          </div>
        </DialogContent>
    </header>
    </Dialog>
  );
}
export function FloatingWhatsApp() {
  const footerVisible = useDesktopFooterVisible();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    let previous = window.scrollY;
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      const current = window.scrollY;
      if (window.innerWidth < 768 && current !== previous) setHidden(scrollingDown(previous, current));
      previous = current;
      clearTimeout(timer);
      timer = setTimeout(() => setHidden(false), 700);
    };
    const menu = (event: Event) => { if (event instanceof CustomEvent) setMenuOpen(event.detail === true); };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("portfolio:menu", menu);
    return () => { clearTimeout(timer); window.removeEventListener("scroll", update); window.removeEventListener("portfolio:menu", menu); };
  }, []);
  return (
    <Button variant="accent" size="icon" className={`floating-whatsapp${hidden ? " floating-whatsapp--away" : ""}${menuOpen ? " floating-whatsapp--menu" : ""}${footerVisible ? " floating-footer-hidden" : ""}`} asChild>
      <a
        href={appointmentUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Book on WhatsApp"
        tabIndex={menuOpen || footerVisible ? -1 : undefined}
        aria-hidden={footerVisible || undefined}
      >
        <FaWhatsapp aria-hidden="true" />
      </a>
    </Button>
  );
}
export function ScrollToTop() {
  const footerVisible = useDesktopFooterVisible();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 600);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return visible ? (
    <Button
      variant="outline"
      size="icon"
      className={`scroll-top${footerVisible ? " floating-footer-hidden" : ""}`}
      tabIndex={footerVisible ? -1 : undefined}
      aria-hidden={footerVisible || undefined}
      aria-label="Back to top"
      title="Back to top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        })
      }
    >
      <ArrowUp />
    </Button>
  ) : null;
}
export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-shared">
          <div className="footer-column footer-identity">
          <a href="#home" className="footer-shared-brand">
            <img className="avatar-logo avatar-logo--footer" src="/doctor-avatar.png" alt="Dr. Mohamed Samy" width="56" height="56" />
            {profile.name}
          </a>
          <p className="footer-description">General Dentist focused on esthetic dentistry, endodontics and patient-centered care.</p>
          </div>
          <div className="footer-column footer-links">
            <h2>Quick Links</h2>
            <nav aria-label="Footer quick links">
              {navigation.map((name) => <a href={`#${name.toLowerCase()}`} key={name}>{name}</a>)}
            </nav>
          </div>
          <div className="footer-column footer-contact">
            <div className="footer-connect-group">
            <h2>Connect</h2>
            <div className="footer-connect">
              <Button asChild variant="footer" size="icon"><a href={`mailto:${profile.email}`} aria-label="Email" title="Email"><Mail /></a></Button>
              <Button asChild variant="footer" size="icon"><a href={profile.phoneHref} aria-label="Phone" title="Phone"><Phone /></a></Button>
              <Button asChild variant="footer" size="icon"><a href={appointmentUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp" className="footer-connect-whatsapp"><FaWhatsapp aria-hidden="true" /></a></Button>
            </div>
            </div>
            <div className="footer-shared-copy"><span>© {new Date().getFullYear()} Dr. Mohamed Samy.</span>{" "}<span>All rights reserved.</span></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
