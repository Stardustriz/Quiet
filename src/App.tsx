import { useEffect, useRef, useState, useId, useMemo } from "react";

// Pixel-art assets
import pixelCandle from "@/assets/pixel-candle.png";
import pixelHeart from "@/assets/pixel-heart.png";
import pixelMoon from "@/assets/pixel-moon.png";
import pixelTea from "@/assets/pixel-tea.png";
import pixelCat from "@/assets/pixel-cat.png";
import pixelPlant from "@/assets/pixel-plant.png";
import pixelStars from "@/assets/pixel-stars.png";
import pixelBlanket from "@/assets/pixel-blanket.png";
import pixelSpeaker from "@/assets/pixel-speaker.png";

// Pastel Dot-Border interactive hover wrapper
import { PastelDotBorder } from "@/components/ui/pastel-dot-border";

// shadcn UI Collapsible
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

// Three.js Water Simulation
import { ThreeWaterSimulation } from "@/components/ThreeWaterSimulation";

// Ambient Rain & Thunder Atmosphere
import { RainThunderEffect } from "@/components/RainThunderEffect";

// Background Assets
import heroClouds from "@/assets/hero-clouds.png";

/* ==========================================================================
   1. ANONYMOUS LETTERS DATA & HELPER
   ========================================================================== */
export const letters: string[] = [
  "I don't know what today was like for you. But I know you're still here, reading this, and that took something. I'm glad you're here. Tomorrow doesn't have to be figured out tonight. Just rest. Just stay.",
  "You are not a burden for feeling this way. The heaviness you carry is real, and so is the part of you that keeps going anyway. Someone sat down and wrote this because they wanted you to make it through the night. Please make it through the night.",
  "There was a time I thought the dark would last forever. It didn't. It lifted slowly, quietly, the way dawn does — so gradually I almost missed it. Yours can lift too. Until then, let this little page keep you company.",
  "You don't have to earn rest, or kindness, or another chance. You already deserve all three. Whatever happened today, it doesn't get the final word on who you are.",
  "If all you did today was survive it, that is enough. Some days that is the bravest thing a person does. I'm proud of you for that, even if we never meet.",
  "The world is softer with you in it, even on the days you can't feel it. Especially on the days you can't feel it. Please stay. Drink some water. Wrap up in something warm. This feeling is a weather pattern, not a climate.",
  "You found this page because someone who loves you wanted you to have a quiet place to land. That's not nothing. That's love, doing its quiet work. Let it hold you for a minute.",
  "It's okay if tonight you can't see the point. You don't have to see it. You just have to stay until the morning, and let the morning show you. Mornings are good at that.",
  "Whatever you're carrying, you were never meant to carry it alone. There are hands — some you know, some you haven't met yet — ready to help you hold it. Let them.",
];

export function randomLetter(except?: number): number {
  if (letters.length <= 1) return 0;
  let i = Math.floor(Math.random() * letters.length);
  while (i === except) i = Math.floor(Math.random() * letters.length);
  return i;
}

/* ==========================================================================
   2. WATER POOL QUOTES & TUNABLE SETTINGS
   ========================================================================== */
const WATER_QUOTES = [
  "You are not alone tonight.",
  "This feeling will move, like water always does.",
  "Even still water is still moving underneath.",
  "You don't have to fight the current. Just float for a while.",
  "The surface will settle. Give it a minute.",
];

// Tunable Water Effect Settings
const WATER_CONFIG = {
  revealRadius: 210, // comfortable wave area
  distortionScale: 14, // gentle fluid ripple
  settleTimeMs: 2000, // ~2.0s ease-out back to still
  parallaxFactor: -0.03, // slight opposite drift
};

/* ==========================================================================
   3. EDGE-TO-EDGE FOOTER WATER REVEAL (UNIFIED THREE.JS FLUID & STILL WATER)
   ========================================================================== */
