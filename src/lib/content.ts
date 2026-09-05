import libraryImg from "@/assets/feature-library.jpg";
import manuscriptImg from "@/assets/feature-manuscript.jpg";
import poetryImg from "@/assets/feature-poetry.jpg";
import historyImg from "@/assets/feature-history.jpg";
import cityImg from "@/assets/feature-city.jpg";
import cultureImg from "@/assets/feature-culture.jpg";

export type Section = "essays" | "poetry" | "short-stories" | "reviews" | "perspectives";

export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
};

export type Post = {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  section: Section;
  category: string;
  tags: string[];
  authorSlug: string;
  date: string;
  readTime: number;
  image: string;
  featured?: boolean;
  editorsChoice?: boolean;
  popularity: number;
  body: string[];
  poem?: string;
};

export const sections: { id: Section; label: string; blurb: string }[] = [
  {
    id: "essays",
    label: "Articles & Essays",
    blurb: "Long-form analysis, argument, and scholarship.",
  },
  { id: "poetry", label: "Poetry", blurb: "Verse, translation, and the music of language." },
  { id: "short-stories", label: "Short Stories", blurb: "Fiction in its most concentrated form." },
  { id: "reviews", label: "Reviews", blurb: "Books, ideas, and cultural criticism." },
  { id: "perspectives", label: "Perspectives", blurb: "Opinion, dialogue, and dissent." },
];

export const categories = [
  "Philosophy",
  "Literature",
  "Culture",
  "History",
  "Modern Essays",
  "Language",
];

export const authors: Author[] = [
  {
    slug: "layla-nasser",
    name: "Layla Nasser",
    role: "Contributing Editor",
    initials: "LN",
    bio: "Layla writes on metaphysics and the ethics of attention. She teaches comparative philosophy and edits the Essays desk at Alma'rifa.",
  },
  {
    slug: "omar-haddad",
    name: "Omar Haddad",
    role: "Poetry Editor",
    initials: "OH",
    bio: "Poet and translator working between Arabic and English. His third collection explores exile, memory, and the grammar of longing.",
  },
  {
    slug: "yusuf-karim",
    name: "Yusuf Karim",
    role: "Historian",
    initials: "YK",
    bio: "Historian of science and manuscript culture, with a particular interest in how knowledge travels between languages.",
  },
  {
    slug: "sara-mansour",
    name: "Sara Mansour",
    role: "Critic",
    initials: "SM",
    bio: "Critic and essayist covering contemporary fiction, film, and the shifting shape of the reading public.",
  },
];

export function authorBySlug(slug: string): Author {
  return authors.find((a) => a.slug === slug) ?? authors[0];
}

const lorem = (topic: string) => [
  `Every generation inherits a vocabulary it did not choose. ${topic} arrives already weighted with the arguments of the dead, and the first act of thinking is often an act of unpacking: separating what a word once meant from what we now need it to mean.`,
  `The temptation is to treat this inheritance as a burden. But an inherited language is also a kind of instrument, tuned over centuries by people who were listening carefully. To play it badly is easy. To play it well requires the patience to learn what the instrument can already do before demanding that it do something else.`,
  `Consider how a reader moves through a difficult page. There is a first pass, fast and acquisitive, hunting for the shape of the argument. There is a second pass, slower, in which the sentences begin to answer one another. And there is a third, rarer pass, in which the reader stops being a spectator and becomes a participant — the point at which reading turns into thought.`,
  `That third pass is what a publication like this one exists to protect. It cannot be manufactured by design or hurried by summary. It can only be invited: by clean margins, by unhurried prose, by the willingness to let an idea take the space it actually needs.`,
  `What follows from this is not a doctrine but a discipline. Read widely, quote precisely, argue in good faith, and remember that certainty is usually a symptom of having stopped too early. The work is slow, and the slowness is the method.`,
];

