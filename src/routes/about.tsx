import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Almuasir" },
      {
        name: "description",
        content:
          "Almuasir is an independent intellectual and literary platform promoting authentic knowledge, meaningful thought, and scholarly engagement.",
      },
      { property: "og:title", content: "About Us — Almuasir" },
      {
        property: "og:description",
        content:
          "An English-language intellectual and literary platform for knowledge, research, thoughtful dialogue, and scholarly contributions.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <span className="eyebrow">About</span>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
        About Almuasir
      </h1>

      <div className="prose-reading mt-10">
        <p className="dropcap">
          Almuasir is an independent intellectual and literary platform committed to promoting
          authentic knowledge, meaningful thought, and scholarly engagement. It seeks to bring
          together readers, researchers, writers, academics, and thinkers through a diverse
          collection of articles, essays, academic studies, and literary contributions. We believe
          that knowledge enlightens minds, thought shapes perspectives, and literature gives
          expression to human experience.
        </p>
        <p>
          Our areas of interest encompass a wide range of academic and intellectual disciplines,
          including Seerah and Islamic Studies, philosophy, history and civilisation, politics and
          social sciences, Islamic finance and economics, literature, and language. From the study
          of the Qur'an, Hadith, Fiqh, and Islamic intellectual heritage to contemporary
          philosophical, social, political, and economic questions, we seek to explore ideas that
          contribute to a deeper understanding of the world.
        </p>
        <p>
          In an age characterised by the rapid circulation of information, we believe that the
          pursuit of knowledge must be grounded in authenticity, research, intellectual honesty,
          and critical inquiry. Our purpose extends beyond the mere dissemination of information;
          we aspire to encourage thoughtful engagement, constructive dialogue, and the examination
          of diverse perspectives through reliable sources, reasoned arguments, and responsible
          scholarship. We value intellectual openness, scholarly accuracy, literary excellence, and
          clarity of expression.
        </p>
        <p>
          Almuasir welcomes contributions from scholars, researchers, academics, students, writers,
          and independent thinkers committed to sharing valuable knowledge and original
          perspectives. Whether through academic research, critical essays, historical explorations,
          literary compositions, translations, or examinations of contemporary issues, we seek to
          provide a platform for meaningful intellectual exchange and the development of a vibrant
          culture of reading, writing, and research.
        </p>
        <p>
          Almuasir is the English-language sister publication of Ainul-Haqq, our Arabic literary
          and intellectual platform. While both publications share a common commitment to knowledge
          and intellectual development, Almuasir seeks to engage a wider English-speaking readership
          and provide opportunities for scholarly and independent contributions in English.
          Together, they reflect our aspiration to make meaningful knowledge accessible across
          languages and intellectual communities.
        </p>
        <p>
          Our vision is to become a credible and intellectually vibrant platform that contributes
          to the advancement of knowledge, the enrichment of literary culture, and the cultivation
          of thoughtful, informed, and critically engaged readers across the world. We believe that
          knowledge should not merely be accumulated, but examined, understood, and communicated
          with clarity, depth, and responsibility.
        </p>
        <blockquote>
          Almuasir – Where Knowledge Meets Thought, and Thought Finds Expression.
        </blockquote>
      </div>
    </div>
  );
}