function EdgeToEdgeFooterWaterReveal({
  currentPeriod,
}: {
  currentPeriod?: TimePeriod;
}) {
  const quote = useMemo(() => {
    const idx = Math.floor(Math.random() * WATER_QUOTES.length);
    return WATER_QUOTES[idx]!;
  }, []);

  return (
    <footer id="water" className="relative flex w-full flex-col overflow-hidden border-t-2 border-[#E2D5CC] bg-[#162846] select-none">
      {/* Full-Bleed Twilight Sunset Clouds with Interactive Fluid Water Swirl on Top */}
      <div className="relative w-full overflow-hidden min-h-[500px] sm:min-h-[600px] lg:min-h-[720px] bg-[#162846]">
        {/* Subtle prompt banner cleanly positioned INSIDE the photo with NO drop shadow */}
        <div className="pointer-events-none absolute top-10 sm:top-14 inset-x-0 z-20 flex justify-center text-center px-4">
          <span className="border border-white/30 bg-[#161224]/75 px-5 py-2 text-xs font-mono font-bold tracking-wider text-[#FFFDF8] backdrop-blur-sm">
            ~ calm water · wave your cursor across the clouds to reveal the quote ~
          </span>
        </div>

        {/* 100% Full-Bleed Three.js Fluid Pool with heroClouds as background image! */}
        <ThreeWaterSimulation
          quote={quote}
          bgImageUrl={heroClouds}
          className="w-full h-[500px] sm:h-[600px] lg:h-[720px]"
        />

        {/* Bottom subtle ambient gradient for safety disclaimer text */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10" />

        {/* Dedicated Safety Disclaimer Text Rendered Directly ON TOP OF the Sunset Water Clouds */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center justify-end px-4 pb-8 sm:pb-12 text-center pointer-events-auto">
          <div className="mx-auto max-w-2xl bg-transparent p-0 text-center">
            <img
              src={pixelMoon}
              alt=""
              width={512}
              height={512}
              className="pixel-img mx-auto mb-2 h-7 w-7 sm:h-8 sm:w-8 opacity-90 select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            />
            <p className="font-['Arial',Helvetica,sans-serif] text-xs sm:text-sm md:text-[14.5px] font-medium leading-relaxed text-[#FFFDF8] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              This page is a small act of care, not a replacement for professional help.
              If you're in immediate danger, please contact your local emergency services
              right away. You matter, and help is worth reaching for.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================================================
   4. TIME-OF-DAY HERO WINDOW (GENTLE PIXELATED SURREALISM)
   ========================================================================== */
export type TimePeriod = "night" | "dawn" | "day" | "dusk";

export function getLocalPeriod(date: Date = new Date()): TimePeriod {
  const hour = date.getHours();
  if (hour >= 20 || hour < 5) return "night";
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  return "dusk"; // 17:00 to 19:59
}

/* ==========================================================================
   4. COMPACT TOP-RIGHT AUDIO CONTROL (BOX STYLING)
   ========================================================================== */
export interface AudioTrack {
  id: string;
  name: string;
  src: string;
}

export const DEFAULT_TRACKS: AudioTrack[] = [
  { id: "song-1", name: "Song 1", src: "/audio/1.mp3" },
  { id: "song-2", name: "Song 2", src: "/audio/2.mp3" },
  { id: "song-3", name: "Song 3", src: "/audio/3.mp3" },
  { id: "ambient", name: "Sanctuary Ambient", src: "/audio/ambient-loop.mp3" },
  { id: "rain", name: "Gentle Rain", src: "/audio/rain.mp3" },
];

function StickySanctuaryNavbar({
  activeTrack,
  tracks,
  currentTrackId,
  playing,
  togglePlay,
  switchTrack,
  volume,
  setVolume,
  muted,
  setMuted,
  handleCustomFileUpload,
  fileInputRef,
  loadError,
  rainEnabled,
  setRainEnabled,
}: {
  activeTrack: AudioTrack;
  tracks: AudioTrack[];
  currentTrackId: string;
  playing: boolean;
  togglePlay: () => void;
  switchTrack: (id: string) => void;
  volume: number;
  setVolume: (v: number) => void;
  muted: boolean;
  setMuted: (m: boolean) => void;
  handleCustomFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  loadError: string | null;
  rainEnabled: boolean;
  setRainEnabled: (r: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    if (expanded) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#E2DACF] bg-[#FAF7F2]/95 backdrop-blur-md shadow-xs select-none">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-8">
        {/* Left: Branding Logo (plm. inspired) */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 group cursor-pointer text-left"
          title="Scroll to top"
        >
          <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#3A332B] group-hover:text-[#D48B76] transition-colors">
            quiet<span className="text-[#D48B76]">.</span>
          </span>
          <span className="hidden sm:inline-block border border-[#E2DACF] bg-[#FAF6EF] px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#766E63]">
            sanctuary
          </span>
        </button>

        {/* Center: Quick Jump Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 font-mono text-xs font-bold uppercase tracking-wider text-[#766E63]">
          <button
            onClick={() => scrollToSection("letter")}
            className="hover:text-[#3A332B] transition-colors cursor-pointer"
          >
            Letter
          </button>
          <button
            onClick={() => scrollToSection("comforts")}
            className="hover:text-[#3A332B] transition-colors cursor-pointer"
          >
            Comforts
          </button>
          <button
            onClick={() => scrollToSection("exercises")}
            className="hover:text-[#3A332B] transition-colors cursor-pointer"
          >
            Exercises
          </button>
          <button
            onClick={() => scrollToSection("resources")}
            className="hover:text-[#3A332B] transition-colors cursor-pointer"
          >
            Quiet
          </button>
          <button
            onClick={() => scrollToSection("crisis")}
            className="hover:text-[#3A332B] transition-colors cursor-pointer"
          >
            Help
          </button>
          <button
            onClick={() => scrollToSection("water")}
            className="hover:text-[#3A332B] transition-colors cursor-pointer"
          >
            Water
          </button>
        </nav>

        {/* Right: Audio Controller (Matching plm pill button with pink dot) */}
        <div ref={containerRef} className="relative flex items-center gap-2">
          {/* Quick 1, 2, 3 Song Switchers */}
          <div className="hidden sm:flex items-center border border-[#E2DACF] bg-[#FAF6EF] p-0.5">
            {tracks.slice(0, 3).map((t, idx) => (
              <button
                key={t.id}
                onClick={() => switchTrack(t.id)}
                className={`px-2 py-0.5 text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                  currentTrackId === t.id
                    ? "bg-[#D8E2D3] text-[#384234]"
                    : "text-[#766E63] hover:text-[#3A332B]"
                }`}
                title={`Switch to ${t.name}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Audio Action Button with Pink Dot */}
          <PastelDotBorder className="rounded-none">
            <button
              onClick={togglePlay}
              className="inline-flex items-center gap-2 rounded-none border-2 border-[#E2DACF] bg-[#FAF7F2] px-3.5 py-1.5 shadow-2xs transition-all hover:bg-[#FCD7D3] cursor-pointer active:scale-95"
              title={playing ? "Pause music" : "Play music"}
            >
              <span
                className={`h-2.5 w-2.5 rounded-none transition-colors ${
                  playing ? "bg-[#8DA382] animate-pulse" : "bg-[#F4A69D]"
                }`}
              />
              <span className="font-heading text-xs font-bold text-[#3A332B]">
                {playing ? activeTrack.name : "Play Song"}
              </span>
            </button>
          </PastelDotBorder>

          {/* Rain & Thunder Toggle Button */}
          <PastelDotBorder className="rounded-none">
            <button
              onClick={() => setRainEnabled(!rainEnabled)}
              className={`inline-flex items-center gap-1.5 rounded-none border-2 border-[#E2DACF] px-2.5 sm:px-3 py-1.5 shadow-2xs transition-all cursor-pointer active:scale-95 ${
                rainEnabled
                  ? "bg-[#EAE2F0] text-[#3B2844] hover:bg-[#F2D6DC]"
                  : "bg-[#FAF7F2] text-[#766E63] hover:bg-[#EAE2F0]"
              }`}
              title={rainEnabled ? "Turn off rain & thunder" : "Turn on rain & thunder"}
            >
              <span className="text-xs">🌧️</span>
              <span className="font-heading text-xs font-bold">
                {rainEnabled ? "Rain ON" : "Rain OFF"}
              </span>
            </button>
          </PastelDotBorder>

          {/* Dropdown Options Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-none border-2 border-[#E2DACF] bg-[#FAF7F2] px-2 py-1.5 text-xs font-bold text-[#766E63] hover:bg-[#EAE3D8] hover:text-[#3A332B] cursor-pointer"
            title="Audio settings"
          >
            ▾
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-none border-2 border-[#E2DACF] bg-[#FAF7F2] px-2.5 py-1.5 text-xs font-bold text-[#4A4238]"
            title="Toggle navigation"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

          {/* Expanded Audio Settings Popover */}
          {expanded && (
            <div className="absolute right-0 top-12 z-50 flex w-72 flex-col gap-3 rounded-none border-2 border-[#E2DACF] bg-[#FAF6EF] p-4 shadow-lg backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#E2DACF] pb-2">
                <span className="font-heading text-xs font-bold text-[#3A332B]">
                  Audio Sanctuary
                </span>
                <button
                  onClick={() => setExpanded(false)}
                  className="text-xs font-bold text-[#766E63] hover:text-[#3A332B] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Tracks List */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#766E63]">
                  Select Track:
                </span>
                {tracks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => switchTrack(t.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 text-left text-xs font-medium transition-colors cursor-pointer ${
                      currentTrackId === t.id
                        ? "bg-[#D8E2D3] font-bold text-[#384234]"
                        : "text-[#4A4238] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    <span>{t.name}</span>
                    {currentTrackId === t.id && playing && (
                      <span className="text-[10px] font-mono text-[#384234]">▶ playing</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 border-t border-[#E2DACF] pt-2">
                <span className="text-[10px] font-mono font-bold text-[#766E63]">VOL</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (muted) setMuted(false);
                  }}
                  className="h-1.5 flex-1 accent-[#3A332B] cursor-pointer"
                />
                <button
                  onClick={() => setMuted(!muted)}
                  className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase border border-[#E2DACF] bg-[#FAF7F2] cursor-pointer"
                >
                  {muted ? "unmute" : "mute"}
                </button>
              </div>

              {/* Custom Song Upload */}
              <div className="border-t border-[#E2DACF] pt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleCustomFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-dashed border-[#E2DACF] bg-[#FAF7F2] py-1 text-[11px] font-mono text-[#766E63] hover:bg-[#FAF6EF] cursor-pointer"
                >
                  + upload your own audio file
                </button>
              </div>

              {loadError && (
                <p className="text-[10px] text-[#D48B76]">
                  Couldn't play track. Click to retry.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t-2 border-[#E2DACF] bg-[#FAF7F2] px-6 py-4 md:hidden">
          <div className="grid grid-cols-2 gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#766E63]">
            <button
              onClick={() => scrollToSection("letter")}
              className="border border-[#E2DACF] bg-[#FAF6EF] p-2 text-left hover:bg-[#FAF7F2] cursor-pointer"
            >
              1. Letter
            </button>
            <button
              onClick={() => scrollToSection("comforts")}
              className="border border-[#E2DACF] bg-[#FAF6EF] p-2 text-left hover:bg-[#FAF7F2] cursor-pointer"
            >
              2. Comforts
            </button>
            <button
              onClick={() => scrollToSection("exercises")}
              className="border border-[#E2DACF] bg-[#FAF6EF] p-2 text-left hover:bg-[#FAF7F2] cursor-pointer"
            >
              3. Exercises
            </button>
            <button
              onClick={() => scrollToSection("crisis")}
              className="border border-[#E2DACF] bg-[#FAF6EF] p-2 text-left hover:bg-[#FAF7F2] cursor-pointer"
            >
              4. Crisis Help
            </button>
            <button
              onClick={() => scrollToSection("resources")}
              className="border border-[#E2DACF] bg-[#FAF6EF] p-2 text-left hover:bg-[#FAF7F2] cursor-pointer"
            >
              5. Quiet Places
            </button>
            <button
              onClick={() => scrollToSection("water")}
              className="border border-[#E2DACF] bg-[#FAF6EF] p-2 text-left hover:bg-[#FAF7F2] cursor-pointer"
            >
              6. Water Pool
            </button>
            <button
              onClick={() => setRainEnabled(!rainEnabled)}
              className={`col-span-2 border border-[#E2DACF] p-2 text-left font-bold cursor-pointer transition-colors ${
                rainEnabled ? "bg-[#EAE2F0] text-[#3B2844]" : "bg-[#FAF6EF] text-[#766E63]"
              }`}
            >
              🌧️ Rain & Thunder: {rainEnabled ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ==========================================================================
   6. GENTLE EXERCISES (BOX BUTTONS)
   ========================================================================== */
const BREATH_PHASES = [
  { label: "breathe in…", seconds: 4 },
  { label: "hold, gently…", seconds: 4 },
  { label: "and let it go…", seconds: 6 },
] as const;

function InlineBreathingExercise() {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    const current = BREATH_PHASES[phaseIdx];
    if (current && tick >= current.seconds) {
      setTick(0);
      setPhaseIdx((i) => (i + 1) % BREATH_PHASES.length);
    }
  }, [tick, phaseIdx]);

  const phase = BREATH_PHASES[phaseIdx] ?? BREATH_PHASES[0]!;

  return (
    <div className="dither relative flex flex-col justify-between overflow-hidden border-2 border-[#E2DACF] bg-[#DCD3E8]/60 p-7 text-center rounded-none sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#433952]/85 mb-4">
          rhythmic box breath
        </p>
        <div className="relative mx-auto flex h-36 w-36 items-center justify-center sm:h-40 sm:w-40">
          <div
            className="absolute inset-0 rounded-none bg-[#EAC9C4]/60 transition-transform ease-in-out"
            style={{
              transitionDuration: `${phase.seconds}s`,
              transform:
                running && phaseIdx === 0
                  ? "scale(1)"
                  : running && phaseIdx === 1
                    ? "scale(1)"
                    : "scale(0.55)",
            }}
          />
          <div className="relative flex h-22 w-22 items-center justify-center rounded-none border-2 border-[#E2DACF] bg-[#FAF7F2] text-xs font-bold text-[#766E63] shadow-xs">
            {running ? `${phase.seconds - tick}s` : "ready"}
          </div>
        </div>
        <p className="mt-5 text-base font-semibold text-[#433952]">
          {running ? phase.label : "A slow breathing exercise, if your chest feels tight."}
        </p>
      </div>

      <div className="mt-6">
        <PastelDotBorder className="rounded-none inline-block">
          <button
            onClick={() => {
              setRunning((r) => !r);
              setTick(0);
              setPhaseIdx(0);
            }}
            className="rounded-none border-2 border-[#E2DACF] bg-[#FAF7F2] px-6 py-2.5 text-xs font-bold text-[#4A4238] shadow-xs transition-colors hover:bg-[#EAC9C4]"
          >
            {running ? "that's enough" : "breathe with me"}
          </button>
        </PastelDotBorder>
      </div>
    </div>
  );
}

const GROUNDING_STEPS = [
  { count: "5", prompt: "things you can see around you, right now" },
  { count: "4", prompt: "things you can physically feel — the chair, your feet, fabric" },
  { count: "3", prompt: "sounds you can hear, near or far" },
  { count: "2", prompt: "things you can smell, or two smells you love" },
  { count: "1", prompt: "slow, deep breath — just for you" },
];

function InlineGroundingExercise() {
  const [step, setStep] = useState(0);
  const done = step >= GROUNDING_STEPS.length;

  return (
    <div className="dither relative flex flex-col justify-between overflow-hidden border-2 border-[#E2DACF] bg-[#D8E2D3]/60 p-7 text-center rounded-none sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#384234]/85 mb-4">
          the 5 · 4 · 3 · 2 · 1 grounding
        </p>
        {!done ? (
          <>
            <p className="font-letter mt-6 min-h-[90px] text-3xl leading-snug text-[#4A4238] sm:text-4xl">
              Name {GROUNDING_STEPS[step]!.count} {GROUNDING_STEPS[step]!.prompt}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2.5">
              {GROUNDING_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-2.5 w-8 rounded-none transition-colors ${
                    i < step ? "bg-[#4A4238]/50" : i === step ? "bg-[#4A4238]/90 ring-1 ring-[#4A4238]" : "bg-[#E2DACF]"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="py-6">
            <p className="font-letter text-3xl leading-snug text-[#4A4238] sm:text-4xl">
              You're here. You did it. That's the whole exercise.
            </p>
            <p className="mt-3 text-xs text-[#384234]">
              Take your time before moving on.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <PastelDotBorder className="rounded-none inline-block">
          <button
            onClick={() => setStep(done ? 0 : (s) => s + 1)}
            className="rounded-none border-2 border-[#E2DACF] bg-[#FAF7F2] px-6 py-2.5 text-xs font-bold text-[#4A4238] shadow-xs transition-colors hover:bg-[#EAC9C4]"
          >
            {done ? "go again" : step === GROUNDING_STEPS.length - 1 ? "finish" : "next one"}
          </button>
        </PastelDotBorder>
      </div>
    </div>
  );
}

/* ==========================================================================
   7. RESOURCES & COMFORTS DATA
   ========================================================================== */
const crisisResources = [
  {
    name: "988 Suicide & Crisis Lifeline",
    location: "United States & Canada",
    detail: "Call or text 988 — free, confidential, 24/7. A real person listens.",
    href: "https://988lifeline.org",
    actions: [
      { label: "Call 988", href: "tel:988" },
      { label: "Text 988", href: "sms:988" },
    ],
  },
  {
    name: "Crisis Text Line",
    location: "US, UK, Canada, Ireland",
    detail: "Text HOME to 741741 — free crisis counseling via SMS, 24/7.",
    href: "https://www.crisistextline.org",
    actions: [{ label: "Text HOME to 741741", href: "sms:741741?body=HOME" }],
  },
  {
    name: "Find A Helpline",
    location: "Global Directory",
    detail:
      "Free, confidential support lines in 175+ countries. Find help right where you are.",
    href: "https://findahelpline.com",
    actions: [{ label: "Find help worldwide", href: "https://findahelpline.com" }],
  },
];

const quietResources = [
  {
    name: "Reasons to Stay",
    detail: "More anonymous letters of encouragement from people who made it through.",
    href: "https://reasonstostay.org",
  },
  {
    name: "7 Cups",
    detail: "Chat with a trained volunteer listener, any hour.",
    href: "https://www.7cups.com",
  },
  {
    name: "A Soft Murmur",
    detail: "Gentle ambient sounds — rain, fire, wind — to sit with.",
    href: "https://asoftmurmur.com",
  },
  {
    name: "myNoise",
    detail: "Deep library of calming background soundscapes, tunable by ear.",
    href: "https://mynoise.net",
  },
];

const tinyComforts = [
  { icon: pixelTea, title: "Warm Drink", text: "Make a warm drink. Hold the mug with both hands." },
  { icon: pixelBlanket, title: "Soft Fabric", text: "Wrap up in the softest thing you own right now." },
  { icon: pixelMoon, title: "Night Air", text: "Step outside for one minute. Just look at the sky." },
  { icon: pixelPlant, title: "Glass of Water", text: "Drink a tall glass of cool water, very slowly." },
  { icon: pixelCat, title: "Five Minutes", text: "Lie down somewhere comfortable. No phone. Just breathe." },
  { icon: pixelStars, title: "Honest Word", text: "Text one person one honest sentence. That's all." },
];

function PixelDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      aria-hidden
      className={`mx-auto flex max-w-4xl items-center justify-center gap-6 py-10 opacity-75 ${
        flip ? "flex-row-reverse" : ""
      }`}
    >
      <span className="h-0.5 flex-1 bg-[#E2D5CC]" />
      <span className="h-2.5 w-2.5 rounded-none bg-[#F4ACB7]" />
      <span className="h-2.5 w-2.5 rounded-none bg-[#D4C3E4]" />
      <span className="h-2.5 w-2.5 rounded-none bg-[#F7D5C4]" />
      <span className="h-0.5 flex-1 bg-[#E2D5CC]" />
    </div>
  );
}

/* ==========================================================================
   8. MAIN SINGLE-PAGE COMPONENT (ARCHITECTURAL ROOM FRAMING & BALANCED WIDTHS)
   ========================================================================== */
export default function App() {
  const [letterIdx, setLetterIdx] = useState(() => randomLetter());
  const [currentPeriod, setCurrentPeriod] = useState<TimePeriod>(() => getLocalPeriod());
  const [showExercises, setShowExercises] = useState(false);
  const [rainEnabled, setRainEnabled] = useState(true);

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tracks, setTracks] = useState<AudioTrack[]>(DEFAULT_TRACKS);
  const [currentTrackId, setCurrentTrackId] = useState<string>("song-1");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.55);
  const [loadError, setLoadError] = useState<string | null>(null);

  const activeTrack = tracks.find((t) => t.id === currentTrackId) ?? tracks[0]!;

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = volume;
    audio.muted = muted;
    audioRef.current = audio;

    const handleError = () => {
      setLoadError(activeTrack.src);
      setPlaying(false);
    };
    const handleCanPlay = () => setLoadError(null);

    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);
    audio.src = activeTrack.src;

    // Silent listener: first interaction starts audio automatically
    const handleFirstGesture = () => {
      if (audioRef.current && !playing) {
        audioRef.current
          .play()
          .then(() => setPlaying(true))
          .catch(() => {});
      }
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
    };

    window.addEventListener("click", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });
    window.addEventListener("touchstart", handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchTrack = (newTrackId: string) => {
    setCurrentTrackId(newTrackId);
    setLoadError(null);
    const target = tracks.find((t) => t.id === newTrackId);
    if (!target || !audioRef.current) return;

    const audio = audioRef.current;
    const wasPlaying = playing;
    audio.src = target.src;
    audio.load();

    if (wasPlaying) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          setLoadError(target.src);
          setPlaying(false);
        });
    }
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setPlaying(true);
          setLoadError(null);
        })
        .catch(() => {
          setLoadError(activeTrack.src);
          setPlaying(false);
        });
    }
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const customTrack: AudioTrack = {
      id: `local-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ""),
      src: fileUrl,
    };

    setTracks((prev) => [customTrack, ...prev]);
    setCurrentTrackId(customTrack.id);
    setLoadError(null);

    if (audioRef.current) {
      audioRef.current.src = fileUrl;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  useEffect(() => {
    const updateTime = () => {
      setCurrentPeriod(getLocalPeriod());
    };
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAF6F2] text-[#3D2F3A] selection:bg-[#F4ACB7]/40 selection:text-[#3D2F3A]">
      {/* Ambient Rain & Thunder Atmosphere Overlay */}
      <RainThunderEffect enabled={rainEnabled} />

      {/* Subtle ambient wallpaper dither texture */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(#4A3E48_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035]" />

      {/* Twilight Sunset Atmospheric Warm Glows */}
      <div className="pointer-events-none fixed -left-44 top-1/4 h-[600px] w-[600px] rounded-none bg-[#D4A3C2]/20 blur-3xl" />
      <div className="pointer-events-none fixed -right-44 top-1/3 h-[600px] w-[600px] rounded-none bg-[#F6A28E]/18 blur-3xl" />
      <div className="pointer-events-none fixed left-1/3 bottom-1/4 h-[500px] w-[500px] rounded-none bg-[#9A89B4]/15 blur-3xl" />

      {/* 1. Sticky Editorial Top Navbar with plm. Branding & Quick Navigation */}
      <StickySanctuaryNavbar
        activeTrack={activeTrack}
        tracks={tracks}
        currentTrackId={currentTrackId}
        playing={playing}
        togglePlay={togglePlay}
        switchTrack={switchTrack}
        volume={volume}
        setVolume={setVolume}
        muted={muted}
        setMuted={setMuted}
        handleCustomFileUpload={handleCustomFileUpload}
        fileInputRef={fileInputRef}
        loadError={loadError}
        rainEnabled={rainEnabled}
        setRainEnabled={setRainEnabled}
      />

      {/* Full-bleed Hero Section with Looping Ambient Video & Editorial Typography */}
      <section
        id="top"
        className="relative w-full overflow-hidden border-b-2 border-[#E2DACF] animate-in fade-in slide-in-from-bottom-3 duration-700"
      >
        {/* Ambient Looping Video Background - Edge-to-Edge Full Screen Width */}
        <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
          <video
            playsInline
            loop
            muted
            autoPlay
            className="h-full w-full object-cover object-center pointer-events-none select-none"
          >
            <source src="/video-1.mov" type="video/mp4" />
            <source src="/Video 1.mov" type="video/quicktime" />
          </video>
          {/* Subtle twilight tint for text legibility + bottom blend to page */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C1535]/35 via-transparent via-40% to-black/30" />
        </div>

        {/* Centered Content Container - Unobstructed view of the person in the video */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-10 sm:px-8 sm:pt-14 sm:pb-36 md:pb-44">
          <div className="mx-auto w-full text-center">
            
            {/* 1. Top Highlight Tape with playful stickers (plm-inspired) */}
            <div className="relative inline-block mb-2.5 sm:mb-4">
              {/* Significantly Enlarged Floating Heart Sticker */}
              <div className="animate-dream-float pointer-events-none absolute -left-8 -top-8 sm:-left-12 sm:-top-12">
                <img
                  src={pixelHeart}
                  alt=""
                  className="pixel-img h-14 w-14 sm:h-18 sm:w-18 md:h-20 md:w-20 drop-shadow-xl"
                />
              </div>
              <div className="pointer-events-none absolute -right-6 -top-5 sm:-right-8 sm:-top-6">
                <span className="inline-flex items-center gap-1 border-2 border-[#1E1915]/20 bg-[#FAF6F2] px-3 py-1 text-xs font-mono font-bold text-[#1E1915] shadow-xs select-none">
                  💬 <span>safe space</span>
                </span>
              </div>

              {/* Wide Pink Highlighter Tape Banner */}
              <div className="relative inline-block px-6 py-1.5 sm:px-10 sm:py-2">
                <span className="absolute inset-x-0 bottom-1 top-1.5 -z-10 bg-[#FCD8D4] -rotate-1 rounded-none shadow-xs" />
                <span className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#1E1915]">
                  Sojourn
                </span>
              </div>
            </div>

            {/* 2. Main Headline in Bold Arial with Pixel Star */}
            <div className="w-full">
              <h1 className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 font-['Arial',Helvetica,sans-serif] text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[82px] font-bold leading-[1.08] tracking-tight text-[#FFFDF8]">
                <span>A quiet place to stay</span>
                {/* Visible Pixel Stars Element */}
                <span className="inline-flex items-center justify-center select-none align-middle">
                  <img
                    src={pixelStars}
                    alt=""
                    className="pixel-img h-8 w-8 sm:h-10 sm:w-10 select-none animate-twinkle-slow"
                  />
                </span>
              </h1>
            </div>

            {/* 3. Badge positioned below headline */}
            <div className="mt-3 sm:mt-4 flex flex-col items-center">
              <div className="w-full flex justify-center">
                <div className="border-2 border-[#A290B0] bg-[#EAE2F0] px-4 py-2 sm:px-5 sm:py-2 text-center shadow-sm">
                  <div className="text-[10px] sm:text-xs font-mono font-black leading-tight tracking-wider text-[#31203E] uppercase">
                    WHERE NIGHTS GET SOFTER
                  </div>
                  <div className="text-[10px] sm:text-xs font-mono font-black leading-tight tracking-wider text-[#31203E] uppercase">
                    & YOU DON'T HAVE TO CARRY IT ALONE
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Subtitle in Medium Arial (No Drop Shadow) */}
            <p className="mt-4 sm:mt-5 font-['Arial',Helvetica,sans-serif] text-sm sm:text-base md:text-lg font-medium text-[#FFFDF8]/90 leading-relaxed max-w-2xl mx-auto">
              Someone who cares about you keeps this little page. Sit a while.
            </p>
          </div>
        </div>

        {/* 7. Bottom Sunset Twilight Marquee Ribbon (Opaque, High-Contrast, Zero bleed-through) */}
        <div className="relative z-20 w-full overflow-hidden border-y-2 border-[#E2DACF] bg-[#FAF6F2] py-3.5 select-none shadow-xs">
          <div className="animate-marquee whitespace-nowrap text-xs font-mono font-bold uppercase tracking-widest text-[#31203E]">
            <span className="mx-4">MAKING NIGHTS GENTLER</span>
            <span className="mx-2 text-[#C4879C]">✦</span>
            <span className="mx-4">YOU DON'T HAVE TO CARRY IT ALONE</span>
            <span className="mx-2 text-[#C4879C]">✦</span>
            <span className="mx-4">TAKE YOUR TIME</span>
            <span className="mx-2 text-[#C4879C]">✦</span>
            <span className="mx-4">JUST BREATHE</span>
            <span className="mx-2 text-[#C4879C]">✦</span>
            <span className="mx-4">YOU ARE NOT A BURDEN</span>
            <span className="mx-2 text-[#C4879C]">✦</span>
            <span className="mx-4">YOU'VE SURVIVED 100% OF YOUR HARD NIGHTS</span>
            <span className="mx-2 text-[#C4879C]">✦</span>
            <span className="mx-4">SOMEONE WHO CARES KEEPS THIS ROOM</span>
            <span className="mx-2 text-[#C4879C]">✦</span>
            <span className="mx-4">MAKING NIGHTS GENTLER</span>
            <span className="mx-2 text-[#C4879C]">✦</span>
            <span className="mx-4">YOU DON'T HAVE TO CARRY IT ALONE</span>
            <span className="mx-2 text-[#C4879C]">✦</span>
            <span className="mx-4">TAKE YOUR TIME</span>
            <span className="mx-2 text-[#C4879C]">✦</span>
            <span className="mx-4">JUST BREATHE</span>
            <span className="mx-2 text-[#C4879C]">✦</span>
            <span className="mx-4">YOU ARE NOT A BURDEN</span>
            <span className="mx-2 text-[#C4879C]">✦</span>
            <span className="mx-4">YOU'VE SURVIVED 100% OF YOUR HARD NIGHTS</span>
            <span className="mx-2 text-[#C4879C]">✦</span>
            <span className="mx-4">SOMEONE WHO CARES KEEPS THIS ROOM</span>
            <span className="mx-2 text-[#C4879C]">✦</span>
          </div>
        </div>
      </section>

      {/* Main Sanctuary Page Container (Seamless Full-Width with Zero Side Edges) */}
      <main className="relative z-10 w-full pt-4">
        {/* The Handwritten Encouragement Letter (Positioned Downward, Above Comforts) */}
        <section
          id="letter"
          className="scroll-mt-20 px-6 py-10 sm:px-10 sm:py-14 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div className="relative z-10 mx-auto max-w-3xl lg:max-w-4xl">
            {/* Dreamy soft warm aura behind the letter */}
            <div className="animate-dream-halo pointer-events-none absolute -inset-6 rounded-none bg-radial from-[#F4B4C0]/25 via-[#D6C4E6]/20 to-transparent blur-3xl" />

            {/* Whimsical slow dust motes drifting near letter */}
            <div className="animate-dream-mote-1 pointer-events-none absolute -left-4 top-12 h-2.5 w-2.5 rounded-none bg-[#D4C3E4]/85 blur-[0.5px]" />
            <div className="animate-dream-mote-2 pointer-events-none absolute -right-4 top-16 h-2.5 w-2.5 rounded-none bg-[#F4ACB7]/85 blur-[0.5px]" />

            <div className="dither relative border-2 border-[#E5D7D0] bg-[#FFFDFB]/95 backdrop-blur-md p-8 shadow-xl sm:p-12 lg:p-14 rounded-none">
              {/* Top stationery bar: stamps & pixel heart */}
              <div className="mb-6 flex items-center justify-between border-b-2 border-[#E5D7D0]/70 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="animate-celestial">
                    <img
                      src={pixelHeart}
                      alt=""
                      width={512}
                      height={512}
                      className="pixel-img h-8 w-8 sm:h-9 sm:w-9 drop-shadow-[0_2px_8px_rgba(244,172,183,0.65)]"
                    />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6E5D68] font-mono">
                    letter from the quiet room
                  </span>
                </div>
                <span className="hidden sm:inline-block border border-dashed border-[#D48B76]/50 bg-[#FAF6F2] px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-[#D48B76] font-mono select-none">
                  airmail · to you
                </span>
              </div>

              {/* Letter Content with smooth transition */}
              <p
                key={letterIdx}
                className="font-letter text-2xl font-normal leading-relaxed text-[#3D2F3A] sm:text-3xl md:text-[34px] md:leading-[1.7] animate-in fade-in-0 zoom-in-95 duration-500"
              >
                {letters[letterIdx]}
              </p>

              {/* Bottom footer row */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t-2 border-[#E5D7D0]/70 pt-5">
                <span className="font-serif italic text-xs text-[#6E5D68]">
                  — someone who stayed
                </span>
                {/* Box-shaped "read another" button */}
                <PastelDotBorder className="rounded-none">
                  <button
                    onClick={() => setLetterIdx((i) => randomLetter(i))}
                    className="rounded-none border-2 border-[#DAC9DF] bg-[#EAE2F0] px-5 py-2 text-xs font-bold text-[#3B2844] transition-colors hover:bg-[#F4DCE2] focus:outline-hidden active:scale-95 cursor-pointer"
                  >
                    read another letter
                  </button>
                </PastelDotBorder>
              </div>
            </div>
          </div>
        </section>

        <PixelDivider />

        {/* 4. Tiny Things to Try Tonight (Expanded 3-Column Grid) */}
        <section id="comforts" className="scroll-mt-20 px-6 py-10 sm:px-10 sm:py-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 flex items-center gap-3.5">
              <img
                src={pixelCat}
                alt=""
                width={512}
                height={512}
                className="pixel-img h-12 w-12 sm:h-14 sm:w-14 shrink-0"
              />
              <div>
                <h2 className="font-heading text-2xl font-semibold text-[#4A4238] sm:text-3xl">
                  Tiny things to try tonight
                </h2>
                <p className="mt-1 font-serif text-sm leading-relaxed text-[#766E63] sm:text-[15px]">
                  None of these fix anything. They're just small kindnesses you can
                  do for the body that's carrying you.
                </p>
              </div>
            </div>

            {/* 3 Columns on desktop to fill wide edges */}
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tinyComforts.map((c) => (
                <li
                  key={c.title}
                  className="flex flex-col justify-between rounded-none border-2 border-[#E7DDD5] bg-gradient-to-br from-[#FFFDFB] to-[#FAF2ED] p-5 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-[#D6AAB8] hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={c.icon}
                      alt=""
                      width={512}
                      height={512}
                      className="pixel-img h-13 w-13 shrink-0 select-none drop-shadow-xs"
                    />
                    <div>
                      <h3 className="font-heading text-base font-semibold text-[#3D2F3A]">
                        {c.title}
                      </h3>
                      <p className="mt-1 font-serif text-xs font-normal leading-relaxed text-[#6E5D68] sm:text-[13px]">
                        {c.text}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. Exercises Section ("If everything feels too loud", shadcn Collapsible) */}
        <section id="exercises" className="scroll-mt-20 px-6 py-6 sm:px-10 sm:py-8">
          <div className="mx-auto max-w-5xl">
            <Collapsible open={showExercises} onOpenChange={setShowExercises}>
              <div className="rounded-none border-2 border-[#E5D7CE] bg-gradient-to-br from-[#FAF3EE] via-[#F7EDF4] to-[#FAF3EE] p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={pixelBlanket}
                      alt=""
                      width={512}
                      height={512}
                      className="pixel-img h-12 w-12 sm:h-14 sm:w-14"
                    />
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-[#3D2F3A] sm:text-xl">
                        If everything feels too loud
                      </h3>
                      <p className="font-serif text-xs text-[#6E5D68] sm:text-sm">
                        Two slow exercises to do with your hands and breath
                      </p>
                    </div>
                  </div>
                  {/* Box button with shadcn CollapsibleTrigger */}
                  <PastelDotBorder className="rounded-none">
                    <CollapsibleTrigger asChild>
                      <button
                        className="rounded-none border-2 border-[#E0D0C6] bg-[#FFFDFB] px-5 py-2.5 text-xs font-bold text-[#3D2F3A] shadow-2xs transition-colors hover:bg-[#F4DCE2] cursor-pointer active:scale-95"
                      >
                        {showExercises ? "hide exercises" : "open exercises"}
                      </button>
                    </CollapsibleTrigger>
                  </PastelDotBorder>
                </div>

                <CollapsibleContent className="collapsible-animated overflow-hidden">
                  <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-6 border-t-2 border-[#E5D7CE] pt-7">
                    <InlineBreathingExercise />
                    <InlineGroundingExercise />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>
        </section>

        <PixelDivider flip />

        {/* 6. Quiet Resources (4-Column Desktop Grid) - Positioned at upper side */}
        <section id="resources" className="scroll-mt-20 px-6 py-10 sm:px-10 sm:py-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 flex items-center gap-3.5">
              <img
                src={pixelTea}
                alt=""
                width={512}
                height={512}
                className="pixel-img h-12 w-12 sm:h-14 sm:w-14 shrink-0"
              />
              <div>
                <h2 className="font-heading text-2xl font-semibold text-[#3D2F3A] sm:text-3xl">
                  For when you just need some quiet
                </h2>
                <p className="mt-1 font-serif text-sm leading-relaxed text-[#6E5D68] sm:text-[15px]">
                  Calmer corners of the internet to rest with.
                </p>
              </div>
            </div>

            {/* 4 Columns on desktop with matching full height */}
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 items-stretch">
              {quietResources.map((r) => (
                <li key={r.name} className="flex h-full">
                  <PastelDotBorder className="rounded-none w-full h-full flex flex-col flex-1">
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-full w-full flex-1 flex-col justify-between rounded-none border-2 border-[#DAC9DF] bg-gradient-to-br from-[#EDE4F3] to-[#F7EEF2] p-5 shadow-2xs transition-all duration-200 hover:border-[#C7B2CF] hover:bg-gradient-to-br hover:from-[#F3E8F7] hover:to-[#F8E8EE]"
                    >
                      <div>
                        <span className="block font-heading text-base font-bold text-[#3B2844]">
                          {r.name} ↗
                        </span>
                        <span className="mt-2 block font-serif text-xs leading-relaxed text-[#3D2F3A]/85">
                          {r.detail}
                        </span>
                      </div>
                      <span className="mt-6 block text-[10px] font-bold uppercase tracking-widest text-[#584260] font-mono">
                        open sanctuary ↗
                      </span>
                    </a>
                  </PastelDotBorder>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <PixelDivider />

        {/* 7. Crisis Resources (3-Column Desktop Grid) - Positioned at bottom */}
        <section id="crisis" className="scroll-mt-20 px-6 py-10 sm:px-10 sm:py-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 flex items-center gap-3.5">
              <img
                src={pixelCandle}
                alt=""
                width={512}
                height={512}
                className={`pixel-img h-12 w-12 sm:h-14 sm:w-14 shrink-0 ${
                  currentPeriod === "night" ? "animate-flicker" : ""
                }`}
              />
              <div>
                <h2 className="font-heading text-2xl font-semibold text-[#3D2F3A] sm:text-3xl">
                  If you need to talk right now
                </h2>
                <p className="mt-1 font-serif text-sm leading-relaxed text-[#6E5D68] sm:text-[15px]">
                  These are free, confidential, and answered by humans. No
                  appointment, no explaining yourself first.
                </p>
              </div>
            </div>

            {/* 3 Columns on desktop */}
            <ul className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              {crisisResources.map((r) => (
                <li key={r.name} className="flex">
                  <div className="flex w-full flex-col justify-between rounded-none border-2 border-[#DFCED8] bg-gradient-to-br from-[#F5EAE6] to-[#EFE1EB] p-6 shadow-2xs transition-all duration-200 hover:border-[#CBAFB9] hover:bg-gradient-to-br hover:from-[#F7ECE8] hover:to-[#F4E6EF]">
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A4555] font-mono">
                          {r.location}
                        </span>
                      </div>
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block font-heading text-lg font-bold text-[#3D2B3B] underline-offset-4 hover:underline"
                      >
                        {r.name}
                      </a>
                      <p className="mt-2 font-serif text-xs leading-relaxed text-[#3D2F3A]/85 sm:text-[13.5px]">
                        {r.detail}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-2 pt-2">
                      {r.actions.map((act) => (
                        <PastelDotBorder key={act.label} className="rounded-none">
                          <a
                            href={act.href}
                            target={act.href.startsWith("http") ? "_blank" : undefined}
                            rel={act.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center rounded-none border-2 border-[#DFCED8] bg-[#FFFDFB] px-3.5 py-2 text-xs font-bold text-[#3D2B3B] shadow-2xs transition-colors hover:bg-[#F4DCE2]"
                          >
                            {act.label} →
                          </a>
                        </PastelDotBorder>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>



      </main>

      {/* 8. Full Edge-to-Edge Interactive Water Reveal & Video Footer (100% Screen Width) */}
      <div id="water" className="relative z-10 w-full scroll-mt-20">
        <EdgeToEdgeFooterWaterReveal currentPeriod={currentPeriod} />
      </div>
    </div>
  );
}