export const posts: Post[] = [
  {
    slug: "the-quiet-architecture-of-attention",
    title: "The Quiet Architecture of Attention",
    subtitle:
      "On reading as a moral practice, and what we lose when the page becomes a feed.",
    excerpt:
      "Attention is not a resource to be spent but a faculty to be shaped. A meditation on the ethics of slow reading in a fast century.",
    section: "essays",
    category: "Philosophy",
    tags: ["Attention", "Ethics", "Reading"],
    authorSlug: "layla-nasser",
    date: "2026-08-28",
    readTime: 14,
    image: libraryImg,
    featured: true,
    editorsChoice: true,
    popularity: 98,
    body: lorem("attention"),
  },
  {
    slug: "a-grammar-of-longing",
    title: "A Grammar of Longing",
    subtitle: "Three poems on exile, translated from the Arabic.",
    excerpt:
      "Verse that measures distance not in miles but in the untranslatable interval between two words for home.",
    section: "poetry",
    category: "Literature",
    tags: ["Poetry", "Translation", "Exile"],
    authorSlug: "omar-haddad",
    date: "2026-08-24",
    readTime: 6,
    image: poetryImg,
    featured: true,
    popularity: 91,
    body: [
      "These three poems were written across a decade and two countries. What survives translation is not the sound but the silence between the lines — the pause a reader is obliged to fill.",
    ],
    poem: `I left the door unlocked for a country
that never learned my address.

    In the morning the light arrives
    the way a letter arrives:
    late, and addressed to someone
    I used to be.

*

Say the word for home
in the language you dream in.
Now say it in the language you work in.
Notice which one needs an explanation.

*

There is a room in me
with the furniture still covered.
I keep meaning to open the shutters.
I keep meaning to stay.`,
  },
  {
    slug: "how-knowledge-traveled",
    title: "How Knowledge Traveled",
    subtitle: "Manuscripts, merchants, and the long road of an idea.",
    excerpt:
      "Before the printing press, an idea moved at the speed of a caravan. What that pace taught scholars about patience and proof.",
    section: "essays",
    category: "History",
    tags: ["History", "Manuscripts", "Science"],
    authorSlug: "yusuf-karim",
    date: "2026-08-19",
    readTime: 18,
    image: historyImg,
    featured: true,
    popularity: 88,
    body: lorem("the transmission of knowledge"),
  },
  {
    slug: "the-novel-after-the-feed",
    title: "The Novel After the Feed",
    subtitle: "Contemporary fiction is learning to write in fragments. Is that a loss?",
    excerpt:
      "A survey of the fractured novel — its pleasures, its evasions, and the older ambitions it quietly abandons.",
    section: "reviews",
    category: "Literature",
    tags: ["Fiction", "Criticism", "Modern Essays"],
    authorSlug: "sara-mansour",
    date: "2026-08-15",
    readTime: 11,
    image: cityImg,
    editorsChoice: true,
    popularity: 84,
    body: lorem("the contemporary novel"),
  },
  {
    slug: "the-cartographers-apprentice",
    title: "The Cartographer's Apprentice",
    subtitle: "A short story.",
    excerpt:
      "He was hired to draw coastlines he had never seen, and discovered that every map is an argument about what deserves a name.",
    section: "short-stories",
    category: "Literature",
    tags: ["Fiction", "Memory"],
    authorSlug: "sara-mansour",
    date: "2026-08-11",
    readTime: 9,
    image: manuscriptImg,
    popularity: 76,
    body: lorem("the mapmaker's craft"),
  },
  {
    slug: "against-the-tyranny-of-the-summary",
    title: "Against the Tyranny of the Summary",
    subtitle: "What gets lost when every argument must fit in a paragraph.",
    excerpt:
      "Compression is a service until it becomes a worldview. On the quiet violence of the executive summary.",
    section: "perspectives",
    category: "Modern Essays",
    tags: ["Media", "Language", "Criticism"],
    authorSlug: "layla-nasser",
    date: "2026-08-06",
    readTime: 8,
    image: cultureImg,
    editorsChoice: true,
    popularity: 81,
    body: lorem("summary and compression"),
  },
  {
    slug: "the-weaver-and-the-word",
    title: "The Weaver and the Word",
    subtitle: "On craft traditions as a form of literacy.",
    excerpt:
      "A loom is a sentence you can stand inside. What textile makers know about structure that writers keep rediscovering.",
    section: "essays",
    category: "Culture",
    tags: ["Craft", "Culture", "Language"],
    authorSlug: "yusuf-karim",
    date: "2026-07-31",
    readTime: 12,
    image: cultureImg,
    popularity: 70,
    body: lorem("craft as literacy"),
  },
  {
    slug: "nocturne-for-a-borrowed-city",
    title: "Nocturne for a Borrowed City",
    subtitle: "A poem in four movements.",
    excerpt: "Rain on glass, a street that belongs to no one, and the arithmetic of staying awake.",
    section: "poetry",
    category: "Literature",
    tags: ["Poetry", "City", "Night"],
    authorSlug: "omar-haddad",
    date: "2026-07-26",
    readTime: 4,
    image: cityImg,
    popularity: 73,
    body: [
      "Written over four nights in a city the poet did not choose, this nocturne keeps its own irregular time.",
    ],
    poem: `The city rehearses its evening
    without me.

Somewhere a shutter comes down
like a sentence finishing itself.

*

I have learned the bus routes
and none of the names.
Fluency is a kind of forgetting
I have not yet agreed to.

*

Rain, then the long clean silence
of streetlights doing their arithmetic.

*

If you are reading this
in a language you were given
rather than one you chose —
we are, briefly, neighbours.`,
  },
  {
    slug: "the-uses-of-difficulty",
    title: "The Uses of Difficulty",
    subtitle: "Why some books should resist you.",
    excerpt:
      "Difficulty is not a failure of communication. Sometimes it is the only honest shape a thought can take.",
    section: "perspectives",
    category: "Philosophy",
    tags: ["Reading", "Criticism", "Philosophy"],
    authorSlug: "layla-nasser",
    date: "2026-07-20",
    readTime: 10,
    image: libraryImg,
    popularity: 79,
    body: lorem("difficulty"),
  },
  {
    slug: "marginalia",
    title: "Marginalia",
    subtitle: "A defence of writing in books.",
    excerpt:
      "The margin is the oldest comment section, and still the best one. Notes on annotation as conversation.",
    section: "essays",
    category: "Language",
    tags: ["Reading", "Manuscripts", "Culture"],
    authorSlug: "yusuf-karim",
    date: "2026-07-14",
    readTime: 7,
    image: manuscriptImg,
    popularity: 68,
    body: lorem("marginalia"),
  },
  {
    slug: "review-the-long-inheritance",
    title: "Review: The Long Inheritance",
    subtitle: "A sweeping history that trusts its reader.",
    excerpt:
      "Rare is the history book that resists the urge to conclude. This one leaves the argument open, and is stronger for it.",
    section: "reviews",
    category: "History",
    tags: ["Review", "History"],
    authorSlug: "sara-mansour",
    date: "2026-07-08",
    readTime: 9,
    image: historyImg,
    popularity: 64,
    body: lorem("historical writing"),
  },
  {
    slug: "the-last-reader",
    title: "The Last Reader",
    subtitle: "A short story about a library that refuses to close.",
    excerpt:
      "Every night she shelved books no one had requested in eleven years, and every night the shelves were slightly fuller.",
    section: "short-stories",
    category: "Literature",
    tags: ["Fiction", "Libraries"],
    authorSlug: "sara-mansour",
    date: "2026-07-02",
    readTime: 13,
    image: libraryImg,
    popularity: 72,
    body: lorem("libraries"),
  },
];

export const sortedPosts = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

export function postBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function postsBySection(section: Section) {
  return sortedPosts.filter((p) => p.section === section);
}

export function relatedPosts(post: Post, count = 3) {
  return sortedPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score:
        (p.section === post.section ? 2 : 0) +
        (p.category === post.category ? 2 : 0) +
        p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((x) => x.p);
}

export const popularPosts = [...posts].sort((a, b) => b.popularity - a.popularity).slice(0, 5);

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function sectionLabel(id: Section) {
  return sections.find((s) => s.id === id)?.label ?? id;
}
