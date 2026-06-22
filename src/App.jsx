import { useState, useEffect, useRef, useCallback } from "react";

/* =========================================================================
   BEK FA FOOTBALL ACADEMY
   "Everyone Deserves A Second Chance"
   Black / Gold / White — Ghanaian football identity, FIFA-card energy.
   ========================================================================= */

const GOLD = "#D4AF37";
const GOLD_BRIGHT = "#F4C430";
const BLACK = "#0B0B0C";
const CHARCOAL = "#161616";

const ADMIN_PASSWORD = "bekfa2024";

const SQUADS = ["Elite Team", "U13", "U11"];
const NAV_TARGETS = ["Home", "About", "POTM", "Squads", "Coaches", "News", "Fixtures", "Standings", "Testimonials", "Register", "Contact"];

/* ---------- storage helpers ---------- */
async function loadList(key, fallback) {
  try {
    const r = await window.storage.get(key, true);
    return r ? JSON.parse(r.value) : fallback;
  } catch {
    return fallback;
  }
}
async function saveList(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value), true);
  } catch (e) {
    console.error("storage save failed", e);
  }
}

/* ---------- seed/placeholder data ---------- */
const seedPlayers = [
  { id: "p1", name: "Kwame Asante", squad: "Elite Team", position: "Forward", number: 9, goals: 18, assists: 7, games: 22, cleanSheets: 0, photo: "" },
  { id: "p2", name: "Yaw Boateng", squad: "Elite Team", position: "Midfielder", number: 8, goals: 6, assists: 11, games: 24, cleanSheets: 0, photo: "" },
  { id: "p3", name: "Kofi Mensah", squad: "Elite Team", position: "Defender", number: 4, goals: 1, assists: 2, games: 21, cleanSheets: 9, photo: "" },
  { id: "p4", name: "Abena Owusu", squad: "Elite Team", position: "Goalkeeper", number: 1, goals: 0, assists: 0, games: 20, cleanSheets: 11, photo: "" },
  { id: "p5", name: "Daniel Appiah", squad: "U13", position: "Forward", number: 11, goals: 14, assists: 5, games: 15, cleanSheets: 0, photo: "" },
  { id: "p6", name: "Esi Darko", squad: "U13", position: "Defender", number: 5, goals: 0, assists: 1, games: 14, cleanSheets: 6, photo: "" },
  { id: "p7", name: "Nana Yeboah", squad: "U11", position: "Midfielder", number: 7, goals: 9, assists: 6, games: 12, cleanSheets: 0, photo: "" },
  { id: "p8", name: "Akosua Frimpong", squad: "U11", position: "Goalkeeper", number: 1, goals: 0, assists: 0, games: 12, cleanSheets: 7, photo: "" },
];

const seedCoaches = [
  { id: "c1", name: "Coach Emmanuel Tetteh", role: "Head Coach, Elite Team", bio: "Former Ghana Premier League defender turned mentor, 15 years on the touchline.", photo: "" },
  { id: "c2", name: "Coach Grace Adjei", role: "U13 Coach", bio: "UEFA B-licensed, specialises in youth technical development.", photo: "" },
  { id: "c3", name: "Coach Isaac Owusu", role: "U11 Coach", bio: "Believes the basics, done with joy, build champions.", photo: "" },
];

const seedNews = [
  { id: "n1", title: "Bek Fa Elite Team wins regional cup", date: "2026-05-12", body: "A thrilling 3-1 win sealed the regional title for our senior side.", image: "" },
  { id: "n2", title: "New training pitch unveiled", date: "2026-04-02", body: "Thanks to our sponsors, all three squads now train on a full-size pitch.", image: "" },
];

const seedFixtures = [
  { id: "f1", home: "Bek Fa Elite", away: "Accra Strikers FC", date: "2026-07-04", time: "16:00", venue: "Bek Fa Training Ground", status: "upcoming" },
  { id: "f2", home: "Bek Fa U13", away: "Tema Youth Academy", date: "2026-07-06", time: "10:00", venue: "Community Park", status: "upcoming" },
];

const seedResults = [
  { id: "r1", home: "Bek Fa Elite", away: "Kumasi Rising Stars", scoreHome: 2, scoreAway: 1, date: "2026-06-08", report: "A late winner from Kwame Asante sealed a hard-fought 2-1 victory." },
];

const seedStandings = [
  { id: "s1", squad: "Elite Team", team: "Bek Fa Elite", played: 14, won: 10, drawn: 2, lost: 2, points: 32 },
  { id: "s2", squad: "Elite Team", team: "Accra Strikers FC", played: 14, won: 8, drawn: 3, lost: 3, points: 27 },
  { id: "s3", squad: "Elite Team", team: "Kumasi Rising Stars", played: 14, won: 7, drawn: 2, lost: 5, points: 23 },
];

const seedPOTM = {
  "Elite Team": { playerId: "p1", month: "June 2026", quote: "Hard work beats talent when talent doesn't work hard." },
  "U13": { playerId: "p5", month: "June 2026", quote: "Every session is a chance to get better." },
  "U11": { playerId: "p7", month: "June 2026", quote: "Play with joy, run with heart." },
};

const seedSlides = [
  {
    id: "sl1",
    image: "",
    title: "BEK FA FOOTBALL ACADEMY",
    subtitle: "Everyone deserves a second chance.",
    ctaText: "Register Your Child",
    ctaTarget: "Register",
    enabled: true,
  },
  {
    id: "sl2",
    image: "",
    title: "GHANA'S HOME OF FUTURE STARS",
    subtitle: "Elite coaching, real opportunity, from grassroots to the world stage.",
    ctaText: "Meet The Squads",
    ctaTarget: "Squads",
    enabled: true,
  },
  {
    id: "sl3",
    image: "",
    title: "TRAIN. COMPETE. RISE.",
    subtitle: "Three squad levels, one shared dream of greatness.",
    ctaText: "View Fixtures",
    ctaTarget: "Fixtures",
    enabled: true,
  },
];

const seedCarouselSettings = {
  autoplay: true,
  transitionSpeed: 5000,
  overlayOpacity: 0.55,
  textPosition: "left",
  transitionType: "fade",
};

const seedSponsors = [
  { id: "sp1", name: "Accra Steel Works", logo: "" },
  { id: "sp2", name: "Golden Star Bank", logo: "" },
  { id: "sp3", name: "Tema Logistics", logo: "" },
  { id: "sp4", name: "Volta Beverages", logo: "" },
  { id: "sp5", name: "Kente Sportswear", logo: "" },
  { id: "sp6", name: "Pan-African Airways", logo: "" },
];

const seedTestimonials = [
  { id: "t1", name: "Mrs. Abigail Ofori", role: "Parent", text: "Bek Fa gave my son discipline, friends, and a love for the game he never had before.", photo: "" },
  { id: "t2", name: "Daniel Appiah", role: "U13 Player", text: "The coaches believed in me before I believed in myself.", photo: "" },
];

const GRAD_AGE_GROUPS = ["U11", "U13", "U15/U17", "Elite Squad"];

const seedGraduates = [
  {
    id: "g2",
    name: "Efua Mensah",
    photo: "",
    position: "Winger",
    ageGroup: "U15/U17",
    yearGraduated: 2022,
    club: "Hasaacas Ladies FC",
    clubLogo: "",
    country: "Ghana",
    countryFlag: "🇬🇭",
    bio: "A product of our youth pathway, Efua signed semi-professionally a year after graduating and has since been capped at youth international level.",
    apps: 38,
    goals: 12,
    assists: 14,
    recent: true,
    social: { instagram: "", twitter: "", tiktok: "" },
    featured: true,
    order: 0,
  },
  {
    id: "g3",
    name: "Yaw Owusu",
    photo: "",
    position: "Centre-Back",
    ageGroup: "Elite Squad",
    yearGraduated: 2019,
    club: "Örebro SK",
    clubLogo: "",
    country: "Sweden",
    countryFlag: "🇸🇪",
    bio: "Moved abroad after impressing on trial in Sweden. Now a dependable starter known for his reading of the game.",
    apps: 91,
    goals: 4,
    assists: 2,
    recent: false,
    social: { instagram: "", twitter: "", tiktok: "" },
    featured: false,
    order: 1,
  },
];

const seedPageVisibility = {
  pageEnabled: true,
  heroEnabled: true,
  statsEnabled: true,
  featuredEnabled: true,
  timelineEnabled: true,
  cardsEnabled: true,
};

/* ---------- small utility components ---------- */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function AnimatedCounter({ value, duration = 1600, suffix = "" }) {
  const [display, setDisplay] = useState(0);
  const [ref, visible] = useReveal();
  const started = useRef(false);
  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;
    const target = Number(value) || 0;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, value, duration]);
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        color: GOLD,
        fontFamily: "'Oswald', sans-serif",
        letterSpacing: "3px",
        fontSize: 13,
        fontWeight: 600,
        textTransform: "uppercase",
        marginBottom: 10,
      }}
    >
      <span style={{ width: 22, height: 2, background: GOLD, display: "inline-block" }} />
      {children}
    </div>
  );
}

function PhotoUpload({ value, onChange, label }) {
  const inputRef = useRef(null);
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 10,
          background: value ? `url(${value}) center/cover` : "#222",
          border: `1px solid ${GOLD}55`,
          flexShrink: 0,
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={btnGhost}
      >
        {label || "Upload Photo"}
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
    </div>
  );
}

function MultiPhotoUpload({ onFiles, label }) {
  const inputRef = useRef(null);
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => onFiles(reader.result, file.name);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };
  return (
    <>
      <button type="button" onClick={() => inputRef.current?.click()} style={btnGold}>
        {label || "Upload Images"}
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: "none" }} />
    </>
  );
}

/* ============================ HOMEPAGE CAROUSEL PREVIEW MODAL ============================ */
function CarouselPreviewModal({ slides, settings, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 22px", borderBottom: `1px solid ${GOLD}33` }}>
        <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontSize: 14 }}>
          Carousel Preview — Live as it will appear on the homepage
        </div>
        <button onClick={onClose} style={btnGhost}>✕ Close Preview</button>
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <Hero onNav={() => {}} slides={slides} settings={settings} />
      </div>
    </div>
  );
}

