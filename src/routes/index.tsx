import { createFileRoute } from "@tanstack/react-router";
import { Navbar, Footer, FloatingWhatsApp, ScrollToTop } from "@/components/portfolio/Navigation";
import { Hero, About, Education, Skills } from "@/components/portfolio/ProfileSections";
import { Portfolio } from "@/components/portfolio/Portfolio";
import { Contact } from "@/components/portfolio/Contact";
import { Stories } from "@/components/portfolio/Stories";
import { IntroSplash } from "@/components/portfolio/IntroSplash";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dr. Mohamed Samy | General Dentist" },
      {
        name: "description",
        content:
          "Meet Dr. Mohamed Samy, a Saudi-licensed General Dentist in Tanta, Egypt. Explore his education, clinical expertise, esthetic dentistry and dental content.",
      },
      { property: "og:title", content: "Dr. Mohamed Samy | General Dentist" },
      {
        property: "og:description",
        content:
          "Patient-centered care, esthetic dentistry and digital precision. Discover the clinical journey and work of Dr. Mohamed Samy.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});
function Index() {
  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Navbar />
      <main tabIndex={-1}>
        <Hero />
        <About />
        <Education />
        <Portfolio />
        <Skills />
        <Stories />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ScrollToTop />
      <IntroSplash />
    </>
  );
}
