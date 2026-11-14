/* =====================================================================
   WAMBUI LUTHER ART — CENTRAL CONFIGURATION
   ---------------------------------------------------------------------
   Edit this one file to change contact details, biography, prices,
   artwork, process photos and the "Spot the Silver" story.
   ===================================================================== */

window.WLA_CONFIG = {

  /* ---------- Brand ---------- */
  brand: {
    name: "Wambui Luther Art",
    artistName: "Wambui Luther",
    fullName: "Laurene Wambui Luther",
    tagline: "Drawing stories, one stroke at a time.",
    descriptor: "Self-taught Portrait Artist · Graphite, Charcoal & Mixed Media",
    signatureImage: "assets/illustrations/signature.png"
  },

  /* ---------- Contact ---------- */
  contact: {
    whatsappNumber: "254706293787",          // international format, digits only
    whatsappIsPlaceholder: false,
    phoneDisplay: "0706 293 787",
    email: "laurenewambui@gmail.com",
    instagramUrl: "https://www.instagram.com/wambui.luther_art/",
    instagramHandle: "@wambui.luther_art",
    tiktokUrl: "https://www.tiktok.com/@wambui.luther_art",
    tiktokHandle: "@wambui.luther_art",
    location: ""                              // e.g. "Nairobi, Kenya" — leave "" to hide
  },

  /* ---------- About (her own words) ---------- */
  about: {
    portrait: "assets/images/artist/wambui-with-family-portrait.jpg",
    portraitAlt: "Wambui Luther standing beside her finished family portrait, framed on an easel",
    portraitCaption: "with the family portrait, 2026",
    biography: [
      "I started drawing at six, recreating cartoons from TV and magazines. I've always loved working with my hands. My uncle, also an artist, became my first muse; he bought me colour pencils and drawing books and cheered me on, and I kept drawing all through university, mostly without direction, just as a hobby.",
      "The turning point came in 2019, when I felt a sudden urge to draw my late father. We took a photo together that December, not knowing it would be our last; he passed away from Covid-19 the following year. I started his portrait in 2021 while grieving, and it's still the hardest piece I've ever made.",
      "When I finally finished it and shared it publicly, the response was incredible, and I decided to take my art further than a hobby.",
      "Art has become my way of processing and expressing, and I want to share that with others. Personalised pieces that hold memory, mark milestones, and help people reconnect with themselves or the ones they love. My art turns blank walls into spaces that feel warm and alive."
    ],
    enjoys: ["Personal portraits", "Family & couple portraits", "Pieces that hold a memory", "Gifts for the people you love"],
    materials: ["Graphite & charcoal pencils", "Strathmore Bristol & Vellum paper", "Gold & silver leaf", "Colour pencil", "Kneaded eraser"],
    interests: ["Emotion", "Memory", "Milestones", "The story behind a face"],
    philosophy: "My work centres on personal portraiture: capturing not just likeness, but the emotion, memory and story behind each subject.",
    inspiration: "My uncle, also an artist, was my first muse. He bought me colour pencils and drawing books and cheered me on."
  },

  /* ---------- "Unseen but Not Forgotten" memorial ---------- */
  memorial: {
    title: "Unseen but Not Forgotten",
    year: 2021,
    reference: "assets/images/artwork/unseen-reference.jpg",
    referenceCaption: "In memory of Martin Njoroge Luther — the reference",
    finished: "assets/images/artwork/unseen-but-not-forgotten-2021.jpg",
    finishedCaption: "The finished portrait",
    quote: "Some portraits hold more than faces. They carry memory. This one was heavy; I had to slow down, sit with uncertainty, and give it honesty rather than perfection. Though my muse never laid eyes on it, this portrait carries a reminder: keep creating, even in moments of uncertainty. Unseen, but not forgotten.",
    why: "I named it 'Unseen but Not Forgotten' because that's exactly what it was. He never got to see it finished, but the piece exists anyway, and so does he, in every line of it.",
    details: "Strathmore Bristol 400 series, smooth surface · A3"
  },

  /* ---------- Commission pricing (from the official rate card) ----------
     prices[n] = price for n+1 people.  All amounts in KSh.               */
  currency: "KSh",
  pricesArePlaceholder: false,
  sizes: [
    { id: "A4", cm: "21 × 30", w: 21, h: 30, tag: "sweet & simple", desc: "About the size of a notebook. A lovely gift or desk piece.",
      drawing: [6000, 8000, 9000],    framed: [6800, 8800, 9800],     frameAdds: 800,   colourAddOn: 1000 },
    { id: "A3", cm: "30 × 42", w: 30, h: 42, tag: "most popular",   desc: "Perfect for a single portrait on a shelf or small wall.",
      drawing: [10000, 13000, 16000], framed: [11300, 14300, 17300],  frameAdds: 1300,  colourAddOn: 1500, popular: true },
    { id: "A2", cm: "42 × 59", w: 42, h: 59, tag: "statement piece", desc: "Great for couples, a real statement in a bedroom or hallway.",
      drawing: [18000, 20000, 22000], framed: [20500, 22500, 24500],  frameAdds: 2500,  colourAddOn: 2000 },
    { id: "A1", cm: "59 × 84", w: 59, h: 84, tag: "premium",        desc: "Made for family portraits above the sofa.",
      drawing: [25000, 27500, 30000], framed: [29800, 32300, 34800],  frameAdds: 4800,  colourAddOn: 3000 },
    { id: "A0", cm: "84 × 119", w: 84, h: 119, tag: "the grand piece", desc: "A showstopper feature wall, where every detail comes alive.",
      drawing: [35000, 38000, 42000], framed: [45000, 48000, 52000],  frameAdds: 10000, colourAddOn: 4000 }
  ],
  styles: [
    { id: "plain",  name: "Plain",             desc: "Classic graphite & charcoal. Soft, timeless and full of depth.",                     badge: "Included" },
    { id: "leaf",   name: "Gold / silver leaf", desc: "Graphite & charcoal with touches of gold or silver leaf that catch the light.",    badge: "Included" },
    { id: "colour", name: "Colour pencil",     desc: "Graphite & charcoal with layers of colour pencil, for warm, lifelike tones.",       badge: "Small add-on" }
  ],
  includes: [
    "A signed certificate of authenticity with your artwork's details, so you know your portrait is an original, made by hand.",
    "The option to have it framed. Go for the drawing price, or the framed price if you'd like it ready for the wall.",
    "Delivery is charged separately, depending on where you are."
  ],
  customQuoteNote: "More than three people, or a detailed background? Send me your photo for a custom quote.",
  pricingNote: "Prices are per portrait in KSh, by number of people. Delivery is charged separately.",

  /* ---------- Gallery categories ---------- */
  categories: [
    { id: "all", label: "All Work" },
    { id: "portrait", label: "Graphite & Charcoal" },
    { id: "mixed", label: "Mixed Media" },
    { id: "gift", label: "Gifts & Commissions" }
  ],

  /* ---------- Artwork collection ----------
       size:  "large" | "tall" | "wide" | "regular"  (gallery layout only)
       paper / hours / dimensions: optional details shown in the viewer
       year: leave null if unknown                                       */
  artworksArePlaceholder: false,
  artworks: [
    { id: 1, title: "The Silver Watch", category: "mixed", medium: "Graphite & charcoal with silver leaf", year: 2026,
      hours: 37,
      description: "There's one thing in this portrait that isn't charcoal. I drew every other line; the silver leaf on the watch decided for itself, and it shifts with the light every time you walk past.",
      image: "assets/images/artwork/silver-watch-portrait-2026.jpg", width: 1080, height: 1350, featured: true, size: "large", note: "my latest piece",
      alt: "Charcoal portrait of a smiling man in a cap and glasses, arms crossed, wearing a watch with a silver-leaf face" },

    { id: 2, title: "Family Portrait", category: "portrait", medium: "Graphite & charcoal on Strathmore Vellum", year: 2026,
      dimensions: "A0 (79 × 93 cm)", hours: 126,
      description: "126 hours later, I understand what it means to trust the process. Maybe you don't have to have it all figured out. Maybe you just have to keep showing up. And maybe, that's how we become.",
      image: "assets/images/artwork/family-portrait-2026.jpg", width: 1080, height: 767, featured: true, size: "wide", note: "126 hours of patience",
      alt: "Large graphite and charcoal portrait of three smiling family members side by side" },

    { id: 3, title: "Unseen but Not Forgotten", category: "portrait", medium: "Graphite & charcoal on Strathmore Bristol 400", year: 2021,
      dimensions: "A3",
      description: "My father's portrait, started in 2021 while grieving. He never got to see it finished, but the piece exists anyway, and so does he, in every line of it.",
      image: "assets/images/artwork/unseen-but-not-forgotten-2021.jpg", width: 1080, height: 1350, featured: false, size: "tall", note: "the piece that started it all",
      alt: "Graphite portrait of the artist's late father, Martin Njoroge Luther, smiling, with the words Unseen but not forgotten" },

    { id: 4, title: "Ilaria's Portrait", category: "mixed", medium: "Graphite, charcoal & colour on Strathmore Bristol 400 (smooth)", year: 2025,
      dimensions: "A2 (14 × 17 in)", hours: 60,
      description: "60 hours in the making, and moments where time disappeared completely. Two shades felt dull, so I started experimenting, mixing colours and letting instinct lead.",
      image: "assets/images/artwork/ilaria-portrait-2025.jpg", width: 518, height: 646, featured: false, size: "regular", note: "",
      alt: "Portrait of a smiling young woman in a floral dress leaning on a table, graphite with touches of pink colour" },

    { id: 5, title: "Jadd's 22nd Birthday", category: "gift", medium: "Graphite & charcoal on Strathmore Vellum", year: 2024,
      dimensions: "A3", hours: 25,
      description: "Creating this piece felt like giving away a part of myself. Every moment spent was a part of my soul invested. I'm more than pleased to share these 25 hours of my life with a special friend.",
      image: "assets/images/artwork/birthday-portrait-2024.jpg", width: 1258, height: 1600, featured: false, size: "regular", note: "",
      alt: "Graphite portrait of a smiling young woman with long braids and hoop earrings, taking a selfie" },

    { id: 6, title: "In His Memory", category: "gift", medium: "Graphite & charcoal on Strathmore Vellum", year: null,
      dimensions: "A2", hours: 40,
      description: "Dedicated to my dad's memory, this piece is a priceless gift for a dear friend, holding so many meanings and memories. It became my light in the midst of grief and in tough times.",
      image: "assets/images/artwork/in-his-memory-gift.jpg", width: 723, height: 542, featured: false, size: "wide", note: "40 hours of light",
      alt: "Graphite portrait of two smiling men side by side in matching polo shirts" },

    { id: 7, title: "How Far Friendships Grow", category: "gift", medium: "Graphite & charcoal on Strathmore Vellum", year: 2024,
      dimensions: "A3",
      description: "This piece takes me back to cherished memories and reminds me of how far friendships can grow.",
      image: "assets/images/artwork/friendship-portrait-2024.jpg", width: 1238, height: 1599, featured: false, size: "regular", note: "",
      alt: "Graphite portrait of a young woman with curly hair resting her chin on her hand, wearing a wristwatch" },

    { id: 8, title: "Lost Track of Time", category: "mixed", medium: "Graphite, charcoal & colour pencil on Strathmore Bristol 300", year: null,
      dimensions: "A3 (11 × 14 in)",
      description: "This piece is a beautiful reminder of how subjective art can be. I lost track of time while creating it, but it was truly healing.",
      image: "assets/images/artwork/red-flower-portrait.jpg", width: 1294, height: 1600, featured: false, size: "regular", note: "truly healing",
      alt: "Graphite portrait of a young woman looking down, with a red flower in her hair drawn in colour pencil" }
  ],

  /* ---------- Process stages ---------- */
  process: [
    { title: "Inspiration",          image: "assets/images/process/stage-1.jpg", alt: "A reference photo on a phone held next to a portrait in progress",
      text: "It begins with a photo and the story behind it. The reference stays beside me the whole way.", note: "the spark ✦" },
    { title: "Initial Sketch",       image: "assets/images/process/stage-2.jpg", alt: "Charcoal pencils, erasers and test swatches beside a sketchbook with the first light outline",
      text: "Pencils, charcoal and test swatches out. Light, careful lines map the face onto the page.", note: "measure twice!" },
    { title: "Building the Details", image: "assets/images/process/stage-3.jpg", alt: "Wambui drawing a portrait taped to a board at an easel outdoors",
      text: "Features take shape: the eyes, the smile, the small details that make it them.", note: "eyes first, always" },
    { title: "Shading & Refinement", image: "assets/images/process/stage-4.jpg", alt: "Close-up of a hand shading with a pencil under lamplight",
      text: "Layer after layer of graphite and charcoal for depth, texture and light. This is where the hours go.", note: "hours of patience" },
    { title: "The Finished Piece",   image: "assets/images/process/stage-5.jpg", alt: "Wambui beside a large framed family portrait on an easel",
      text: "Signed, with a certificate of authenticity, and ready to be held onto for years.", note: "yours to keep ♡" }
  ],

  /* ---------- "Spot the Silver" story (slides in order) ----------
     hotspot: the area (in % of the first slide) that counts as a correct tap */
  story: {
    slides: [
      "assets/images/story/slide-1.jpg", "assets/images/story/slide-2.jpg", "assets/images/story/slide-3.jpg", "assets/images/story/slide-4.jpg",
      "assets/images/story/slide-5.jpg", "assets/images/story/slide-6.jpg", "assets/images/story/slide-7.jpg", "assets/images/story/slide-8.jpg"
    ],
    alts: [
      "Charcoal portrait with the question: there's one thing in this portrait that isn't charcoal. Can you spot it?",
      "Close-up of the face. Not the glasses, not the cap.",
      "Close-up of the shirt collar. Keep looking.",
      "Close-up of the wristwatch. It's the watch, and there's no time on it.",
      "Silver leaf being pressed onto the watch face. I gave it silver instead.",
      "The silver watch face glowing under light. It looks different at every hour.",
      "The framed portrait on a wooden table. It moves when you do.",
      "Pencils, charcoal and the first sketch. 37 hours went into this piece."
    ],
    hotspot: { left: 15, top: 71, width: 16, height: 13 },
    answerSlide: 3
  },

  /* ---------- From the easel to the wall (real moments) ---------- */
  moments: [
    { image: "assets/images/artist/handover-shared-moment.jpg", alt: "Wambui handing a framed portrait to Ilaria", caption: "Shared moment — handing over Ilaria's portrait" },
    { image: "assets/images/artist/where-the-story-lives.jpg", alt: "The framed portrait hanging on a wall at home", caption: "Where the story lives" },
    { image: "assets/images/artist/family-portrait-viewing.jpg", alt: "Wambui looking at the framed family portrait on the wall", caption: "The family portrait, framed and home" },
    { image: "assets/images/artist/the-muse.jpg", alt: "Ilaria smiling, holding her framed portrait", caption: "The muse, with her portrait" }
  ]
};
