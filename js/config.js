/* =====================================================================
   WAMBUI LUTHER ART — CENTRAL CONFIGURATION
   ---------------------------------------------------------------------
   Edit this one file to change contact details, biography, prices,
   services, testimonials and the artwork collection.
   Everything marked PLACEHOLDER must be replaced before going live.
   ===================================================================== */

window.WLA_CONFIG = {

  /* ---------- Brand ---------- */
  brand: {
    name: "Wambui Luther Art",
    artistName: "Wambui Luther",
    tagline: "Drawing stories, one stroke at a time.",
    descriptor: "Traditional Pencil & Charcoal Art | Original Drawings | Custom Commissions",
    signatureImage: "assets/illustrations/signature-placeholder.svg" // PLACEHOLDER: real signature scan
  },

  /* ---------- Contact ---------- */
  contact: {
    // PLACEHOLDER — international format, digits only, no "+" or spaces. e.g. Kenya: 2547XXXXXXXX
    whatsappNumber: "254700000000",
    whatsappIsPlaceholder: true, // set to false once the real number is added above
    email: "hello@example.com",                       // PLACEHOLDER
    instagramUrl: "https://www.instagram.com/",       // PLACEHOLDER — full profile URL
    instagramHandle: "@yourhandle",                   // PLACEHOLDER
    location: "Kenya"                                 // shown in footer; edit or set to ""
  },

  /* ---------- About (all PLACEHOLDER copy — replace with the artist's own words) ---------- */
  about: {
    portrait: "assets/images/artist/about-placeholder.svg",
    portraitAlt: "Placeholder for a photo of Wambui Luther in her studio",
    biography: [
      "Hi, I'm Wambui. I draw with pencil and charcoal: faces, moments and small things that deserve a second look. [Placeholder biography — replace with your own story.]",
      "Every piece starts with a blank page and a lot of patience. I love the way graphite can be soft as breath or deep as night, and how a drawing slowly comes alive, layer after layer. [Placeholder — edit freely.]"
    ],
    interests: ["Portraiture", "Expressions & emotion", "Textures in nature", "Light and shadow"],
    materials: ["Graphite pencils (2H–8B)", "Compressed & vine charcoal", "Kneaded eraser", "Blending stumps", "Heavyweight drawing paper"],
    philosophy: "A drawing should feel like a memory you can hold. I'd rather spend another hour on the eyes than rush a single stroke. [Placeholder]",
    inspiration: "People, everyday light, old photographs and the quiet details most of us walk past. [Placeholder]",
    enjoys: ["Realistic portraits", "Charcoal studies", "Pet portraits", "Botanical sketches"]
  },

  /* ---------- Commission services & prices ----------
     All prices are PLACEHOLDER figures in KES and are NOT confirmed rates.
     priceFrom: number (KES). sizes: shown in cards & the enquiry form.    */
  currency: "KES",
  pricesArePlaceholder: true,
  services: [
    {
      id: "individual",
      name: "Individual Pencil Portrait",
      description: "A detailed graphite portrait of one person, drawn from your favourite photograph.",
      priceFrom: 3500,
      sizes: ["A4", "A3", "A2"],
      turnaround: "5–7 days",
      note: "most requested"
    },
    {
      id: "couple",
      name: "Couple Portrait",
      description: "Two people, one drawing. Perfect for anniversaries, weddings and engagements.",
      priceFrom: 6000,
      sizes: ["A4", "A3", "A2"],
      turnaround: "7–10 days",
      note: "lovely as a gift"
    },
    {
      id: "family",
      name: "Family Portrait",
      description: "Three or more people brought together in a single, carefully composed drawing.",
      priceFrom: 9000,
      sizes: ["A3", "A2"],
      turnaround: "10–14 days",
      note: ""
    },
    {
      id: "charcoal",
      name: "Charcoal Portrait",
      description: "Bold, dramatic contrast and soft, smoky shadows in rich charcoal.",
      priceFrom: 5000,
      sizes: ["A3", "A2"],
      turnaround: "7–10 days",
      note: "deep & moody"
    },
    {
      id: "pet",
      name: "Pet Portrait",
      description: "Fur, whiskers and personality: a tribute to your dog, cat or any loyal companion.",
      priceFrom: 3500,
      sizes: ["A4", "A3"],
      turnaround: "5–7 days",
      note: ""
    },
    {
      id: "custom",
      name: "Custom Drawing",
      description: "Have something different in mind? Places, objects, ideas — let's talk about it.",
      priceFrom: 4000,
      sizes: ["A5", "A4", "A3", "A2"],
      turnaround: "Discussed per project",
      note: "tell me your idea"
    }
  ],
  pricingNote: "Final pricing may vary depending on drawing size, complexity and the number of subjects.",
  budgetRanges: ["Under KES 4,000", "KES 4,000 – 7,000", "KES 7,000 – 12,000", "KES 12,000+", "Not sure yet"],

  /* ---------- Gallery categories ---------- */
  categories: [
    { id: "all", label: "All Work" },
    { id: "pencil", label: "Pencil Portraits" },
    { id: "charcoal", label: "Charcoal Art" },
    { id: "nature", label: "Nature & Still Life" },
    { id: "commission", label: "Custom Commissions" }
  ],

  /* ---------- Artwork collection ----------
     ALL entries below are PLACEHOLDERS (generated example sketches).
     Replace `image` with the path to a real artwork photo, update the text,
     and add/remove objects freely.
       size: "large" | "tall" | "wide" | "regular"  (controls gallery layout)
       note: optional handwritten annotation shown on the card            */
  artworksArePlaceholder: true, // set to false once real artwork photos are in (or set placeholder:false per item)
  artworks: [
    { id: 1,  title: "Portrait Study I",  category: "pencil",     medium: "Graphite on paper",     year: 2025, description: "Placeholder description. A quiet portrait study focused on soft light across the face.", image: "assets/images/artwork/portrait-study-01.svg", width: 800, height: 1000, featured: true,  size: "large",   note: "One of my favourites." },
    { id: 2,  title: "Eye Study No. 04",  category: "pencil",     medium: "Graphite on paper",     year: 2025, description: "Placeholder description. Practising reflections and the fine texture of lashes.",    image: "assets/images/artwork/eye-study.svg",         width: 1200, height: 900, featured: false, size: "wide",    note: "Study No. 04" },
    { id: 3,  title: "Night Portrait",    category: "charcoal",   medium: "Compressed charcoal",   year: 2024, description: "Placeholder description. Building a face out of darkness with charcoal and an eraser.", image: "assets/images/artwork/charcoal-portrait.svg", width: 1000, height: 1100, featured: true,  size: "tall",    note: "" },
    { id: 4,  title: "Garden Stem",       category: "nature",     medium: "HB & 4B pencil",        year: 2024, description: "Placeholder description. A botanical study drawn from a cutting on the windowsill.",   image: "assets/images/artwork/botanical-study.svg",   width: 800, height: 1200, featured: false, size: "tall",    note: "Graphite on paper." },
    { id: 5,  title: "Couple, Untitled",  category: "commission", medium: "Graphite on paper",     year: 2025, description: "Placeholder description. An example of a couple-portrait commission layout.",          image: "assets/images/artwork/couple-commission.svg", width: 900, height: 1000, featured: false, size: "regular", note: "" },
    { id: 6,  title: "Still Life with Vase", category: "nature",  medium: "Graphite on paper",     year: 2023, description: "Placeholder description. Light, form and cast shadow on a simple kitchen arrangement.", image: "assets/images/artwork/still-life.svg",        width: 1200, height: 900, featured: true,  size: "wide",    note: "A little more shading here." },
    { id: 7,  title: "Hands in Charcoal", category: "charcoal",   medium: "Vine & compressed charcoal", year: 2024, description: "Placeholder description. Gestural charcoal marks lifted with a kneaded eraser.", image: "assets/images/artwork/charcoal-hands.svg",    width: 1000, height: 1000, featured: false, size: "regular", note: "" },
    { id: 8,  title: "Portrait Study II", category: "pencil",     medium: "Graphite on paper",     year: 2025, description: "Placeholder description. A three-quarter view exploring the turn of the head.",        image: "assets/images/artwork/portrait-study-02.svg", width: 800, height: 1200, featured: false, size: "tall",    note: "" },
    { id: 9,  title: "Loyal Friend",      category: "commission", medium: "Graphite on paper",     year: 2025, description: "Placeholder description. An example of a pet-portrait commission.",                    image: "assets/images/artwork/pet-commission.svg",    width: 1000, height: 1000, featured: false, size: "regular", note: "Whiskers took forever!" },
    { id: 10, title: "Shell Spiral",      category: "nature",     medium: "2H – 6B pencil",        year: 2023, description: "Placeholder description. Repeating curves found in a shell picked up by the sea.",    image: "assets/images/artwork/shell-study.svg",       width: 1000, height: 1000, featured: false, size: "regular", note: "" },
    { id: 11, title: "Family of Three",   category: "commission", medium: "Graphite on paper",     year: 2024, description: "Placeholder description. An example of a family-portrait commission composition.",     image: "assets/images/artwork/family-commission.svg", width: 1200, height: 900, featured: false, size: "wide",    note: "" },
    { id: 12, title: "Gesture Sketch",    category: "pencil",     medium: "Soft pencil, 60 seconds", year: 2025, description: "Placeholder description. A quick figure gesture — the very first marks of an idea.", image: "assets/images/artwork/gesture-sketch.svg",    width: 800, height: 1150, featured: false, size: "regular", note: "Work in progress." }
  ],

  /* ---------- Process stages (PLACEHOLDER images & copy) ---------- */
  process: [
    { title: "Inspiration",          image: "assets/images/process/stage-1.svg", text: "It begins with a photo, a memory or a story you share with me. We choose the moment worth keeping.", note: "the spark ✦" },
    { title: "Initial Sketch",       image: "assets/images/process/stage-2.svg", text: "Light, loose construction lines map out proportions and placement on the page.", note: "measure twice!" },
    { title: "Building the Details", image: "assets/images/process/stage-3.svg", text: "Features take shape: eyes, expression and the small details that make it them.", note: "eyes first, always" },
    { title: "Shading & Refinement", image: "assets/images/process/stage-4.svg", text: "Layer upon layer of graphite and charcoal create depth, texture and light.", note: "hours of patience" },
    { title: "The Finished Piece",   image: "assets/images/process/stage-5.svg", text: "Signed, protected and carefully packaged — ready to be held onto for years.", note: "yours to keep ♡" }
  ],

  /* ---------- Testimonials — PLACEHOLDER (not real clients) ---------- */
  testimonials: [
    { quote: "Placeholder testimonial. Replace this with a real message from a happy client about their commission.", name: "Client Name", detail: "Couple Portrait · placeholder" },
    { quote: "Placeholder testimonial. A short, genuine sentence about the experience and the finished drawing works best.", name: "Client Name", detail: "Pet Portrait · placeholder" },
    { quote: "Placeholder testimonial. Only publish real words, with the client's permission.", name: "Client Name", detail: "Family Portrait · placeholder" }
  ]
};