/* ============================ MANAGE CAROUSEL (ADMIN) ============================ */
function ManageCarousel({ slides, setSlides, settings, setSettings }) {
  const empty = { image: "", title: "", subtitle: "", ctaText: "", ctaTarget: "Register", enabled: true };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [dragId, setDragId] = useState(null);

  const startAdd = () => { setEditingId(null); setForm(empty); };

  const addImages = (dataUrl, fileName) => {
    const niceName = (fileName || "New Slide").replace(/\.[a-z0-9]+$/i, "");
    const newSlide = {
      id: "sl_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      image: dataUrl,
      title: niceName.toUpperCase(),
      subtitle: "",
      ctaText: "Register Your Child",
      ctaTarget: "Register",
      enabled: true,
    };
    setSlides([...slides, newSlide]);
  };

  const remove = (id) => {
    setSlides(slides.filter((s) => s.id !== id));
    if (editingId === id) startAdd();
  };

  const toggleEnabled = (id) => {
    setSlides(slides.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const edit = (slide) => {
    setEditingId(slide.id);
    setForm({ ...slide });
  };

  const saveEdit = () => {
    if (!form.title) return;
    setSlides(slides.map((s) => (s.id === editingId ? { ...form, id: editingId } : s)));
    setEditingId(null);
    setForm(empty);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(empty);
  };

  /* drag-and-drop reorder */
  const onDragStart = (id) => setDragId(id);
  const onDragOver = (e, overId) => {
    e.preventDefault();
    if (dragId === null || dragId === overId) return;
    const fromIdx = slides.findIndex((s) => s.id === dragId);
    const toIdx = slides.findIndex((s) => s.id === overId);
    if (fromIdx === -1 || toIdx === -1) return;
    const next = [...slides];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setSlides(next);
  };
  const onDragEnd = () => setDragId(null);

  const updateSetting = (key, val) => setSettings({ ...settings, [key]: val });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <H>Homepage Carousel Manager</H>
        <button onClick={() => setShowPreview(true)} style={btnGold}>👁 Preview Carousel</button>
      </div>

      {showPreview && (
        <CarouselPreviewModal slides={slides} settings={settings} onClose={() => setShowPreview(false)} />
      )}

      {/* Upload new slides */}
      <AdminCard>
        <div style={{ color: "#fff", fontFamily: "'Oswald',sans-serif", fontWeight: 600, marginBottom: 10, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Add New Slides
        </div>
        <p style={{ color: "#999", fontSize: 13, marginTop: 0, marginBottom: 14 }}>
          Select one or multiple images at once — each becomes its own slide. Unlimited slides supported. After uploading, edit the title, subtitle and call-to-action below.
        </p>
        <MultiPhotoUpload onFiles={addImages} label="Upload Slider Image(s)" />
      </AdminCard>

      {/* Carousel-wide settings */}
      <AdminCard>
        <div style={{ color: "#fff", fontFamily: "'Oswald',sans-serif", fontWeight: 600, marginBottom: 14, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Carousel Settings
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
          <div>
            <label style={{ display: "block", color: "#999", fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Autoplay</label>
            <button
              onClick={() => updateSetting("autoplay", !settings.autoplay)}
              style={{ ...(settings.autoplay ? btnGold : btnGhost), width: "100%" }}
            >
              {settings.autoplay ? "On — Rotating Automatically" : "Off — Manual Navigation Only"}
            </button>
          </div>

          <div>
            <label style={{ display: "block", color: "#999", fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Transition Speed: {(settings.transitionSpeed / 1000).toFixed(1)}s
            </label>
            <input
              type="range"
              min={2000}
              max={8000}
              step={500}
              value={settings.transitionSpeed}
              onChange={(e) => updateSetting("transitionSpeed", +e.target.value)}
              style={{ width: "100%", accentColor: GOLD }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#999", fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Overlay Opacity: {Math.round(settings.overlayOpacity * 100)}%
            </label>
            <input
              type="range"
              min={0}
              max={0.9}
              step={0.05}
              value={settings.overlayOpacity}
              onChange={(e) => updateSetting("overlayOpacity", +e.target.value)}
              style={{ width: "100%", accentColor: GOLD }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#999", fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Text Position</label>
            <select style={inputStyle} value={settings.textPosition} onChange={(e) => updateSetting("textPosition", e.target.value)}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", color: "#999", fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Transition Type</label>
            <select style={inputStyle} value={settings.transitionType} onChange={(e) => updateSetting("transitionType", e.target.value)}>
              <option value="fade">Smooth Fade</option>
              <option value="slide">Slide</option>
            </select>
          </div>
        </div>
      </AdminCard>

      {/* Edit form (shown when editing a slide) */}
      {editingId && (
        <AdminCard>
          <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", fontWeight: 600, marginBottom: 14, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Editing Slide
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div
              style={{
                width: 140,
                height: 90,
                borderRadius: 8,
                flexShrink: 0,
                background: form.image ? `url(${form.image}) center/cover` : "#222",
                border: `1px solid ${GOLD}55`,
              }}
            />
            <div style={{ flex: 1, minWidth: 220 }}>
              <input
                style={{ ...inputStyle, marginBottom: 10 }}
                placeholder="Main Heading"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input
                style={{ ...inputStyle, marginBottom: 10 }}
                placeholder="Subheading"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input
                  style={inputStyle}
                  placeholder="Button Text (e.g. Register Now)"
                  value={form.ctaText}
                  onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                />
                <select style={inputStyle} value={form.ctaTarget} onChange={(e) => setForm({ ...form, ctaTarget: e.target.value })}>
                  {NAV_TARGETS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <PhotoUpload value={form.image} onChange={(v) => setForm({ ...form, image: v })} label="Replace Image" />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={saveEdit} style={btnGold}>Save Changes</button>
            <button onClick={cancelEdit} style={btnGhost}>Cancel</button>
          </div>
        </AdminCard>
      )}

      {/* Slide list — drag to reorder */}
      <div style={{ color: "#999", fontSize: 12, margin: "20px 0 10px", textTransform: "uppercase", letterSpacing: "1px" }}>
        {slides.length} Slide{slides.length !== 1 ? "s" : ""} — Drag To Reorder
      </div>
      {slides.length === 0 && (
        <AdminCard>
          <p style={{ color: "#777", margin: 0 }}>No slides yet. Upload images above to build your homepage carousel.</p>
        </AdminCard>
      )}
      {slides.map((s, i) => (
        <div
          key={s.id}
          draggable
          onDragStart={() => onDragStart(s.id)}
          onDragOver={(e) => onDragOver(e, s.id)}
          onDragEnd={onDragEnd}
          style={{
            ...cardBase,
            padding: 16,
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: dragId === s.id ? 0.4 : s.enabled === false ? 0.55 : 1,
            cursor: "grab",
            borderColor: dragId === s.id ? GOLD : "rgba(212,175,55,0.18)",
          }}
        >
          <div style={{ color: "#666", fontSize: 18, cursor: "grab", userSelect: "none", flexShrink: 0 }} title="Drag to reorder">⠿</div>
          <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", fontSize: 12, width: 22, flexShrink: 0 }}>{i + 1}</div>
          <div
            style={{
              width: 90,
              height: 58,
              borderRadius: 6,
              flexShrink: 0,
              background: s.image ? `url(${s.image}) center/cover` : "#222",
              border: `1px solid ${GOLD}33`,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title || "Untitled Slide"}</div>
            <div style={{ color: "#999", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.subtitle || "No subheading"}</div>
            <div style={{ color: "#666", fontSize: 11, marginTop: 2 }}>CTA: {s.ctaText || "—"} → {s.ctaTarget || "—"}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button onClick={() => toggleEnabled(s.id)} style={{ ...(s.enabled !== false ? btnGold : btnGhost), padding: "8px 14px", fontSize: 11 }}>
              {s.enabled !== false ? "Enabled" : "Disabled"}
            </button>
            <button onClick={() => edit(s)} style={{ ...btnGhost, padding: "8px 14px", fontSize: 11 }}>Edit</button>
            <button onClick={() => remove(s.id)} style={{ ...btnGhost, padding: "8px 14px", fontSize: 11, color: "#ff6b6b", borderColor: "#ff6b6b88" }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
const btnGold = {
  background: `linear-gradient(135deg, ${GOLD_BRIGHT}, ${GOLD})`,
  color: BLACK,
  border: "none",
  padding: "12px 26px",
  borderRadius: 6,
  fontFamily: "'Oswald', sans-serif",
  fontWeight: 700,
  letterSpacing: "1px",
  textTransform: "uppercase",
  fontSize: 13,
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(212,175,55,0.35)",
  transition: "transform 0.2s, box-shadow 0.2s",
};
const btnGhost = {
  background: "transparent",
  color: GOLD,
  border: `1px solid ${GOLD}88`,
  padding: "10px 18px",
  borderRadius: 6,
  fontFamily: "'Oswald', sans-serif",
  fontWeight: 600,
  letterSpacing: "0.5px",
  fontSize: 12,
  cursor: "pointer",
};
const inputStyle = {
  width: "100%",
  background: "#1a1a1a",
  border: "1px solid #333",
  borderRadius: 6,
  padding: "10px 12px",
  color: "#fff",
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  outline: "none",
};
const cardBase = {
  background: "linear-gradient(160deg, #161616 0%, #0e0e0f 100%)",
  border: "1px solid rgba(212,175,55,0.18)",
  borderRadius: 14,
  position: "relative",
  overflow: "hidden",
};

/* ============================ SPLASH SCREEN ============================ */
function SplashScreen({ onDone, ballImage }) {
  const [fadeOut, setFadeOut] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 2300);
    const t2 = setTimeout(onDone, 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: `radial-gradient(circle at 50% 40%, #1a1505 0%, ${BLACK} 70%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.7s ease",
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes spin3d {
          0% { transform: rotateY(0deg) rotateX(8deg); }
          100% { transform: rotateY(360deg) rotateX(8deg); }
        }
        @keyframes ballGlow {
          0%,100% { box-shadow: 0 0 40px 10px rgba(212,175,55,0.35), inset -10px -10px 30px rgba(0,0,0,0.6); }
          50% { box-shadow: 0 0 70px 20px rgba(212,175,55,0.6), inset -10px -10px 30px rgba(0,0,0,0.6); }
        }
        @keyframes splashFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .splash-ball-wrap { perspective: 600px; }
      `}</style>

      <div className="splash-ball-wrap" style={{ marginBottom: 36 }}>
        {ballImage ? (
          <div
            style={{
              width: "clamp(90px, 22vw, 150px)",
              height: "clamp(90px, 22vw, 150px)",
              borderRadius: "50%",
              backgroundImage: `url(${ballImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              animation: "spin3d 2.2s linear infinite, ballGlow 2s ease-in-out infinite",
            }}
          />
        ) : (
          <div
            style={{
              width: "clamp(90px, 22vw, 150px)",
              height: "clamp(90px, 22vw, 150px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, #fff 0%, #e8e8e8 25%, #b8b8b8 55%, #333 100%)",
              animation: "spin3d 2.2s linear infinite, ballGlow 2s ease-in-out infinite",
              position: "relative",
              backgroundImage:
                "radial-gradient(circle at 35% 30%, #fff 0%, #e8e8e8 25%, #b8b8b8 55%, #333 100%), repeating-linear-gradient(60deg, transparent 0 18px, rgba(0,0,0,0.18) 18px 20px)",
            }}
          >
            <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, opacity: 0.85 }}>
              <polygon points="50,30 62,40 58,55 42,55 38,40" fill="#111" />
              <polygon points="50,10 62,18 58,30 42,30 38,18" fill="#111" opacity="0.85" />
              <polygon points="20,45 32,42 38,55 30,68 16,62" fill="#111" opacity="0.7" />
              <polygon points="80,45 68,42 62,55 70,68 84,62" fill="#111" opacity="0.7" />
            </svg>
          </div>
        )}
      </div>

      <div
        style={{
          fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
          fontSize: "clamp(24px, 5vw, 40px)",
          color: GOLD,
          letterSpacing: "2px",
          marginBottom: 10,
          animation: "splashFadeIn 0.8s ease 0.3s both",
        }}
      >
        BEK FA ACADEMY
      </div>
      <div
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: "clamp(13px, 2.6vw, 18px)",
          color: "#fff",
          letterSpacing: "3px",
          textTransform: "uppercase",
          animation: "splashFadeIn 0.8s ease 0.6s both",
        }}
      >
        Everyone Deserves A Second Chance
      </div>
    </div>
  );
}

/* ============================ FIFA-STYLE CARD ============================ */
function FifaCard({ player, highlight }) {
  const [hover, setHover] = useState(false);
  if (!player) return null;
  const isDefOrGk = player.position === "Defender" || player.position === "Goalkeeper";
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        maxWidth: 260,
        aspectRatio: "3 / 4.2",
        borderRadius: 20,
        position: "relative",
        flexShrink: 0,
        cursor: "default",
        background: `linear-gradient(160deg, #0c1018 0%, #05060a 60%, #000 100%)`,
        border: `1.5px solid ${hover ? GOLD_BRIGHT : GOLD}`,
        boxShadow: hover
          ? `0 22px 45px -10px rgba(0,0,0,0.7), 0 0 0 1px ${GOLD_BRIGHT}, 0 0 36px 6px rgba(212,175,55,0.55), 0 0 70px 14px rgba(212,175,55,0.25)`
          : `0 10px 28px -8px rgba(0,0,0,0.65), 0 0 14px 2px rgba(212,175,55,0.25)`,
        transform: hover ? "translateY(-10px) scale(1.035)" : "translateY(0) scale(1)",
        transition: "transform 0.4s cubic-bezier(.2,.8,.2,1), box-shadow 0.4s ease, border-color 0.4s ease",
        overflow: "hidden",
      }}
    >
      {/* background image layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: player.photo
            ? `url(${player.photo})`
            : `linear-gradient(160deg, #1a1f2b 0%, #0a0c11 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          transform: hover ? "scale(1.12)" : "scale(1)",
          transition: "transform 0.6s cubic-bezier(.2,.8,.2,1)",
        }}
      />
      {/* dark overlay for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0.94) 100%)",
        }}
      />

      {/* number badge */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          color: GOLD_BRIGHT,
          fontFamily: "'Bebas Neue','Oswald',sans-serif",
          fontSize: "clamp(22px, 6vw, 30px)",
          fontWeight: 800,
          textShadow: "0 0 12px rgba(212,175,55,0.7)",
          lineHeight: 1,
        }}
      >
        {player.number}
      </div>

      {highlight && (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: `linear-gradient(135deg, ${GOLD_BRIGHT}, ${GOLD})`,
            color: BLACK,
            fontSize: 10,
            fontWeight: 800,
            padding: "4px 9px",
            borderRadius: 5,
            letterSpacing: "0.5px",
            boxShadow: "0 0 14px rgba(212,175,55,0.6)",
          }}
        >
          ★ POTM
        </div>
      )}

      {/* bottom content */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "16px 16px 18px" }}>
        <div
          style={{
            color: GOLD_BRIGHT,
            fontFamily: "'Oswald',sans-serif",
            fontWeight: 800,
            fontSize: "clamp(15px, 4vw, 19px)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            lineHeight: 1.15,
          }}
        >
          {player.name}
        </div>
        <div
          style={{
            color: "#e8e8e8",
            fontSize: 11,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginTop: 3,
            marginBottom: 12,
            opacity: 0.85,
          }}
        >
          {player.position} · {player.squad}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            borderTop: `1px solid ${GOLD}44`,
            paddingTop: 10,
          }}
        >
          <Stat label="GLS" value={player.goals} />
          <Stat label="AST" value={player.assists} />
          <Stat label="GMS" value={player.games} />
          {isDefOrGk && <Stat label="CS" value={player.cleanSheets} />}
        </div>
      </div>
    </div>
  );
}
function Stat({ label, value }) {
  return (
    <div>
      <div style={{ color: "#fff", fontWeight: 800, fontSize: 17, fontFamily: "'Oswald',sans-serif" }}>{value}</div>
      <div style={{ color: "#999", fontSize: 10, letterSpacing: "1px" }}>{label}</div>
    </div>
  );
}

/* ============================ PUBLIC SITE ============================ */

function NavLink({ id, label, active, onClick, mobile, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`nav-link ${mobile ? "nav-link-mobile" : ""} ${active ? "active" : ""} ${className}`}
    >
      <span className="nav-link-text">{label}</span>
      <span className="nav-underline" />
    </button>
  );
}

function Header({ onNav, onAdminClick }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const navLinks = [
    { id: "Home", label: "Home" },
    { id: "About", label: "About" },
    { id: "POTM", label: "POTM" },
    { id: "Squads", label: "Squads" },
    { id: "Coaches", label: "Coaches" },
    { id: "Graduates", label: "Success Stories" },
    { id: "News", label: "News" },
    { id: "Fixtures", label: "Fixtures" },
    { id: "Standings", label: "Standings" },
    { id: "Testimonials", label: "Testimonials" },
    { id: "Register", label: "Register" },
    { id: "Contact", label: "Contact" },
  ];

  /* scroll-spy: highlight the nav item for whichever section is centered in the viewport */
  useEffect(() => {
    const ids = navLinks.map((l) => l.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (id) => { onNav(id); setActive(id); };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(11,11,12,0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${GOLD}33`,
      }}
    >
      <style>{`
        .nav-link {
          position: relative;
          background: none;
          border: none;
          color: #fff;
          font-family: 'Oswald', sans-serif;
          font-size: 13px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          padding: 8px 2px 12px;
          display: inline-block;
          transform-origin: center;
          transition: color 0.4s ease, transform 0.35s cubic-bezier(.4,0,.2,1);
        }
        .nav-link-text { position: relative; display: inline-block; }
        .nav-link:hover, .nav-link.active {
          color: ${GOLD_BRIGHT};
          transform: scale(1.05);
          text-shadow: 0 0 12px rgba(212,175,55,0.45);
        }
        .nav-underline {
          position: absolute;
          left: 50%;
          bottom: 2px;
          width: 0%;
          height: 2px;
          transform: translateX(-50%);
          background: linear-gradient(90deg, transparent, ${GOLD_BRIGHT}, ${GOLD}, ${GOLD_BRIGHT}, transparent);
          border-radius: 2px;
          overflow: hidden;
          transition: width 0.45s cubic-bezier(.4,0,.2,1), box-shadow 0.45s ease;
        }
        .nav-link:hover .nav-underline,
        .nav-link.active .nav-underline {
          width: 100%;
          box-shadow: 0 0 10px 2px rgba(212,175,55,0.65), 0 0 22px 6px rgba(212,175,55,0.25);
        }
        .nav-underline::after {
          content: "";
          position: absolute;
          top: 0;
          left: -60%;
          width: 45%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent);
          transform: skewX(-25deg);
          opacity: 0;
        }
        .nav-link:hover .nav-underline::after {
          animation: navShimmer 1.1s ease-in-out;
        }
        @keyframes navShimmer {
          0% { left: -60%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { left: 130%; opacity: 0; }
        }
        .nav-link-mobile {
          display: block;
          width: 100%;
          text-align: left;
          padding: 10px 0 12px;
          font-size: 14px;
        }
        .nav-link-mobile .nav-underline { left: 0; bottom: 0; transform: none; }
        .nav-link-mobile:hover .nav-underline,
        .nav-link-mobile.active .nav-underline { width: 46px; }
        @media (max-width: 880px) {
          .nav-links-desktop, .cta-desktop { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 881px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: GOLD, fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: 22, letterSpacing: "1px", cursor: "pointer" }} onClick={() => go("Home")}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚽</div>
          BEK FA
        </div>
        <div style={{ display: "flex", gap: 22, alignItems: "center" }} className="nav-links-desktop">
          {navLinks.slice(0, 10).map((l) => (
            <NavLink key={l.id} id={l.id} label={l.label} active={active === l.id} onClick={() => go(l.id)} />
          ))}
        </div>
        <button style={btnGold} onClick={() => go("Register")} className="cta-desktop">Join Bek Fa</button>
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: GOLD, fontSize: 24 }} className="mobile-toggle">☰</button>
      </div>
      {open && (
        <div style={{ background: BLACK, padding: 16, display: "flex", flexDirection: "column", gap: 2 }}>
          {navLinks.map((l) => (
            <NavLink
              key={l.id}
              id={l.id}
              label={l.label}
              active={active === l.id}
              mobile
              onClick={() => { go(l.id); setOpen(false); }}
            />
          ))}
        </div>
      )}
    </header>
  );
}

function Hero({ onNav, slides = [], settings = seedCarouselSettings }) {
  const activeSlides = (slides || []).filter((s) => s.enabled !== false);
  const hasSlides = activeSlides.length > 0;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const speed = Math.max(1500, settings?.transitionSpeed || 5000);
  const transitionType = settings?.transitionType === "slide" ? "slide" : "fade";
  const autoplay = settings?.autoplay !== false;
  const overlayOpacity = settings?.overlayOpacity ?? 0.55;
  const textPosition = settings?.textPosition || "left";

  useEffect(() => {
    if (index >= activeSlides.length) setIndex(0);
  }, [activeSlides.length, index]);

  useEffect(() => {
    if (!hasSlides || !autoplay || paused || activeSlides.length < 2) return;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % activeSlides.length);
    }, speed);
    return () => clearTimeout(timerRef.current);
  }, [index, hasSlides, autoplay, paused, speed, activeSlides.length]);

  const goTo = (i) => setIndex(((i % activeSlides.length) + activeSlides.length) % activeSlides.length);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  // touch swipe support
  const touchStartX = useRef(0);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) (dx > 0 ? prev() : next());
  };

  const justify = textPosition === "center" ? "center" : textPosition === "right" ? "flex-end" : "flex-start";
  const textAlign = textPosition === "center" ? "center" : textPosition === "right" ? "right" : "left";

  if (!hasSlides) {
    // Fallback: original static hero (no images uploaded yet)
    return (
      <section
        id="Home"
        className="hero-fullscreen"
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          background: `linear-gradient(160deg, ${BLACK} 0%, #14110a 60%, ${BLACK} 100%)`,
        }}
      >
        <style>{`
          @keyframes floatBall { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-22px) rotate(15deg);} }
          @keyframes heroPan { 0%{background-position:0% 50%;} 100%{background-position:100% 50%;} }
          @keyframes shimmerLine { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }
          @media (min-width: 881px) { .hero-fullscreen { min-height: 100vh !important; } }
        `}</style>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(212,175,55,0.05) 0 2px, transparent 2px 60px)",
            animation: "heroPan 18s linear infinite alternate",
          }}
        />
        <div style={{ position: "absolute", top: "15%", right: "8%", fontSize: 130, opacity: 0.18, animation: "floatBall 6s ease-in-out infinite" }}>⚽</div>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2, width: "100%" }}>
          <Reveal>
            <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", letterSpacing: "4px", fontSize: 13, marginBottom: 14, textTransform: "uppercase" }}>
              Ghana's Home Of Future Stars
            </div>
          </Reveal>
          <Reveal delay={150}>
            <h1 style={{ fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: "clamp(42px, 8vw, 92px)", color: "#fff", lineHeight: 1.02, margin: 0 }}>
              BEK FA <span style={{ color: GOLD }}>FOOTBALL</span> ACADEMY
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p style={{ color: "#ccc", fontSize: "clamp(16px,2.6vw,20px)", fontFamily: "'Inter',sans-serif", maxWidth: 560, margin: "20px 0 30px", position: "relative" }}>
              "Everyone deserves a second chance." We turn raw talent from the streets of Ghana into disciplined, world-class footballers.
            </p>
          </Reveal>
          <Reveal delay={450}>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button style={btnGold} onClick={() => onNav("Register")}>Register Your Child</button>
              <button style={btnGhost} onClick={() => onNav("Squads")}>Meet The Squads</button>
            </div>
          </Reveal>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "40%", height: "100%", background: `linear-gradient(90deg, transparent, #fff, transparent)`, animation: "shimmerLine 3s linear infinite" }} />
        </div>
      </section>
    );
  }

  return (
    <section
      id="Home"
      className="hero-fullscreen"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: "relative",
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: BLACK,
      }}
    >
      <style>{`
        @keyframes shimmerLine { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }
        @keyframes heroCarouselFadeIn { from{opacity:0; transform:translateY(18px);} to{opacity:1; transform:translateY(0);} }
        @media (min-width: 881px) { .hero-fullscreen { min-height: 100vh !important; } }
        .hc-slide { position:absolute; inset:0; }
        .hc-slide-img {
          position:absolute; inset:0; background-size:cover; background-position:center;
          transform: scale(1.06);
          transition: transform 7s ease-out;
        }
        .hc-slide.hc-active .hc-slide-img { transform: scale(1); }
        .hc-fade { transition: opacity 0.9s ease; }
        .hc-fade.hc-hidden { opacity:0; pointer-events:none; }
        .hc-fade.hc-active { opacity:1; }
        .hc-slidein { transition: transform 0.7s cubic-bezier(.4,0,.2,1), opacity 0.7s ease; }
        .hc-dots { position:absolute; bottom:26px; left:0; right:0; display:flex; justify-content:center; gap:10px; z-index:5; }
        .hc-dot { width:10px; height:10px; border-radius:50%; background:rgba(255,255,255,0.35); border:1px solid rgba(212,175,55,0.5); cursor:pointer; transition: background 0.3s ease, transform 0.3s ease, width 0.3s ease; }
        .hc-dot.hc-dot-active { background:${GOLD}; width:26px; border-radius:6px; }
      `}</style>

      {activeSlides.map((s, i) => {
        const isActive = i === index;
        const slideStyle =
          transitionType === "slide"
            ? {
                transform: `translateX(${(i - index) * 100}%)`,
                opacity: 1,
              }
            : {};
        return (
          <div
            key={s.id}
            className={`hc-slide ${isActive ? "hc-active" : ""} ${transitionType === "fade" ? `hc-fade ${isActive ? "hc-active" : "hc-hidden"}` : "hc-slidein"}`}
            style={slideStyle}
            aria-hidden={!isActive}
          >
            <div
              className="hc-slide-img"
              style={{
                backgroundImage: s.image
                  ? `url(${s.image})`
                  : `linear-gradient(160deg, ${BLACK} 0%, #14110a 60%, ${BLACK} 100%)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(${textPosition === "right" ? "270deg" : "90deg"}, rgba(0,0,0,${Math.min(0.95, overlayOpacity + 0.25)}) 0%, rgba(0,0,0,${overlayOpacity}) 45%, rgba(0,0,0,${overlayOpacity * 0.6}) 100%)`,
              }}
            />
          </div>
        );
      })}

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 2,
          width: "100%",
          display: "flex",
          justifyContent: justify,
        }}
      >
        {(() => {
          const s = activeSlides[index];
          if (!s) return null;
          return (
            <div key={s.id} style={{ maxWidth: 620, textAlign, animation: "heroCarouselFadeIn 0.8s ease both" }}>
              <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", letterSpacing: "4px", fontSize: 13, marginBottom: 14, textTransform: "uppercase" }}>
                Ghana's Home Of Future Stars
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: "clamp(36px, 7vw, 78px)", color: "#fff", lineHeight: 1.04, margin: 0, textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>
                {s.title}
              </h1>
              {s.subtitle && (
                <p style={{ color: "#e6e6e6", fontSize: "clamp(15px,2.2vw,19px)", fontFamily: "'Inter',sans-serif", maxWidth: 560, margin: "18px 0 28px", marginLeft: textPosition === "center" ? "auto" : textPosition === "right" ? "auto" : 0, marginRight: textPosition === "center" ? "auto" : 0 }}>
                  {s.subtitle}
                </p>
              )}
              {s.ctaText && (
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: justify }}>
                  <button style={btnGold} onClick={() => onNav(s.ctaTarget || "Register")}>{s.ctaText}</button>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {activeSlides.length > 1 && (
        <div className="hc-dots">
          {activeSlides.map((s, i) => (
            <div
              key={s.id}
              className={`hc-dot ${i === index ? "hc-dot-active" : ""}`}
              onClick={() => goTo(i)}
              role="button"
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, overflow: "hidden", zIndex: 4 }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "40%", height: "100%", background: `linear-gradient(90deg, transparent, #fff, transparent)`, animation: "shimmerLine 3s linear infinite" }} />
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="About" style={{ padding: "90px 24px", background: BLACK }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <SectionLabel>Who We Are</SectionLabel>
          <h2 style={{ color: "#fff", fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: "clamp(28px,4vw,44px)", marginTop: 0, marginBottom: 24 }}>
            Built on Ghana's Streets, Aimed at the World's Stages
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p style={{ color: "#bbb", fontFamily: "'Inter',sans-serif", fontSize: 16, lineHeight: 1.8, maxWidth: 720 }}>
            Bek Fa Academy was founded on one belief: talent is everywhere, opportunity isn't. We give young Ghanaians the structure, coaching, and second chance they need to chase the dream — from grassroots pitches to professional academies abroad. Discipline, technique, and community sit at the heart of everything we do.
          </p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 20, marginTop: 40 }}>
          {[["120+", "Players Trained"], ["3", "Squad Levels"], ["8", "Trophies Won"], ["2018", "Founded"]].map(([num, label], i) => (
            <Reveal delay={i * 100} key={label}>
              <div style={{ ...cardBase, padding: 24, textAlign: "center" }}>
                <div style={{ color: GOLD, fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: 36 }}>{num}</div>
                <div style={{ color: "#999", fontSize: 13, marginTop: 6, textTransform: "uppercase", letterSpacing: "1px" }}>{label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function POTMSection({ potm, players }) {
  return (
    <section id="POTM" style={{ padding: "90px 24px", background: `linear-gradient(180deg, ${BLACK}, #120f08)` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <Reveal>
          <SectionLabel>Hall Of Fame</SectionLabel>
          <h2 style={{ color: "#fff", fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: "clamp(28px,4vw,44px)", marginTop: 0, marginBottom: 30 }}>
            Player Of The Month
          </h2>
        </Reveal>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
          {SQUADS.map((squad, i) => {
            const entry = potm[squad];
            const player = players.find((p) => p.id === entry?.playerId);
            return (
              <Reveal delay={i * 120} key={squad}>
                <div style={{ textAlign: "center", width: 230 }}>
                  <FifaCard player={player} highlight />
                  <div style={{ color: GOLD, fontSize: 12, marginTop: 10, textTransform: "uppercase", letterSpacing: "1px" }}>{squad} · {entry?.month}</div>
                  {entry?.quote && <div style={{ color: "#999", fontSize: 12, fontStyle: "italic", maxWidth: 220, margin: "6px auto 0" }}>"{entry.quote}"</div>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Squads({ players }) {
  const [active, setActive] = useState("Elite Team");
  return (
    <section id="Squads" style={{ padding: "90px 24px", background: BLACK }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <Reveal>
          <SectionLabel>Our Teams</SectionLabel>
          <h2 style={{ color: "#fff", fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: "clamp(28px,4vw,44px)", marginTop: 0, marginBottom: 24 }}>
            Team Squads
          </h2>
        </Reveal>
        <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
          {SQUADS.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              style={active === s ? btnGold : btnGhost}
            >
              {s}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {players.filter((p) => p.squad === active).map((p, i) => (
            <Reveal delay={i * 80} key={p.id}>
              <div style={{ width: 230 }}>
                <FifaCard player={p} />
              </div>
            </Reveal>
          ))}
          {players.filter((p) => p.squad === active).length === 0 && (
            <p style={{ color: "#777" }}>No players added for this squad yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Coaches({ coaches }) {
  return (
    <section id="Coaches" style={{ padding: "90px 24px", background: `linear-gradient(180deg, ${BLACK}, #120f08)` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <Reveal>
          <SectionLabel>Mentors</SectionLabel>
          <h2 style={{ color: "#fff", fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: "clamp(28px,4vw,44px)", marginTop: 0, marginBottom: 30 }}>
            Coaching Staff
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
          {coaches.map((c, i) => (
            <Reveal delay={i * 100} key={c.id}>
              <div style={{ ...cardBase, padding: 22, textAlign: "center" }} className="hover-lift">
                <div style={{ width: 96, height: 96, borderRadius: "50%", margin: "0 auto 14px", background: c.photo ? `url(${c.photo}) center/cover` : "#222", border: `2px solid ${GOLD}` }} />
                <div style={{ color: "#fff", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 16 }}>{c.name}</div>
                <div style={{ color: GOLD, fontSize: 12, margin: "4px 0 10px", textTransform: "uppercase", letterSpacing: "1px" }}>{c.role}</div>
                <div style={{ color: "#999", fontSize: 13, lineHeight: 1.6 }}>{c.bio}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`.hover-lift{transition:transform .3s, box-shadow .3s;} .hover-lift:hover{transform:translateY(-8px); box-shadow:0 20px 40px -10px rgba(212,175,55,0.25);}`}</style>
    </section>
  );
}

/* ============================ ACADEMY GRADUATES PAGE ============================ */

function GraduatesHero() {
  return (
    <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 50px" }}>
      <Reveal>
        <SectionLabel>
          <span style={{ margin: "0 auto" }}>Where They Are Now</span>
        </SectionLabel>
      </Reveal>
      <Reveal delay={120}>
        <h2
          style={{
            fontFamily: "'Bebas Neue','Oswald',sans-serif",
            fontSize: "clamp(34px, 6vw, 64px)",
            color: "#fff",
            margin: "0 0 14px",
            letterSpacing: "1px",
          }}
        >
          SUCCESS <span style={{ color: GOLD }}>STORIES</span>
        </h2>
      </Reveal>
      <Reveal delay={240}>
        <p style={{ color: "#bbb", fontFamily: "'Inter',sans-serif", fontSize: "clamp(15px,2.2vw,18px)", margin: 0 }}>
          Developing talent and creating opportunities.
        </p>
      </Reveal>
    </div>
  );
}

function GraduateStatsCounter({ graduates }) {
  const totalGraduates = graduates.length;
  const clubs = new Set(graduates.map((g) => g.club).filter(Boolean)).size;
  const countries = new Set(graduates.map((g) => g.country).filter(Boolean)).size;
  const pro = graduates.filter((g) => g.ageGroup === "Elite Squad" || g.recent).length;

  const stats = [
    [totalGraduates, "Total Success Stories"],
    [clubs, "Clubs Represented"],
    [countries, "Countries Represented"],
    [pro, "Professional Contracts Signed"],
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 20, marginBottom: 60 }}>
      {stats.map(([num, label], i) => (
        <Reveal delay={i * 100} key={label}>
          <div style={{ ...cardBase, padding: "28px 20px", textAlign: "center" }}>
            <div style={{ color: GOLD, fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: 42 }}>
              <AnimatedCounter value={num} />
              {label === "Total Success Stories" || label === "Professional Contracts Signed" ? "+" : ""}
            </div>
            <div style={{ color: "#999", fontSize: 12, marginTop: 6, textTransform: "uppercase", letterSpacing: "1px" }}>{label}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function FeaturedGraduate({ graduate }) {
  if (!graduate) return null;
  return (
    <Reveal>
      <div
        style={{
          ...cardBase,
          padding: 0,
          marginBottom: 60,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "minmax(220px, 380px) 1fr",
          cursor: "default",
        }}
        className="grad-featured-grid grad-featured-card"
      >
        <div className="grad-featured-photo-wrap" style={{ minHeight: 280, position: "relative", overflow: "hidden" }}>
          <div
            className="grad-featured-photo"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: graduate.photo
                ? `url(${graduate.photo})`
                : `linear-gradient(160deg, #1a1f2b 0%, #0a0c11 100%)`,
              backgroundSize: "cover",
              backgroundPosition: "center 18%",
            }}
          />
          <div className="grad-featured-overlay" style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.55) 0%, transparent 45%)" }} />
          <div className="grad-featured-badge">
            ⭐ Featured Success Story
          </div>
        </div>
        <div style={{ padding: "32px 32px 32px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", fontSize: 12, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>
            {graduate.position} · {graduate.ageGroup} · Class of {graduate.yearGraduated}
          </div>
          <h3 className="grad-featured-name" style={{ color: "#fff", fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: "clamp(30px,4vw,42px)", margin: "0 0 14px" }}>
            {graduate.name}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              className="grad-featured-club-logo"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: graduate.clubLogo ? `url(${graduate.clubLogo}) center/cover` : "#222",
                border: `1px solid ${GOLD}55`,
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{graduate.club}</span>
            <span style={{ fontSize: 18 }}>{graduate.countryFlag}</span>
            <span style={{ color: "#999", fontSize: 13 }}>{graduate.country}</span>
          </div>
          <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.8, marginBottom: 20, maxWidth: 560 }}>{graduate.bio}</p>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {[
              ["Apps", graduate.apps],
              ["Goals", graduate.goals],
              ["Assists", graduate.assists],
            ].map(([label, val]) =>
              val !== undefined && val !== null && val !== "" ? (
                <div key={label} className="grad-stat">
                  <div style={{ color: GOLD, fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: 26 }}>{val}</div>
                  <div style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px" }}>{label}</div>
                </div>
              ) : null
            )}
          </div>
        </div>
        <div className="grad-featured-accent" />
      </div>
      <style>{`
        @media (max-width: 720px) {
          .grad-featured-grid { grid-template-columns: 1fr !important; }
        }

        .grad-featured-card {
          position: relative;
          border-color: rgba(212,175,55,0.18);
          transition: transform 0.45s cubic-bezier(.4,0,.2,1), box-shadow 0.45s ease, border-color 0.45s ease;
        }
        .grad-featured-card:hover {
          transform: translateY(-8px);
          border-color: ${GOLD};
          box-shadow: 0 24px 48px -12px rgba(212,175,55,0.35), 0 0 0 1px rgba(212,175,55,0.25) inset;
        }

        .grad-featured-photo {
          transition: transform 0.8s cubic-bezier(.25,.8,.25,1), filter 0.6s ease;
          transform: scale(1.0);
        }
        .grad-featured-card:hover .grad-featured-photo {
          transform: scale(1.08);
          filter: brightness(1.08) saturate(1.1);
        }
        .grad-featured-overlay {
          transition: opacity 0.5s ease;
        }
        .grad-featured-card:hover .grad-featured-overlay {
          opacity: 0.75;
        }

        .grad-featured-badge {
          position: absolute;
          top: 18px;
          left: 18px;
          background: linear-gradient(135deg, #F4C430, ${GOLD});
          color: ${BLACK};
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 6px 12px;
          border-radius: 20px;
          box-shadow: 0 0 0 0 rgba(212,175,55,0.6);
          animation: gradBadgePulse 2.6s ease-in-out infinite;
          transition: transform 0.35s ease;
        }
        .grad-featured-card:hover .grad-featured-badge {
          transform: scale(1.08) rotate(-2deg);
        }
        @keyframes gradBadgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.5); }
          50% { box-shadow: 0 0 14px 4px rgba(212,175,55,0.45); }
        }

        .grad-featured-name {
          display: inline-block;
          transition: color 0.4s ease, letter-spacing 0.4s ease, text-shadow 0.4s ease;
        }
        .grad-featured-card:hover .grad-featured-name {
          color: ${GOLD_BRIGHT};
          letter-spacing: 0.5px;
          text-shadow: 0 0 16px rgba(212,175,55,0.35);
        }

        .grad-featured-club-logo {
          transition: transform 0.5s cubic-bezier(.4,0,.2,1), border-color 0.5s ease;
        }
        .grad-featured-card:hover .grad-featured-club-logo {
          transform: scale(1.15) rotate(6deg);
          border-color: ${GOLD};
        }

        .grad-stat {
          transition: transform 0.3s cubic-bezier(.4,0,.2,1);
          cursor: default;
        }
        .grad-stat:hover {
          transform: translateY(-4px) scale(1.08);
        }
        .grad-stat:hover div:first-child {
          text-shadow: 0 0 14px rgba(212,175,55,0.55);
        }

        .grad-featured-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, ${GOLD}, transparent);
          overflow: hidden;
          pointer-events: none;
        }
        .grad-featured-accent::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, transparent, #fff, transparent);
          animation: gradAccentShimmer 3.4s linear infinite;
        }
        @keyframes gradAccentShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </Reveal>
  );
}

function GraduateTimeline({ graduate }) {
  if (!graduate) return null;
  const steps = [
    { label: graduate.ageGroup || "Academy", detail: "Developed in our pathway" },
    { label: `Graduated ${graduate.yearGraduated}`, detail: "Completed academy training" },
    { label: graduate.club || "Current Club", detail: `${graduate.countryFlag || ""} ${graduate.country || ""}`.trim() },
  ];
  return (
    <Reveal>
      <div style={{ ...cardBase, padding: "30px 26px", marginBottom: 24 }}>
        <div style={{ color: "#fff", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 22 }}>
          {graduate.name}'s Journey
        </div>
        <div className="grad-timeline" style={{ display: "flex", alignItems: "flex-start", gap: 0, position: "relative" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, position: "relative", textAlign: "center", minWidth: 110 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: i === steps.length - 1 ? GOLD : "#3a3a3a",
                  border: `2px solid ${GOLD}`,
                  margin: "0 auto 12px",
                  position: "relative",
                  zIndex: 2,
                }}
              />
              {i < steps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    left: "50%",
                    width: "100%",
                    height: 2,
                    background: `linear-gradient(90deg, ${GOLD}88, ${GOLD}33)`,
                    zIndex: 1,
                  }}
                />
              )}
              <div style={{ color: GOLD, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
              <div style={{ color: "#888", fontSize: 11, marginTop: 4 }}>{s.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function GraduateCard({ g, delay }) {
  const socials = [
    g.social?.instagram ? { href: g.social.instagram, label: "IG" } : null,
    g.social?.twitter ? { href: g.social.twitter, label: "X" } : null,
    g.social?.tiktok ? { href: g.social.tiktok, label: "TT" } : null,
  ].filter(Boolean);

  return (
    <Reveal delay={delay}>
      <div style={{ ...cardBase, overflow: "hidden", position: "relative" }} className="hover-lift">
        {g.recent && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 2,
              background: `linear-gradient(135deg, #F4C430, ${GOLD})`,
              color: BLACK,
              fontFamily: "'Oswald',sans-serif",
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              padding: "5px 10px",
              borderRadius: 16,
            }}
          >
            Recent Success Story
          </div>
        )}
        <div
          style={{
            height: 200,
            backgroundImage: g.photo ? `url(${g.photo})` : `linear-gradient(160deg, #1a1f2b 0%, #0a0c11 100%)`,
            backgroundSize: "cover",
            backgroundPosition: "center 18%",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.85) 100%)" }} />
          <div style={{ position: "absolute", bottom: 10, left: 14, color: "#fff", fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: 22, textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
            {g.name}
          </div>
        </div>
        <div style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
            <span style={{ color: GOLD, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "'Oswald',sans-serif" }}>
              {g.position}
            </span>
            <span style={{ color: "#888", fontSize: 11 }}>{g.ageGroup} · {g.yearGraduated}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: g.clubLogo ? `url(${g.clubLogo}) center/cover` : "#222",
                border: `1px solid ${GOLD}44`,
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.club}</span>
            <span style={{ fontSize: 15, flexShrink: 0 }}>{g.countryFlag}</span>
          </div>
          {g.bio && <p style={{ color: "#999", fontSize: 12.5, lineHeight: 1.65, marginBottom: 14 }}>{g.bio}</p>}
          {(g.apps || g.goals || g.assists) ? (
            <div style={{ display: "flex", gap: 16, paddingTop: 12, borderTop: `1px solid ${GOLD}22`, marginBottom: socials.length ? 12 : 0 }}>
              {g.apps ? (
                <div>
                  <div style={{ color: GOLD, fontWeight: 700, fontSize: 15 }}>{g.apps}</div>
                  <div style={{ color: "#777", fontSize: 10, textTransform: "uppercase" }}>Apps</div>
                </div>
              ) : null}
              {g.goals ? (
                <div>
                  <div style={{ color: GOLD, fontWeight: 700, fontSize: 15 }}>{g.goals}</div>
                  <div style={{ color: "#777", fontSize: 10, textTransform: "uppercase" }}>Goals</div>
                </div>
              ) : null}
              {g.assists ? (
                <div>
                  <div style={{ color: GOLD, fontWeight: 700, fontSize: 15 }}>{g.assists}</div>
                  <div style={{ color: "#777", fontSize: 10, textTransform: "uppercase" }}>Assists</div>
                </div>
              ) : null}
            </div>
          ) : null}
          {socials.length > 0 && (
            <div style={{ display: "flex", gap: 8 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: `1px solid ${GOLD}55`,
                    color: GOLD,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontFamily: "'Oswald',sans-serif",
                    textDecoration: "none",
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

function Graduates({ graduates, pageVisibility }) {
  const pv = pageVisibility || seedPageVisibility;
  if (!pv.pageEnabled) return null;

  const orderedGrads = [...graduates].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const featured = orderedGrads.find((g) => g.featured) || orderedGrads[0];

  return (
    <section id="Graduates" style={{ padding: "90px 24px 100px", background: BLACK }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        {pv.heroEnabled && <GraduatesHero />}
        {pv.statsEnabled && <GraduateStatsCounter graduates={orderedGrads} />}
        {pv.featuredEnabled && <FeaturedGraduate graduate={featured} />}
        {pv.timelineEnabled && featured && <GraduateTimeline graduate={featured} />}
        {pv.cardsEnabled && (
          <div style={{ marginTop: 36 }}>
            <Reveal>
              <SectionLabel>All Success Stories</SectionLabel>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, marginTop: 18 }}>
              {orderedGrads
                .filter((g) => g.visible !== false)
                .map((g, i) => (
                  <GraduateCard g={g} delay={i * 80} key={g.id} />
                ))}
            </div>
            {orderedGrads.filter((g) => g.visible !== false).length === 0 && (
              <p style={{ color: "#777", textAlign: "center", marginTop: 20 }}>No success stories to display yet.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Sponsors({ sponsors }) {
  const track = [...sponsors, ...sponsors];
  return (
    <section
      id="Sponsors"
      style={{
        padding: "70px 0 80px",
        background: `linear-gradient(180deg, ${BLACK}, #0d0a04 50%, ${BLACK})`,
        borderTop: `1px solid ${GOLD}22`,
        borderBottom: `1px solid ${GOLD}22`,
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", textAlign: "center", marginBottom: 40 }}>
        <Reveal>
          <SectionLabel>Backed By</SectionLabel>
          <h2 style={{ color: "#fff", fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: "clamp(28px,4vw,44px)", margin: 0 }}>
            Our Sponsors <span style={{ color: "#FFD700" }}>&amp; Partners</span>
          </h2>
        </Reveal>
      </div>

      <style>{`
        @keyframes sponsorScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .sponsor-track-wrap {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        .sponsor-track-wrap::before, .sponsor-track-wrap::after {
          content: "";
          position: absolute;
          top: 0; bottom: 0;
          width: 80px;
          z-index: 2;
          pointer-events: none;
        }
        .sponsor-track-wrap::before {
          left: 0;
          background: linear-gradient(90deg, ${BLACK} 0%, transparent 100%);
        }
        .sponsor-track-wrap::after {
          right: 0;
          background: linear-gradient(270deg, ${BLACK} 0%, transparent 100%);
        }
        .sponsor-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: sponsorScroll 28s linear infinite;
        }
        .sponsor-track-wrap:hover .sponsor-track {
          animation-play-state: paused;
        }
        .sponsor-item {
          flex-shrink: 0;
          width: clamp(120px, 18vw, 180px);
          height: clamp(70px, 10vw, 100px);
          margin: 0 clamp(16px, 3vw, 36px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(212,175,55,0.15);
          filter: grayscale(1) brightness(0.9);
          opacity: 0.7;
          transition: filter 0.4s ease, opacity 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease, border-color 0.4s ease;
        }
        .sponsor-item:hover {
          filter: grayscale(0) brightness(1.05);
          opacity: 1;
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 0 24px 4px rgba(255,215,0,0.4), 0 0 50px 8px rgba(255,215,0,0.15);
          border-color: #FFD700;
        }
        .sponsor-item img {
          max-width: 78%;
          max-height: 60%;
          object-fit: contain;
        }
        .sponsor-item-label {
          color: #ccc;
          font-family: 'Oswald', sans-serif;
          font-size: 12px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 0 10px;
          text-align: center;
        }
      `}</style>

      <div className="sponsor-track-wrap">
        <div className="sponsor-track">
          {track.map((s, i) => (
            <div className="sponsor-item" key={s.id + "_" + i}>
              {s.logo ? <img src={s.logo} alt={s.name} /> : <span className="sponsor-item-label">{s.name}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function News({ news }) {
  return (
    <section id="News" style={{ padding: "90px 24px", background: BLACK }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <Reveal>
          <SectionLabel>Latest</SectionLabel>
          <h2 style={{ color: "#fff", fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: "clamp(28px,4vw,44px)", marginTop: 0, marginBottom: 30 }}>
            News & Announcements
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 22 }}>
          {news.map((n, i) => (
            <Reveal delay={i * 100} key={n.id}>
              <div style={{ ...cardBase, padding: 0, overflow: "hidden" }} className="hover-lift2">
                {n.image && (
                  <div style={{ width: "100%", height: 170, background: `url(${n.image}) center/cover` }} />
                )}
                <div style={{ padding: 22 }}>
                  <div style={{ color: GOLD, fontSize: 12, letterSpacing: "1px" }}>{n.date}</div>
                  <h3 style={{ color: "#fff", fontFamily: "'Oswald',sans-serif", fontSize: 18, margin: "8px 0" }}>{n.title}</h3>
                  <p style={{ color: "#999", fontSize: 14, lineHeight: 1.6 }}>{n.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`.hover-lift2{transition:all .3s;} .hover-lift2:hover{border-color:${GOLD}; transform:translateY(-6px);}`}</style>
    </section>
  );
}

function FixturesResults({ fixtures, results }) {
  return (
    <section id="Fixtures" style={{ padding: "90px 24px", background: `linear-gradient(180deg, ${BLACK}, #120f08)` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <Reveal>
          <SectionLabel>Matches</SectionLabel>
          <h2 style={{ color: "#fff", fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: "clamp(28px,4vw,44px)", marginTop: 0, marginBottom: 30 }}>
            Fixtures, Results & Match Reports
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }} className="fr-grid">
          <div>
            <h3 style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", fontSize: 15, textTransform: "uppercase", marginBottom: 14 }}>Upcoming</h3>
            {fixtures.map((f, i) => (
              <Reveal delay={i * 80} key={f.id}>
                <div style={{ ...cardBase, padding: 16, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 600 }}>{f.home} <span style={{ color: GOLD }}>vs</span> {f.away}</div>
                    <div style={{ color: "#888", fontSize: 12 }}>{f.venue}</div>
                  </div>
                  <div style={{ color: GOLD, fontSize: 13, textAlign: "right" }}>{f.date}<br />{f.time}</div>
                </div>
              </Reveal>
            ))}
            {fixtures.length === 0 && <p style={{ color: "#777" }}>No upcoming matches.</p>}
          </div>
          <div>
            <h3 style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", fontSize: 15, textTransform: "uppercase", marginBottom: 14 }}>Results & Reports</h3>
            {results.map((r, i) => (
              <Reveal delay={i * 80} key={r.id}>
                <div style={{ ...cardBase, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", fontWeight: 700 }}>
                    <span>{r.home} {r.scoreHome} - {r.scoreAway} {r.away}</span>
                    <span style={{ color: GOLD, fontWeight: 400, fontSize: 12 }}>{r.date}</span>
                  </div>
                  {r.report && <p style={{ color: "#999", fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>{r.report}</p>}
                </div>
              </Reveal>
            ))}
            {results.length === 0 && <p style={{ color: "#777" }}>No results yet.</p>}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 800px) { .fr-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function Standings({ standings }) {
  const [squad, setSquad] = useState("Elite Team");
  const rows = standings.filter((s) => s.squad === squad).sort((a, b) => b.points - a.points);
  return (
    <section id="Standings" style={{ padding: "90px 24px", background: BLACK }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <SectionLabel>League Table</SectionLabel>
          <h2 style={{ color: "#fff", fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: "clamp(28px,4vw,44px)", marginTop: 0, marginBottom: 24 }}>
            Standings
          </h2>
        </Reveal>
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          {SQUADS.map((s) => (
            <button key={s} onClick={() => setSquad(s)} style={squad === s ? btnGold : btnGhost}>{s}</button>
          ))}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#ddd", fontFamily: "'Inter',sans-serif", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${GOLD}` }}>
                {["Team", "P", "W", "D", "L", "Pts"].map((h) => (
                  <th key={h} style={{ textAlign: h === "Team" ? "left" : "center", padding: "10px 8px", color: GOLD, fontFamily: "'Oswald',sans-serif", textTransform: "uppercase", fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: "10px 8px", fontWeight: 600 }}>{r.team}</td>
                  <td style={{ textAlign: "center" }}>{r.played}</td>
                  <td style={{ textAlign: "center" }}>{r.won}</td>
                  <td style={{ textAlign: "center" }}>{r.drawn}</td>
                  <td style={{ textAlign: "center" }}>{r.lost}</td>
                  <td style={{ textAlign: "center", color: GOLD, fontWeight: 700 }}>{r.points}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#777" }}>No standings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Testimonials({ testimonials }) {
  const track = testimonials.length > 0 ? [...testimonials, ...testimonials] : [];
  return (
    <section id="Testimonials" style={{ padding: "90px 0 100px", background: `linear-gradient(180deg, ${BLACK}, #120f08)`, overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <Reveal>
          <SectionLabel>Voices</SectionLabel>
          <h2 style={{ color: "#fff", fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: "clamp(28px,4vw,44px)", marginTop: 0, marginBottom: 30 }}>
            Testimonials
          </h2>
        </Reveal>
      </div>

      {testimonials.length === 0 ? null : (
        <>
          <style>{`
            @keyframes testimonialScroll {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            .testimonial-track-wrap {
              width: 100%;
              overflow: hidden;
              position: relative;
            }
            .testimonial-track-wrap::before, .testimonial-track-wrap::after {
              content: "";
              position: absolute;
              top: 0; bottom: 0;
              width: 80px;
              z-index: 2;
              pointer-events: none;
            }
            .testimonial-track-wrap::before {
              left: 0;
              background: linear-gradient(90deg, ${BLACK} 0%, transparent 100%);
            }
            .testimonial-track-wrap::after {
              right: 0;
              background: linear-gradient(270deg, ${BLACK} 0%, transparent 100%);
            }
            .testimonial-track {
              display: flex;
              align-items: stretch;
              width: max-content;
              animation: testimonialScroll 36s linear infinite;
            }
            .testimonial-track-wrap:hover .testimonial-track {
              animation-play-state: paused;
            }
            .testimonial-card {
              flex-shrink: 0;
              width: clamp(260px, 28vw, 340px);
              margin: 0 11px;
            }
          `}</style>

          <div className="testimonial-track-wrap">
            <div className="testimonial-track">
              {track.map((t, i) => (
                <div className="testimonial-card" style={cardBase} key={t.id + "_" + i}>
                  <div style={{ padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: t.photo ? `url(${t.photo}) center/cover` : "#222",
                          border: `2px solid ${GOLD}`,
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                        <div style={{ color: GOLD, fontSize: 12 }}>{t.role}</div>
                      </div>
                    </div>
                    <div style={{ color: GOLD, fontSize: 28, lineHeight: 0.5 }}>"</div>
                    <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.7, fontStyle: "italic" }}>{t.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Register({ onSubmit }) {
  const [form, setForm] = useState({ name: "", age: "", guardian: "", phone: "", squad: "Elite Team", notes: "" });
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, id: "reg_" + Date.now(), submittedAt: new Date().toISOString() });
    setSent(true);
    setForm({ name: "", age: "", guardian: "", phone: "", squad: "Elite Team", notes: "" });
  };
  return (
    <section id="Register" style={{ padding: "90px 24px", background: BLACK }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Reveal>
          <SectionLabel>Join Us</SectionLabel>
          <h2 style={{ color: "#fff", fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: "clamp(28px,4vw,44px)", marginTop: 0, marginBottom: 24 }}>
            Registration Form
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <form onSubmit={submit} style={{ ...cardBase, padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
            <input required placeholder="Player full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            <input required type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} style={inputStyle} />
            <input required placeholder="Guardian name" value={form.guardian} onChange={(e) => setForm({ ...form, guardian: e.target.value })} style={inputStyle} />
            <input required placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
            <select value={form.squad} onChange={(e) => setForm({ ...form, squad: e.target.value })} style={inputStyle}>
              {SQUADS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <textarea placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
            <button type="submit" style={btnGold}>Submit Registration</button>
            {sent && <div style={{ color: GOLD, fontSize: 13 }}>Thank you — we'll be in touch soon!</div>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="Contact" style={{ padding: "90px 24px", background: `linear-gradient(180deg, ${BLACK}, #120f08)` }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <SectionLabel>Get In Touch</SectionLabel>
          <h2 style={{ color: "#fff", fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: "clamp(28px,4vw,44px)", marginTop: 0, marginBottom: 24 }}>
            Contact Bek Fa
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p style={{ color: "#999", lineHeight: 1.8 }}>📍 Accra, Ghana &nbsp;|&nbsp; 📞 +233 24 000 0000 &nbsp;|&nbsp; ✉️ info@bekfa.academy</p>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ onAdminClick }) {
  return (
    <footer style={{ background: BLACK, borderTop: `1px solid ${GOLD}33`, padding: "40px 24px 24px", textAlign: "center" }}>
      <div style={{ color: GOLD, fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: 22, marginBottom: 8 }}>BEK FA ACADEMY</div>
      <div style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>Everyone Deserves A Second Chance</div>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 18 }}>
        {["FB", "IG", "X", "YT"].map((s) => (
          <div key={s} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${GOLD}66`, color: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, cursor: "pointer" }}>{s}</div>
        ))}
      </div>
      <div style={{ color: "#555", fontSize: 12 }}>
        © 2026 Bek Fa Football Academy, Ghana. All rights reserved.
        {" · "}
        <button onClick={onAdminClick} style={{ background: "none", border: "none", color: "#444", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
          Admin
        </button>
      </div>
    </footer>
  );
}

/* ============================ ADMIN PANEL ============================ */

function AdminLogin({ onLogin, onClose }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ ...cardBase, padding: 32, width: 360 }}>
        <h3 style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", marginTop: 0 }}>Admin Login</h3>
        <form onSubmit={(e) => { e.preventDefault(); if (pw === ADMIN_PASSWORD) onLogin(); else setErr("Incorrect password."); }}>
          <input autoFocus type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }} />
          {err && <div style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 10 }}>{err}</div>}
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" style={{ ...btnGold, flex: 1 }}>Login</button>
            <button type="button" onClick={onClose} style={{ ...btnGhost, flex: 1 }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminPanel({ data, setters, onLogout, registrations }) {
  const [tab, setTab] = useState("dashboard");
  const tabs = ["dashboard", "carousel", "players", "coaches", "graduates", "pages", "sponsors", "news", "fixtures", "results", "standings", "potm", "testimonials", "registrations", "splash"];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex" }}>
      <aside style={{ width: 220, background: CHARCOAL, borderRight: `1px solid ${GOLD}33`, padding: 20, flexShrink: 0 }}>
        <div style={{ color: GOLD, fontFamily: "'Bebas Neue','Oswald',sans-serif", fontSize: 20, marginBottom: 24 }}>BEK FA ADMIN</div>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              display: "block", width: "100%", textAlign: "left", background: tab === t ? `${GOLD}22` : "transparent",
              color: tab === t ? GOLD : "#bbb", border: "none", padding: "10px 12px", borderRadius: 6, marginBottom: 4,
              fontFamily: "'Oswald',sans-serif", textTransform: "capitalize", cursor: "pointer", fontSize: 13,
            }}
          >
            {t}
          </button>
        ))}
        <button onClick={onLogout} style={{ ...btnGhost, width: "100%", marginTop: 20 }}>Logout</button>
      </aside>
      <main style={{ flex: 1, padding: "30px clamp(20px,3vw,48px)", overflowY: "auto" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {tab === "dashboard" && <Dashboard data={data} registrations={registrations} />}
        {tab === "carousel" && <ManageCarousel slides={data.slides} setSlides={setters.setSlides} settings={data.carouselSettings} setSettings={setters.setCarouselSettings} />}
        {tab === "players" && <ManagePlayers players={data.players} setPlayers={setters.setPlayers} />}
        {tab === "coaches" && <ManageCoaches coaches={data.coaches} setCoaches={setters.setCoaches} />}
        {tab === "graduates" && <ManageGraduates graduates={data.graduates} setGraduates={setters.setGraduates} />}
        {tab === "pages" && <ManagePageVisibility visibility={data.pageVisibility} setVisibility={setters.setPageVisibility} />}
        {tab === "sponsors" && <ManageSponsors sponsors={data.sponsors} setSponsors={setters.setSponsors} />}
        {tab === "news" && <ManageNews news={data.news} setNews={setters.setNews} />}
        {tab === "fixtures" && <ManageFixtures fixtures={data.fixtures} setFixtures={setters.setFixtures} />}
        {tab === "results" && <ManageResults results={data.results} setResults={setters.setResults} />}
        {tab === "standings" && <ManageStandings standings={data.standings} setStandings={setters.setStandings} />}
        {tab === "potm" && <ManagePOTM potm={data.potm} setPotm={setters.setPotm} players={data.players} />}
        {tab === "testimonials" && <ManageTestimonials testimonials={data.testimonials} setTestimonials={setters.setTestimonials} />}
        {tab === "registrations" && <ViewRegistrations registrations={registrations} />}
        {tab === "splash" && <ManageSplash ballImage={data.splashBall} setBallImage={setters.setSplashBall} />}
        </div>
      </main>
    </div>
  );
}

function AdminCard({ children }) {
  return <div style={{ ...cardBase, padding: 20, marginBottom: 14 }}>{children}</div>;
}
function H({ children }) {
  return <h2 style={{ color: "#fff", fontFamily: "'Oswald',sans-serif", marginTop: 0 }}>{children}</h2>;
}

function Dashboard({ data, registrations }) {
  const stats = [
    ["Players", data.players.length],
    ["Coaches", data.coaches.length],
    ["Sponsors", data.sponsors.length],
    ["News Posts", data.news.length],
    ["Upcoming Fixtures", data.fixtures.length],
    ["Results Logged", data.results.length],
    ["Carousel Slides", data.slides ? data.slides.length : 0],
    ["Success Stories", data.graduates ? data.graduates.length : 0],
    ["New Registrations", registrations.length],
  ];
  return (
    <div>
      <H>Dashboard</H>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16 }}>
        {stats.map(([label, val]) => (
          <AdminCard key={label}>
            <div style={{ color: GOLD, fontSize: 30, fontFamily: "'Oswald',sans-serif", fontWeight: 700 }}>{val}</div>
            <div style={{ color: "#999", fontSize: 13 }}>{label}</div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}

function ManagePlayers({ players, setPlayers }) {
  const empty = { name: "", squad: "Elite Team", position: "Forward", number: "", goals: 0, assists: 0, games: 0, cleanSheets: 0, photo: "" };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const startAdd = () => { setEditingId(null); setForm(empty); };
  const edit = (p) => { setEditingId(p.id); setForm({ ...empty, ...p }); };
  const cancelEdit = () => { setEditingId(null); setForm(empty); };

  const add = () => {
    if (!form.name) return;
    setPlayers([...players, { ...form, id: "p_" + Date.now() }]);
    setForm(empty);
  };
  const saveEdit = () => {
    if (!form.name) return;
    setPlayers(players.map((p) => (p.id === editingId ? { ...form, id: editingId } : p)));
    setEditingId(null);
    setForm(empty);
  };
  const remove = (id) => {
    setPlayers(players.filter((p) => p.id !== id));
    if (editingId === id) startAdd();
  };

  return (
    <div>
      <H>Manage Players</H>
      <AdminCard>
        <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", fontWeight: 600, marginBottom: 14, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {editingId ? "Editing Player" : "Add New Player"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
          <input style={inputStyle} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select style={inputStyle} value={form.squad} onChange={(e) => setForm({ ...form, squad: e.target.value })}>{SQUADS.map((s) => <option key={s}>{s}</option>)}</select>
          <select style={inputStyle} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>
            {["Forward", "Midfielder", "Defender", "Goalkeeper"].map((p) => <option key={p}>{p}</option>)}
          </select>
          <input style={inputStyle} type="number" placeholder="Number" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
          <input style={inputStyle} type="number" placeholder="Goals" value={form.goals} onChange={(e) => setForm({ ...form, goals: +e.target.value })} />
          <input style={inputStyle} type="number" placeholder="Assists" value={form.assists} onChange={(e) => setForm({ ...form, assists: +e.target.value })} />
          <input style={inputStyle} type="number" placeholder="Games" value={form.games} onChange={(e) => setForm({ ...form, games: +e.target.value })} />
          <input style={inputStyle} type="number" placeholder="Clean Sheets" value={form.cleanSheets} onChange={(e) => setForm({ ...form, cleanSheets: +e.target.value })} />
        </div>
        <div style={{ marginTop: 12 }}>
          <PhotoUpload value={form.photo} onChange={(v) => setForm({ ...form, photo: v })} label={editingId ? "Replace Photo" : "Upload Photo"} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {editingId ? (
            <>
              <button onClick={saveEdit} style={btnGold}>Save Changes</button>
              <button onClick={cancelEdit} style={btnGhost}>Cancel</button>
            </>
          ) : (
            <button onClick={add} style={btnGold}>Add Player</button>
          )}
        </div>
      </AdminCard>
      {players.map((p) => (
        <AdminCard key={p.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, background: p.photo ? `url(${p.photo}) center/cover` : "#222", border: `1px solid ${GOLD}55` }} />
              <div style={{ color: "#fff" }}>#{p.number} {p.name} — {p.squad} ({p.position})</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => edit(p)} style={btnGhost}>Edit</button>
              <button onClick={() => remove(p.id)} style={{ ...btnGhost, color: "#ff6b6b", borderColor: "#ff6b6b88" }}>Delete</button>
            </div>
          </div>
        </AdminCard>
      ))}
    </div>
  );
}

function ManageCoaches({ coaches, setCoaches }) {
  const empty = { name: "", role: "", bio: "", photo: "" };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const startAdd = () => { setEditingId(null); setForm(empty); };
  const edit = (c) => { setEditingId(c.id); setForm({ ...empty, ...c }); };
  const cancelEdit = () => { setEditingId(null); setForm(empty); };

  const add = () => { if (!form.name) return; setCoaches([...coaches, { ...form, id: "c_" + Date.now() }]); setForm(empty); };
  const saveEdit = () => {
    if (!form.name) return;
    setCoaches(coaches.map((c) => (c.id === editingId ? { ...form, id: editingId } : c)));
    setEditingId(null);
    setForm(empty);
  };
  const remove = (id) => {
    setCoaches(coaches.filter((c) => c.id !== id));
    if (editingId === id) startAdd();
  };

  return (
    <div>
      <H>Manage Coaches</H>
      <AdminCard>
        <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", fontWeight: 600, marginBottom: 14, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {editingId ? "Editing Coach" : "Add New Coach"}
        </div>
        <input style={{ ...inputStyle, marginBottom: 10 }} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input style={{ ...inputStyle, marginBottom: 10 }} placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        <textarea style={{ ...inputStyle, marginBottom: 10, minHeight: 70 }} placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <PhotoUpload value={form.photo} onChange={(v) => setForm({ ...form, photo: v })} label={editingId ? "Replace Photo" : "Upload Photo"} />
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {editingId ? (
            <>
              <button onClick={saveEdit} style={btnGold}>Save Changes</button>
              <button onClick={cancelEdit} style={btnGhost}>Cancel</button>
            </>
          ) : (
            <button onClick={add} style={btnGold}>Add Coach</button>
          )}
        </div>
      </AdminCard>
      {coaches.map((c) => (
        <AdminCard key={c.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: c.photo ? `url(${c.photo}) center/cover` : "#222", border: `1px solid ${GOLD}55` }} />
              <div style={{ color: "#fff" }}>{c.name} — {c.role}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => edit(c)} style={btnGhost}>Edit</button>
              <button onClick={() => remove(c.id)} style={{ ...btnGhost, color: "#ff6b6b", borderColor: "#ff6b6b88" }}>Delete</button>
            </div>
          </div>
        </AdminCard>
      ))}
    </div>
  );
}

function ManageNews({ news, setNews }) {
  const empty = { title: "", date: "", body: "", image: "" };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const startAdd = () => { setEditingId(null); setForm(empty); };
  const edit = (n) => { setEditingId(n.id); setForm({ ...empty, ...n }); };
  const cancelEdit = () => { setEditingId(null); setForm(empty); };

  const add = () => { if (!form.title) return; setNews([{ ...form, id: "n_" + Date.now() }, ...news]); setForm(empty); };
  const saveEdit = () => {
    if (!form.title) return;
    setNews(news.map((n) => (n.id === editingId ? { ...form, id: editingId } : n)));
    setEditingId(null);
    setForm(empty);
  };
  const remove = (id) => {
    setNews(news.filter((n) => n.id !== id));
    if (editingId === id) startAdd();
  };

  return (
    <div>
      <H>Manage News</H>
      <AdminCard>
        <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", fontWeight: 600, marginBottom: 14, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {editingId ? "Editing News Post" : "Post New News"}
        </div>
        <input style={{ ...inputStyle, marginBottom: 10 }} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input style={{ ...inputStyle, marginBottom: 10 }} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <textarea style={{ ...inputStyle, marginBottom: 10, minHeight: 80 }} placeholder="Body" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <PhotoUpload value={form.image} onChange={(v) => setForm({ ...form, image: v })} label={editingId ? "Replace Image" : "Upload Image"} />
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {editingId ? (
            <>
              <button onClick={saveEdit} style={btnGold}>Save Changes</button>
              <button onClick={cancelEdit} style={btnGhost}>Cancel</button>
            </>
          ) : (
            <button onClick={add} style={btnGold}>Post News</button>
          )}
        </div>
      </AdminCard>
      {news.map((n) => (
        <AdminCard key={n.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 56, height: 40, borderRadius: 6, flexShrink: 0, background: n.image ? `url(${n.image}) center/cover` : "#222", border: `1px solid ${GOLD}55` }} />
              <div style={{ color: "#fff" }}>{n.title} <span style={{ color: "#888", fontSize: 12 }}>({n.date})</span></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => edit(n)} style={btnGhost}>Edit</button>
              <button onClick={() => remove(n.id)} style={{ ...btnGhost, color: "#ff6b6b", borderColor: "#ff6b6b88" }}>Delete</button>
            </div>
          </div>
        </AdminCard>
      ))}
    </div>
  );
}

function ManageFixtures({ fixtures, setFixtures }) {
  const empty = { home: "", away: "", date: "", time: "", venue: "" };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const startAdd = () => { setEditingId(null); setForm(empty); };
  const edit = (f) => { setEditingId(f.id); setForm({ ...empty, ...f }); };
  const cancelEdit = () => { setEditingId(null); setForm(empty); };

  const add = () => { if (!form.home || !form.away) return; setFixtures([...fixtures, { ...form, id: "f_" + Date.now() }]); setForm(empty); };
  const saveEdit = () => {
    if (!form.home || !form.away) return;
    setFixtures(fixtures.map((f) => (f.id === editingId ? { ...form, id: editingId } : f)));
    setEditingId(null);
    setForm(empty);
  };
  const remove = (id) => {
    setFixtures(fixtures.filter((f) => f.id !== id));
    if (editingId === id) startAdd();
  };

  return (
    <div>
      <H>Manage Upcoming Matches</H>
      <AdminCard>
        <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", fontWeight: 600, marginBottom: 14, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {editingId ? "Editing Fixture" : "Add New Fixture"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
          <input style={inputStyle} placeholder="Home team" value={form.home} onChange={(e) => setForm({ ...form, home: e.target.value })} />
          <input style={inputStyle} placeholder="Away team" value={form.away} onChange={(e) => setForm({ ...form, away: e.target.value })} />
          <input style={inputStyle} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input style={inputStyle} type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          <input style={inputStyle} placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {editingId ? (
            <>
              <button onClick={saveEdit} style={btnGold}>Save Changes</button>
              <button onClick={cancelEdit} style={btnGhost}>Cancel</button>
            </>
          ) : (
            <button onClick={add} style={btnGold}>Add Fixture</button>
          )}
        </div>
      </AdminCard>
      {fixtures.map((f) => (
        <AdminCard key={f.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ color: "#fff" }}>{f.home} vs {f.away} — {f.date} {f.time}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => edit(f)} style={btnGhost}>Edit</button>
              <button onClick={() => remove(f.id)} style={{ ...btnGhost, color: "#ff6b6b", borderColor: "#ff6b6b88" }}>Delete</button>
            </div>
          </div>
        </AdminCard>
      ))}
    </div>
  );
}

function ManageResults({ results, setResults }) {
  const empty = { home: "", away: "", scoreHome: 0, scoreAway: 0, date: "", report: "" };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const startAdd = () => { setEditingId(null); setForm(empty); };
  const edit = (r) => { setEditingId(r.id); setForm({ ...empty, ...r }); };
  const cancelEdit = () => { setEditingId(null); setForm(empty); };

  const add = () => { if (!form.home || !form.away) return; setResults([{ ...form, id: "r_" + Date.now() }, ...results]); setForm(empty); };
  const saveEdit = () => {
    if (!form.home || !form.away) return;
    setResults(results.map((r) => (r.id === editingId ? { ...form, id: editingId } : r)));
    setEditingId(null);
    setForm(empty);
  };
  const remove = (id) => {
    setResults(results.filter((r) => r.id !== id));
    if (editingId === id) startAdd();
  };

  return (
    <div>
      <H>Manage Results & Match Reports</H>
      <AdminCard>
        <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", fontWeight: 600, marginBottom: 14, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {editingId ? "Editing Result" : "Add New Result"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginBottom: 10 }}>
          <input style={inputStyle} placeholder="Home team" value={form.home} onChange={(e) => setForm({ ...form, home: e.target.value })} />
          <input style={inputStyle} type="number" placeholder="Score" value={form.scoreHome} onChange={(e) => setForm({ ...form, scoreHome: +e.target.value })} />
          <input style={inputStyle} placeholder="Away team" value={form.away} onChange={(e) => setForm({ ...form, away: e.target.value })} />
          <input style={inputStyle} type="number" placeholder="Score" value={form.scoreAway} onChange={(e) => setForm({ ...form, scoreAway: +e.target.value })} />
          <input style={inputStyle} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <textarea style={{ ...inputStyle, minHeight: 70 }} placeholder="Match report" value={form.report} onChange={(e) => setForm({ ...form, report: e.target.value })} />
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {editingId ? (
            <>
              <button onClick={saveEdit} style={btnGold}>Save Changes</button>
              <button onClick={cancelEdit} style={btnGhost}>Cancel</button>
            </>
          ) : (
            <button onClick={add} style={btnGold}>Add Result</button>
          )}
        </div>
      </AdminCard>
      {results.map((r) => (
        <AdminCard key={r.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ color: "#fff" }}>{r.home} {r.scoreHome}-{r.scoreAway} {r.away}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => edit(r)} style={btnGhost}>Edit</button>
              <button onClick={() => remove(r.id)} style={{ ...btnGhost, color: "#ff6b6b", borderColor: "#ff6b6b88" }}>Delete</button>
            </div>
          </div>
        </AdminCard>
      ))}
    </div>
  );
}

function ManageStandings({ standings, setStandings }) {
  const empty = { squad: "Elite Team", team: "", played: 0, won: 0, drawn: 0, lost: 0, points: 0 };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const startAdd = () => { setEditingId(null); setForm(empty); };
  const edit = (s) => { setEditingId(s.id); setForm({ ...empty, ...s }); };
  const cancelEdit = () => { setEditingId(null); setForm(empty); };

  const add = () => { if (!form.team) return; setStandings([...standings, { ...form, id: "s_" + Date.now() }]); setForm(empty); };
  const saveEdit = () => {
    if (!form.team) return;
    setStandings(standings.map((s) => (s.id === editingId ? { ...form, id: editingId } : s)));
    setEditingId(null);
    setForm(empty);
  };
  const remove = (id) => {
    setStandings(standings.filter((s) => s.id !== id));
    if (editingId === id) startAdd();
  };

  return (
    <div>
      <H>Manage League Standings</H>
      <AdminCard>
        <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", fontWeight: 600, marginBottom: 14, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {editingId ? "Editing Standing" : "Add New Row"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10 }}>
          <select style={inputStyle} value={form.squad} onChange={(e) => setForm({ ...form, squad: e.target.value })}>{SQUADS.map((s) => <option key={s}>{s}</option>)}</select>
          <input style={inputStyle} placeholder="Team name" value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} />
          {["played", "won", "drawn", "lost", "points"].map((f) => (
            <input key={f} style={inputStyle} type="number" placeholder={f} value={form[f]} onChange={(e) => setForm({ ...form, [f]: +e.target.value })} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {editingId ? (
            <>
              <button onClick={saveEdit} style={btnGold}>Save Changes</button>
              <button onClick={cancelEdit} style={btnGhost}>Cancel</button>
            </>
          ) : (
            <button onClick={add} style={btnGold}>Add Row</button>
          )}
        </div>
      </AdminCard>
      {standings.map((s) => (
        <AdminCard key={s.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ color: "#fff" }}>{s.squad} — {s.team} ({s.points} pts)</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => edit(s)} style={btnGhost}>Edit</button>
              <button onClick={() => remove(s.id)} style={{ ...btnGhost, color: "#ff6b6b", borderColor: "#ff6b6b88" }}>Delete</button>
            </div>
          </div>
        </AdminCard>
      ))}
    </div>
  );
}

function ManagePOTM({ potm, setPotm, players }) {
  const [local, setLocal] = useState(potm);
  const save = (squad) => setPotm({ ...potm, [squad]: local[squad] });
  return (
    <div>
      <H>Manage Player Of The Month</H>
      {SQUADS.map((squad) => {
        const entry = local[squad] || { playerId: "", month: "", quote: "" };
        const squadPlayers = players.filter((p) => p.squad === squad);
        return (
          <AdminCard key={squad}>
            <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", marginBottom: 10 }}>{squad}</div>
            <select style={{ ...inputStyle, marginBottom: 10 }} value={entry.playerId} onChange={(e) => setLocal({ ...local, [squad]: { ...entry, playerId: e.target.value } })}>
              <option value="">Select player...</option>
              {squadPlayers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input style={{ ...inputStyle, marginBottom: 10 }} placeholder="Month (e.g. June 2026)" value={entry.month} onChange={(e) => setLocal({ ...local, [squad]: { ...entry, month: e.target.value } })} />
            <input style={{ ...inputStyle, marginBottom: 10 }} placeholder="Quote" value={entry.quote} onChange={(e) => setLocal({ ...local, [squad]: { ...entry, quote: e.target.value } })} />
            <button onClick={() => save(squad)} style={btnGold}>Save {squad}</button>
          </AdminCard>
        );
      })}
    </div>
  );
}

function ManageSponsors({ sponsors, setSponsors }) {
  const empty = { name: "", logo: "" };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const startAdd = () => { setEditingId(null); setForm(empty); };
  const edit = (s) => { setEditingId(s.id); setForm({ ...empty, ...s }); };
  const cancelEdit = () => { setEditingId(null); setForm(empty); };

  const add = () => { if (!form.name) return; setSponsors([...sponsors, { ...form, id: "sp_" + Date.now() }]); setForm(empty); };
  const saveEdit = () => {
    if (!form.name) return;
    setSponsors(sponsors.map((s) => (s.id === editingId ? { ...form, id: editingId } : s)));
    setEditingId(null);
    setForm(empty);
  };
  const remove = (id) => {
    setSponsors(sponsors.filter((s) => s.id !== id));
    if (editingId === id) startAdd();
  };

  return (
    <div>
      <H>Manage Sponsors & Partners</H>
      <AdminCard>
        <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", fontWeight: 600, marginBottom: 14, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {editingId ? "Editing Sponsor" : "Add New Sponsor"}
        </div>
        <input style={{ ...inputStyle, marginBottom: 10 }} placeholder="Sponsor / partner name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <PhotoUpload value={form.logo} onChange={(v) => setForm({ ...form, logo: v })} label={editingId ? "Replace Logo" : "Upload Logo"} />
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {editingId ? (
            <>
              <button onClick={saveEdit} style={btnGold}>Save Changes</button>
              <button onClick={cancelEdit} style={btnGhost}>Cancel</button>
            </>
          ) : (
            <button onClick={add} style={btnGold}>Add Sponsor</button>
          )}
        </div>
      </AdminCard>
      {sponsors.map((s) => (
        <AdminCard key={s.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 48, height: 36, borderRadius: 6, background: s.logo ? `url(${s.logo}) center/contain no-repeat` : "#222", border: `1px solid ${GOLD}55` }} />
              <div style={{ color: "#fff" }}>{s.name}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => edit(s)} style={btnGhost}>Edit</button>
              <button onClick={() => remove(s.id)} style={{ ...btnGhost, color: "#ff6b6b", borderColor: "#ff6b6b88" }}>Delete</button>
            </div>
          </div>
        </AdminCard>
      ))}
    </div>
  );
}

function ManageTestimonials({ testimonials, setTestimonials }) {
  const empty = { name: "", role: "", text: "", photo: "" };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const startAdd = () => { setEditingId(null); setForm(empty); };
  const edit = (t) => { setEditingId(t.id); setForm({ ...empty, ...t }); };
  const cancelEdit = () => { setEditingId(null); setForm(empty); };

  const add = () => { if (!form.name || !form.text) return; setTestimonials([...testimonials, { ...form, id: "t_" + Date.now() }]); setForm(empty); };
  const saveEdit = () => {
    if (!form.name || !form.text) return;
    setTestimonials(testimonials.map((t) => (t.id === editingId ? { ...form, id: editingId } : t)));
    setEditingId(null);
    setForm(empty);
  };
  const remove = (id) => {
    setTestimonials(testimonials.filter((t) => t.id !== id));
    if (editingId === id) startAdd();
  };

  return (
    <div>
      <H>Manage Testimonials</H>
      <AdminCard>
        <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", fontWeight: 600, marginBottom: 14, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {editingId ? "Editing Testimonial" : "Add New Testimonial"}
        </div>
        <input style={{ ...inputStyle, marginBottom: 10 }} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input style={{ ...inputStyle, marginBottom: 10 }} placeholder="Role (e.g. Parent, Player)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        <textarea style={{ ...inputStyle, marginBottom: 10, minHeight: 70 }} placeholder="Testimonial text" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
        <PhotoUpload value={form.photo} onChange={(v) => setForm({ ...form, photo: v })} label={editingId ? "Replace Photo" : "Upload Photo"} />
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {editingId ? (
            <>
              <button onClick={saveEdit} style={btnGold}>Save Changes</button>
              <button onClick={cancelEdit} style={btnGhost}>Cancel</button>
            </>
          ) : (
            <button onClick={add} style={btnGold}>Add Testimonial</button>
          )}
        </div>
      </AdminCard>
      {testimonials.map((t) => (
        <AdminCard key={t.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: t.photo ? `url(${t.photo}) center/cover` : "#222", border: `1px solid ${GOLD}55` }} />
              <div style={{ color: "#fff" }}>{t.name} — {t.role}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => edit(t)} style={btnGhost}>Edit</button>
              <button onClick={() => remove(t.id)} style={{ ...btnGhost, color: "#ff6b6b", borderColor: "#ff6b6b88" }}>Delete</button>
            </div>
          </div>
        </AdminCard>
      ))}
    </div>
  );
}

function ManageSplash({ ballImage, setBallImage }) {
  return (
    <div>
      <H>Splash Screen Ball</H>
      <AdminCard>
        <p style={{ color: "#999", fontSize: 13, marginTop: 0 }}>
          Upload an image to replace the animated football shown on the splash screen when the site loads. It will spin and glow automatically. Leave empty to use the default drawn football.
        </p>
        <PhotoUpload value={ballImage} onChange={setBallImage} label="Upload Ball Image" />
        {ballImage && (
          <button onClick={() => setBallImage("")} style={{ ...btnGhost, marginTop: 14 }}>
            Remove Custom Image
          </button>
        )}
      </AdminCard>
    </div>
  );
}

function ViewRegistrations({ registrations }) {
  return (
    <div>
      <H>New Registrations</H>
      {registrations.length === 0 && <p style={{ color: "#777" }}>No registrations yet.</p>}
      {registrations.map((r) => (
        <AdminCard key={r.id}>
          <div style={{ color: "#fff", fontWeight: 700 }}>{r.name} ({r.age}) — {r.squad}</div>
          <div style={{ color: "#999", fontSize: 13 }}>Guardian: {r.guardian} · {r.phone}</div>
          {r.notes && <div style={{ color: "#888", fontSize: 12, marginTop: 6 }}>{r.notes}</div>}
        </AdminCard>
      ))}
    </div>
  );
}

/* ============================ MANAGE GRADUATES (ADMIN) ============================ */
function ManageGraduates({ graduates, setGraduates }) {
  const empty = {
    name: "", photo: "", position: "", ageGroup: "Elite Squad", yearGraduated: new Date().getFullYear(),
    club: "", clubLogo: "", country: "", countryFlag: "", bio: "",
    apps: "", goals: "", assists: "", recent: false, featured: false, visible: true,
    social: { instagram: "", twitter: "", tiktok: "" },
  };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [dragId, setDragId] = useState(null);

  const startAdd = () => { setEditingId(null); setForm(empty); };

  const add = () => {
    if (!form.name) return;
    const next = [...graduates, { ...form, id: "g_" + Date.now(), order: graduates.length }];
    setGraduates(next);
    setForm(empty);
  };

  const edit = (g) => { setEditingId(g.id); setForm({ ...empty, ...g, social: { ...empty.social, ...(g.social || {}) } }); };

  const saveEdit = () => {
    if (!form.name) return;
    setGraduates(graduates.map((g) => (g.id === editingId ? { ...form, id: editingId } : g)));
    setEditingId(null);
    setForm(empty);
  };

  const cancelEdit = () => { setEditingId(null); setForm(empty); };

  const remove = (id) => {
    setGraduates(graduates.filter((g) => g.id !== id));
    if (editingId === id) startAdd();
  };

  const toggleField = (id, field) => {
    setGraduates(graduates.map((g) => (g.id === id ? { ...g, [field]: !g[field] } : g)));
  };

  const setFeaturedOnly = (id) => {
    setGraduates(graduates.map((g) => ({ ...g, featured: g.id === id })));
  };

  /* drag-and-drop reorder */
  const onDragStart = (id) => setDragId(id);
  const onDragOver = (e, overId) => {
    e.preventDefault();
    if (dragId === null || dragId === overId) return;
    const sorted = [...graduates].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const fromIdx = sorted.findIndex((g) => g.id === dragId);
    const toIdx = sorted.findIndex((g) => g.id === overId);
    if (fromIdx === -1 || toIdx === -1) return;
    const next = [...sorted];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setGraduates(next.map((g, i) => ({ ...g, order: i })));
  };
  const onDragEnd = () => setDragId(null);

  const orderedGraduates = [...graduates].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const formCard = (
    <AdminCard>
      <div style={{ color: GOLD, fontFamily: "'Oswald',sans-serif", fontWeight: 600, marginBottom: 14, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {editingId ? "Editing Success Story" : "Add New Success Story"}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
        <div>
          <div style={{ color: "#999", fontSize: 11, marginBottom: 6, textTransform: "uppercase" }}>Player Photo</div>
          <PhotoUpload value={form.photo} onChange={(v) => setForm({ ...form, photo: v })} label="Upload Photo" />
        </div>
        <div>
          <div style={{ color: "#999", fontSize: 11, marginBottom: 6, textTransform: "uppercase" }}>Club Logo</div>
          <PhotoUpload value={form.clubLogo} onChange={(v) => setForm({ ...form, clubLogo: v })} label="Upload Club Logo" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10, marginBottom: 10 }}>
        <input style={inputStyle} placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input style={inputStyle} placeholder="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
        <select style={inputStyle} value={form.ageGroup} onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}>
          {GRAD_AGE_GROUPS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <input style={inputStyle} type="number" placeholder="Year Graduated" value={form.yearGraduated} onChange={(e) => setForm({ ...form, yearGraduated: +e.target.value })} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10, marginBottom: 10 }}>
        <input style={inputStyle} placeholder="Current Club" value={form.club} onChange={(e) => setForm({ ...form, club: e.target.value })} />
        <input style={inputStyle} placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <input style={inputStyle} placeholder="Country Flag Emoji (e.g. 🇬🇭)" value={form.countryFlag} onChange={(e) => setForm({ ...form, countryFlag: e.target.value })} />
      </div>

      <textarea style={{ ...inputStyle, minHeight: 70, marginBottom: 10 }} placeholder="Short success story / bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />

      <div style={{ color: "#999", fontSize: 11, margin: "4px 0 8px", textTransform: "uppercase" }}>Career Statistics (optional)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginBottom: 10 }}>
        <input style={inputStyle} type="number" placeholder="Appearances" value={form.apps} onChange={(e) => setForm({ ...form, apps: e.target.value === "" ? "" : +e.target.value })} />
        <input style={inputStyle} type="number" placeholder="Goals" value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value === "" ? "" : +e.target.value })} />
        <input style={inputStyle} type="number" placeholder="Assists" value={form.assists} onChange={(e) => setForm({ ...form, assists: e.target.value === "" ? "" : +e.target.value })} />
      </div>

      <div style={{ color: "#999", fontSize: 11, margin: "4px 0 8px", textTransform: "uppercase" }}>Social Links (optional)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10, marginBottom: 14 }}>
        <input style={inputStyle} placeholder="Instagram URL" value={form.social.instagram} onChange={(e) => setForm({ ...form, social: { ...form.social, instagram: e.target.value } })} />
        <input style={inputStyle} placeholder="X / Twitter URL" value={form.social.twitter} onChange={(e) => setForm({ ...form, social: { ...form.social, twitter: e.target.value } })} />
        <input style={inputStyle} placeholder="TikTok URL" value={form.social.tiktok} onChange={(e) => setForm({ ...form, social: { ...form.social, tiktok: e.target.value } })} />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setForm({ ...form, recent: !form.recent })}
          style={{ ...(form.recent ? btnGold : btnGhost), fontSize: 11, padding: "8px 14px" }}
        >
          {form.recent ? "★ Recent Success Story" : "Mark As Recent Success Story"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        {editingId ? (
          <>
            <button onClick={saveEdit} style={btnGold}>Save Changes</button>
            <button onClick={cancelEdit} style={btnGhost}>Cancel</button>
          </>
        ) : (
          <button onClick={add} style={btnGold}>Add Success Story</button>
        )}
      </div>
    </AdminCard>
  );

  return (
    <div>
      <H>Success Stories</H>
      {formCard}

      <div style={{ color: "#999", fontSize: 12, margin: "20px 0 10px", textTransform: "uppercase", letterSpacing: "1px" }}>
        {orderedGraduates.length} Success Stor{orderedGraduates.length !== 1 ? "ies" : "y"} — Drag To Reorder
      </div>
      {orderedGraduates.length === 0 && (
        <AdminCard><p style={{ color: "#777", margin: 0 }}>No success stories yet. Add your first one above.</p></AdminCard>
      )}
      {orderedGraduates.map((g) => (
        <div
          key={g.id}
          draggable
          onDragStart={() => onDragStart(g.id)}
          onDragOver={(e) => onDragOver(e, g.id)}
          onDragEnd={onDragEnd}
          style={{
            ...cardBase,
            padding: 16,
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
            opacity: dragId === g.id ? 0.4 : g.visible === false ? 0.55 : 1,
            cursor: "grab",
            borderColor: dragId === g.id ? GOLD : "rgba(212,175,55,0.18)",
          }}
        >
          <div style={{ color: "#666", fontSize: 18, cursor: "grab", userSelect: "none", flexShrink: 0 }} title="Drag to reorder">⠿</div>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              flexShrink: 0,
              background: g.photo ? `url(${g.photo}) center/cover` : "#222",
              border: `1px solid ${GOLD}55`,
            }}
          />
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
              {g.name} {g.recent && <span style={{ color: GOLD, fontSize: 10, marginLeft: 6 }}>★ RECENT</span>}
              {g.featured && <span style={{ color: "#7ec8ff", fontSize: 10, marginLeft: 6 }}>⭐ FEATURED</span>}
            </div>
            <div style={{ color: "#999", fontSize: 12 }}>{g.position} · {g.ageGroup} · {g.yearGraduated}</div>
            <div style={{ color: "#777", fontSize: 11, marginTop: 2 }}>{g.club} {g.countryFlag}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button onClick={() => setFeaturedOnly(g.id)} style={{ ...(g.featured ? btnGold : btnGhost), padding: "8px 12px", fontSize: 11 }}>
              {g.featured ? "Featured" : "Set Featured"}
            </button>
            <button onClick={() => toggleField(g.id, "visible")} style={{ ...(g.visible !== false ? btnGold : btnGhost), padding: "8px 12px", fontSize: 11 }}>
              {g.visible !== false ? "Visible" : "Hidden"}
            </button>
            <button onClick={() => edit(g)} style={{ ...btnGhost, padding: "8px 12px", fontSize: 11 }}>Edit</button>
            <button onClick={() => remove(g.id)} style={{ ...btnGhost, padding: "8px 12px", fontSize: 11, color: "#ff6b6b", borderColor: "#ff6b6b88" }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================ PAGE MANAGEMENT (VISIBILITY) ============================ */
function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "14px 4px",
        borderBottom: "1px solid rgba(212,175,55,0.12)",
      }}
    >
      <div>
        <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "'Oswald',sans-serif" }}>{label}</div>
        {description && <div style={{ color: "#888", fontSize: 12, marginTop: 2 }}>{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: 50,
          height: 28,
          borderRadius: 16,
          flexShrink: 0,
          border: `1px solid ${checked ? GOLD : "#444"}`,
          background: checked ? `linear-gradient(135deg, ${GOLD_BRIGHT}, ${GOLD})` : "#222",
          position: "relative",
          cursor: "pointer",
          transition: "background 0.25s ease, border-color 0.25s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 24 : 2,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: checked ? BLACK : "#999",
            transition: "left 0.25s ease, background 0.25s ease",
          }}
        />
      </button>
    </div>
  );
}

function ManagePageVisibility({ visibility, setVisibility }) {
  const v = visibility || seedPageVisibility;
  const update = (key, val) => setVisibility({ ...v, [key]: val });

  const rows = [
    { key: "pageEnabled", label: "Display Success Stories Page", description: "Master switch — turns the entire Success Stories page on or off." },
    { key: "heroEnabled", label: "Display Hero Section", description: "Shows the \"Success Stories\" title and subtitle." },
    { key: "statsEnabled", label: "Display Statistics Section", description: "Total success stories, clubs, countries and contracts counters." },
    { key: "featuredEnabled", label: "Display Featured Success Story", description: "Large spotlight card for the success story marked as Featured." },
    { key: "timelineEnabled", label: "Display Timeline", description: "Academy → Success Story → Current Club journey for the featured profile." },
    { key: "cardsEnabled", label: "Display Success Story Profiles", description: "The full grid of individual success story cards." },
  ];

  return (
    <div>
      <H>Page Management</H>
      <AdminCard>
        <p style={{ color: "#999", fontSize: 13, marginTop: 0, marginBottom: 16 }}>
          Control what's visible on the public Success Stories page. Changes save instantly and apply immediately on the live site — no code edits or redeploys needed. Settings persist across refreshes.
        </p>
        {rows.map((r) => (
          <ToggleSwitch
            key={r.key}
            checked={v[r.key] !== false}
            onChange={(val) => update(r.key, val)}
            label={r.label}
            description={r.description}
          />
        ))}
        {!v.pageEnabled && (
          <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.3)", color: "#ff9b9b", fontSize: 12 }}>
            The Success Stories page is currently hidden from visitors. Individual section toggles below it have no effect while it's off.
          </div>
        )}
      </AdminCard>
    </div>
  );
}

/* ============================ ROOT APP ============================ */

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [players, setPlayersState] = useState(seedPlayers);
  const [coaches, setCoachesState] = useState(seedCoaches);
  const [news, setNewsState] = useState(seedNews);
  const [fixtures, setFixturesState] = useState(seedFixtures);
  const [results, setResultsState] = useState(seedResults);
  const [standings, setStandingsState] = useState(seedStandings);
  const [potm, setPotmState] = useState(seedPOTM);
  const [sponsors, setSponsorsState] = useState(seedSponsors);
  const [testimonials, setTestimonialsState] = useState(seedTestimonials);
  const [registrations, setRegistrations] = useState([]);
  const [splashBall, setSplashBallState] = useState("");
  const [slides, setSlidesState] = useState(seedSlides);
  const [carouselSettings, setCarouselSettingsState] = useState(seedCarouselSettings);
  const [graduates, setGraduatesState] = useState(seedGraduates);
  const [pageVisibility, setPageVisibilityState] = useState(seedPageVisibility);

  useEffect(() => {
    (async () => {
      setPlayersState(await loadList("bekfa:players", seedPlayers));
      setCoachesState(await loadList("bekfa:coaches", seedCoaches));
      setNewsState(await loadList("bekfa:news", seedNews));
      setFixturesState(await loadList("bekfa:fixtures", seedFixtures));
      setResultsState(await loadList("bekfa:results", seedResults));
      setStandingsState(await loadList("bekfa:standings", seedStandings));
      setPotmState(await loadList("bekfa:potm", seedPOTM));
      setSponsorsState(await loadList("bekfa:sponsors", seedSponsors));
      setTestimonialsState(await loadList("bekfa:testimonials", seedTestimonials));
      setRegistrations(await loadList("bekfa:registrations", []));
      setSlidesState(await loadList("bekfa:slides", seedSlides));
      setCarouselSettingsState(await loadList("bekfa:carouselSettings", seedCarouselSettings));
      setGraduatesState(await loadList("bekfa:graduates", seedGraduates));
      setPageVisibilityState(await loadList("bekfa:graduatesVisibility", seedPageVisibility));
      try {
        const r = await window.storage.get("bekfa:splashBall", true);
        if (r) setSplashBallState(r.value);
      } catch {
        // no custom ball set yet
      }
      setLoaded(true);
    })();
  }, []);

  const setPlayers = (v) => { setPlayersState(v); saveList("bekfa:players", v); };
  const setCoaches = (v) => { setCoachesState(v); saveList("bekfa:coaches", v); };
  const setNews = (v) => { setNewsState(v); saveList("bekfa:news", v); };
  const setFixtures = (v) => { setFixturesState(v); saveList("bekfa:fixtures", v); };
  const setResults = (v) => { setResultsState(v); saveList("bekfa:results", v); };
  const setStandings = (v) => { setStandingsState(v); saveList("bekfa:standings", v); };
  const setPotm = (v) => { setPotmState(v); saveList("bekfa:potm", v); };
  const setSponsors = (v) => { setSponsorsState(v); saveList("bekfa:sponsors", v); };
  const setTestimonials = (v) => { setTestimonialsState(v); saveList("bekfa:testimonials", v); };
  const addRegistration = (r) => { const v = [...registrations, r]; setRegistrations(v); saveList("bekfa:registrations", v); };
  const setSlides = (v) => { setSlidesState(v); saveList("bekfa:slides", v); };
  const setCarouselSettings = (v) => { setCarouselSettingsState(v); saveList("bekfa:carouselSettings", v); };
  const setGraduates = (v) => { setGraduatesState(v); saveList("bekfa:graduates", v); };
  const setPageVisibility = (v) => { setPageVisibilityState(v); saveList("bekfa:graduatesVisibility", v); };
  const setSplashBall = (v) => {
    setSplashBallState(v);
    if (v) {
      window.storage.set("bekfa:splashBall", v, true).catch((e) => console.error(e));
    } else {
      window.storage.delete("bekfa:splashBall", true).catch(() => {});
    }
  };

  const handleNav = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fontLink = (
    <link
      href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  );

  if (showSplash) {
    return (
      <>
        {fontLink}
        <SplashScreen onDone={() => setShowSplash(false)} ballImage={splashBall} />
      </>
    );
  }

  if (adminMode) {
    return (
      <>
        {fontLink}
        <AdminPanel
          data={{ players, coaches, news, fixtures, results, standings, potm, sponsors, testimonials, splashBall, slides, carouselSettings, graduates, pageVisibility }}
          setters={{ setPlayers, setCoaches, setNews, setFixtures, setResults, setStandings, setPotm, setSponsors, setTestimonials, setSplashBall, setSlides, setCarouselSettings, setGraduates, setPageVisibility }}
          registrations={registrations}
          onLogout={() => setAdminMode(false)}
        />
      </>
    );
  }

  return (
    <div style={{ background: BLACK, fontFamily: "'Inter',sans-serif" }}>
      {fontLink}
      {showLogin && (
        <AdminLogin
          onLogin={() => { setShowLogin(false); setAdminMode(true); }}
          onClose={() => setShowLogin(false)}
        />
      )}
      <Header onNav={handleNav} onAdminClick={() => setShowLogin(true)} />
      <Hero onNav={handleNav} slides={slides} settings={carouselSettings} />
      <About />
      <POTMSection potm={potm} players={players} />
      <Sponsors sponsors={sponsors} />
      <Squads players={players} />
      <Coaches coaches={coaches} />
      <Graduates graduates={graduates} pageVisibility={pageVisibility} />
      <News news={news} />
      <FixturesResults fixtures={fixtures} results={results} />
      <Standings standings={standings} />
      <Testimonials testimonials={testimonials} />
      <Register onSubmit={addRegistration} />
      <Contact />
      <Footer onAdminClick={() => setShowLogin(true)} />
    </div>
  );
}
