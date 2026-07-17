"use client";

import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/900.css";
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/600.css";
import "@fontsource/tangerine/700.css";
import { Search, Clock, Lock } from "lucide-react";

export interface CertificateProps {
  playerName: string;
  caseTitle: string;
  caseId: string;
  score: number;
  difficulty: string;
  timeTaken: string;
  date: string;
  certificateNumber: string;
  investigatorName?: string;
}

/** Repeating gold laurel leaves curving along an arc — used on both sides of the seal's center emblem. */
function LaurelHalf({ flip }: { flip?: boolean }) {
  const leaves = Array.from({ length: 6 }, (_, i) => i);
  return (
    <g transform={flip ? "scale(-1,1)" : undefined}>
      {leaves.map((i) => {
        const angle = 100 + i * 13;
        const rad = (angle * Math.PI) / 180;
        const r = 34;
        const x = 50 + r * Math.cos(rad);
        const y = 54 + r * Math.sin(rad);
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="6.5"
            ry="3"
            fill="#C9A961"
            transform={`rotate(${angle + 90} ${x} ${y})`}
          />
        );
      })}
      <path d="M 50 88 Q 20 82 15 62" stroke="#C9A961" strokeWidth="2" fill="none" />
    </g>
  );
}

function Seal() {
  return (
    <svg viewBox="0 0 200 260" className="h-full w-full" aria-hidden="true">
      {/* Ribbon tails, behind the medallion */}
      <path d="M 78 150 L 78 240 L 100 222 L 122 240 L 122 150 Z" fill="#1B2A4A" stroke="#C9A961" strokeWidth="2" />
      <path d="M 82 150 L 82 228" stroke="#C9A961" strokeWidth="1" opacity="0.5" />
      <path d="M 118 150 L 118 228" stroke="#C9A961" strokeWidth="1" opacity="0.5" />

      {/* Medallion */}
      <g transform="translate(100 95)">
        {/* Scalloped outer edge */}
        <path
          d={Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * 2 * Math.PI;
            const r = i % 2 === 0 ? 92 : 84;
            const x = r * Math.cos(a);
            const y = r * Math.sin(a);
            return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
          }).join(" ") + " Z"}
          fill="#C9A961"
        />
        <circle r="78" fill="#12192B" stroke="#C9A961" strokeWidth="2.5" />
        <circle r="68" fill="none" stroke="#C9A961" strokeWidth="1" opacity="0.6" />

        <path id="sealTopArc" d="M -55 -20 A 58 58 0 0 1 55 -20" fill="none" />
        <path id="sealBottomArc" d="M -50 30 A 55 55 0 0 0 50 30" fill="none" />
        <text fill="#C9A961" fontFamily="Cinzel" fontSize="9.5" fontWeight="600" letterSpacing="2.5">
          <textPath href="#sealTopArc" startOffset="50%" textAnchor="middle">
            DOSSIER X
          </textPath>
        </text>
        <text fill="#C9A961" fontFamily="Cinzel" fontSize="8.5" fontWeight="600" letterSpacing="2">
          <textPath href="#sealBottomArc" startOffset="50%" textAnchor="middle">
            MASTER DETECTIVE
          </textPath>
        </text>

        <LaurelHalf />
        <LaurelHalf flip />

        <text
          y="12"
          textAnchor="middle"
          fill="#C9A961"
          fontFamily="Playfair Display"
          fontWeight="900"
          fontSize="46"
        >
          X
        </text>
        <text y="-32" textAnchor="middle" fill="#C9A961" fontSize="13">
          \u2605
        </text>
      </g>
    </svg>
  );
}

function CornerFlourish({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const rotation = { tl: 0, tr: 90, bl: 270, br: 180 }[corner];
  const pos = {
    tl: "left-2 top-2",
    tr: "right-2 top-2",
    bl: "left-2 bottom-2",
    br: "right-2 bottom-2",
  }[corner];
  return (
    <svg
      viewBox="0 0 80 80"
      className={`pointer-events-none absolute ${pos} h-14 w-14 opacity-90`}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      <path d="M4 4 L4 34 M4 4 L34 4" stroke="#C9A961" strokeWidth="2.5" fill="none" />
      <path d="M4 44 Q4 4 44 4" stroke="#C9A961" strokeWidth="1" fill="none" opacity="0.7" />
      <circle cx="4" cy="4" r="3" fill="#C9A961" />
      <path d="M14 14 Q 24 10 30 20 Q 20 24 14 14 Z" fill="#C9A961" opacity="0.85" />
    </svg>
  );
}

export function LockedCertificatePreview({
  caseTitle,
  caseId,
  owned,
  answeredCount,
  totalQuestions,
}: {
  caseTitle: string;
  caseId: string;
  owned: boolean;
  answeredCount?: number;
  totalQuestions?: number;
}) {
  const progress = owned && totalQuestions ? Math.round(((answeredCount ?? 0) / totalQuestions) * 100) : 0;

  return (
    <div className="relative mx-auto w-full overflow-hidden rounded-sm p-3" style={{ aspectRatio: "16 / 10", background: "#12192B" }}>
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-sm border-2 px-10 text-center" style={{ borderColor: "#5A4F38", background: "radial-gradient(circle at 50% 0%, #3A3628 0%, #232016 100%)" }}>
        <div className="opacity-40 grayscale">
          <div className="mx-auto w-[64px]">
            <Seal />
          </div>
        </div>

        <p className="text-[10px] font-semibold tracking-[0.3em] text-[#8A7A54]" style={{ fontFamily: "Cinzel" }}>
          {caseId} \u2022 CERTIFICATE AWAITS
        </p>
        <h3
          className="uppercase text-[#C9BFA0]"
          style={{ fontFamily: "Playfair Display", fontWeight: 800, fontSize: "clamp(1rem, 2.2vw, 1.4rem)" }}
        >
          {caseTitle}
        </h3>

        <div className="flex items-center gap-4 text-[#8A7A54]">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-semibold tracking-[0.2em]" style={{ fontFamily: "Cinzel" }}>
              DETECTIVE
            </span>
            <span className="text-lg font-bold" style={{ fontFamily: "Tangerine", fontSize: "1.7rem" }}>
              ? ? ?
            </span>
          </div>
          <div className="h-8 w-px bg-[#5A4F38]" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-semibold tracking-[0.2em]" style={{ fontFamily: "Cinzel" }}>
              SCORE
            </span>
            <span className="text-lg font-bold" style={{ fontFamily: "Playfair Display" }}>
              \u2014\u2014
            </span>
          </div>
        </div>

        {owned ? (
          <div className="w-full max-w-[220px]">
            <div className="mb-1 flex justify-between text-[10px] text-[#8A7A54]">
              <span>{answeredCount ?? 0} / {totalQuestions ?? 0} answered</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#3A3628]">
              <div className="h-full rounded-full bg-gold" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <p className="flex items-center gap-1.5 text-xs font-medium text-gold">
            <Lock size={12} /> Purchase to begin
          </p>
        )}
      </div>
    </div>
  );
}

const MEDAL_COLORS: Record<string, { border: string; medal: string; medalDark: string }> = {
  Beginner: { border: "#D4AF37", medal: "#E8C766", medalDark: "#B8942E" },
  Intermediate: { border: "#B0B7BD", medal: "#D9DEE2", medalDark: "#8B9198" },
  Advanced: { border: "#CD7F32", medal: "#DDA15E", medalDark: "#A8632A" },
  Expert: { border: "#B497D6", medal: "#D4C2EC", medalDark: "#8B6BB8" },
};

function MedalIcon({ colors }: { colors: { medal: string; medalDark: string } }) {
  return (
    <svg viewBox="0 0 60 76" className="mx-auto h-12 w-auto" aria-hidden="true">
      <path d="M18 30 L10 6 L22 6 L28 26 Z" fill={colors.medalDark} />
      <path d="M42 30 L50 6 L38 6 L32 26 Z" fill={colors.medalDark} />
      <circle cx="30" cy="42" r="22" fill={colors.medal} stroke={colors.medalDark} strokeWidth="2.5" />
      <circle cx="30" cy="42" r="16" fill="none" stroke={colors.medalDark} strokeWidth="1.2" opacity="0.6" />
      <path
        d="M30 33 L32.5 39.5 L39.5 40 L34 44.5 L36 51.5 L30 47.3 L24 51.5 L26 44.5 L20.5 40 L27.5 39.5 Z"
        fill={colors.medalDark}
      />
    </svg>
  );
}

export function CertificateCard({
  playerName,
  caseTitle,
  caseId,
  difficulty,
  date,
}: {
  playerName: string;
  caseTitle: string;
  caseId: string;
  difficulty: string;
  date: string;
}) {
  const colors = MEDAL_COLORS[difficulty] ?? MEDAL_COLORS.Intermediate!;
  return (
    <div
      className="flex flex-col overflow-hidden rounded-sm border-2"
      style={{ borderColor: colors.border, background: "linear-gradient(180deg, #F5EEDC 0%, #ECE2C8 100%)" }}
    >
      <div className="flex flex-col items-center gap-2 px-5 pb-5 pt-6 text-center">
        <p className="text-[10px] font-bold tracking-[0.25em] text-[#1B2A4A]" style={{ fontFamily: "Cinzel" }}>
          DOSSIER X
        </p>
        <p className="text-[7px] tracking-[0.2em] text-[#6B6357]">SPECIAL INVESTIGATION DIVISION</p>

        <p className="mt-3 text-xl font-black text-[#1B2A4A]" style={{ fontFamily: "Playfair Display" }}>
          CERTIFICATE
        </p>
        <p className="-mt-1 text-[10px] tracking-[0.3em] text-[#8A7A54]" style={{ fontFamily: "Cinzel" }}>
          OF ACHIEVEMENT
        </p>

        <p className="mt-3 text-[9px] italic text-[#6B6357]">This is to certify that</p>
        <p className="text-lg font-bold uppercase text-[#1B2A4A]" style={{ fontFamily: "Playfair Display" }}>
          {playerName}
        </p>
        <p className="text-[9px] italic text-[#6B6357]">has successfully solved</p>

        <p className="text-[10px] font-bold tracking-wide text-[#8A7A54]">{caseId}</p>
        <p className="text-sm font-bold uppercase text-[#1B2A4A]" style={{ fontFamily: "Playfair Display" }}>
          {caseTitle}
        </p>

        <div className="mt-2 flex w-full items-center justify-between text-[8px] text-[#6B6357]">
          <div className="text-left">
            <p className="font-semibold uppercase tracking-wide">Difficulty</p>
            <p className="text-[9px] font-bold text-[#1B2A4A]">{difficulty}</p>
          </div>
          <MedalIcon colors={colors} />
          <div className="text-right">
            <p className="font-semibold uppercase tracking-wide">Date</p>
            <p className="text-[9px] font-bold text-[#1B2A4A]">{date}</p>
          </div>
        </div>

        <div className="mt-3 w-full border-t border-[#C9BFA0] pt-1.5">
          <p className="text-[8px] italic text-[#6B6357]">Chief Investigator</p>
        </div>
      </div>
    </div>
  );
}

export function LockedCertificateCard({ caseId, caseTitle }: { caseId: string; caseTitle: string }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-sm border-2 border-[#3A3A3A] bg-[#232323]">
      <div className="flex flex-col items-center gap-2 px-5 pb-5 pt-6 text-center opacity-70">
        <p className="text-[10px] font-bold tracking-[0.25em] text-[#8A8A8A]" style={{ fontFamily: "Cinzel" }}>
          DOSSIER X
        </p>
        <p className="text-[7px] tracking-[0.2em] text-[#5A5A5A]">SPECIAL INVESTIGATION DIVISION</p>
        <p className="mt-3 text-xl font-black text-[#6A6A6A]" style={{ fontFamily: "Playfair Display" }}>
          CERTIFICATE
        </p>
        <p className="-mt-1 text-[10px] tracking-[0.3em] text-[#5A5A5A]" style={{ fontFamily: "Cinzel" }}>
          OF ACHIEVEMENT
        </p>

        <div className="my-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#3A3A3A]">
          <Lock size={22} className="text-[#8A8A8A]" />
        </div>

        <p className="max-w-[160px] text-xs text-[#8A8A8A]">Complete more cases to unlock this certificate</p>
      </div>
      <div className="border-t border-[#3A3A3A] px-4 py-2 text-center">
        <p className="text-[10px] font-semibold text-[#6A6A6A]">
          {caseId} \u2014 {caseTitle.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export function Certificate({
  playerName,
  caseTitle,
  caseId,
  score,
  difficulty,
  timeTaken,
  date,
  certificateNumber,
  investigatorName = "R. Blackwell",
}: CertificateProps) {
  return (
    <div
      className="relative mx-auto w-full overflow-hidden rounded-sm p-3"
      style={{ aspectRatio: "16 / 10", background: "#12192B" }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-sm border-2" style={{ borderColor: "#C9A961" }}>
        <div
          className="relative flex h-full w-full flex-col items-center px-16 py-8"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, #F5EEDC 0%, #F0E7D2 55%, #EBE0C7 100%)",
          }}
        >
          <CornerFlourish corner="tl" />
          <CornerFlourish corner="tr" />
          <CornerFlourish corner="bl" />
          <CornerFlourish corner="br" />

          {/* Watermark */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-[220px] font-black opacity-[0.035]"
            style={{ fontFamily: "Playfair Display", color: "#1B2A4A" }}
            aria-hidden="true"
          >
            DX
          </div>

          <div className="relative z-10 flex h-full w-full">
            {/* Seal, left */}
            <div className="flex w-[150px] shrink-0 items-start justify-center pt-8">
              <div className="w-full max-w-[140px]">
                <Seal />
              </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col items-center text-center">
              <h1
                className="tracking-wide"
                style={{ fontFamily: "Playfair Display", fontWeight: 800, fontSize: "clamp(1.8rem, 4.2vw, 2.6rem)", color: "#1B2A4A" }}
              >
                DOSSIER <span style={{ color: "#C9A961", WebkitTextStroke: "1px #1B2A4A" }}>X</span>
              </h1>
              <p
                className="mt-0.5 text-[11px] font-semibold tracking-[0.35em]"
                style={{ fontFamily: "Cinzel", color: "#B8944F" }}
              >
                INVESTIGATION ARCHIVE
              </p>

              <div className="my-3 flex items-center gap-3">
                <span style={{ color: "#C9A961" }}>\u2014\u25C6\u2014</span>
              </div>

              <h2
                className="tracking-wide"
                style={{ fontFamily: "Playfair Display", fontWeight: 700, fontSize: "clamp(1.1rem, 2.4vw, 1.5rem)", color: "#1B2A4A" }}
              >
                CERTIFICATE OF COMPLETION
              </h2>

              <p
                className="mt-4 text-[11px] font-semibold tracking-[0.3em]"
                style={{ fontFamily: "Cinzel", color: "#5A5140" }}
              >
                THIS CERTIFIES THAT
              </p>

              <p
                className="mt-1 border-b px-6 pb-1"
                style={{
                  fontFamily: "Tangerine",
                  fontWeight: 700,
                  fontSize: "clamp(2.4rem, 5.5vw, 3.6rem)",
                  color: "#8A6D2F",
                  borderColor: "#C9A961",
                  lineHeight: 1,
                }}
              >
                {playerName}
              </p>

              <p
                className="mt-3 text-[11px] font-semibold tracking-[0.3em]"
                style={{ fontFamily: "Cinzel", color: "#5A5140" }}
              >
                HAS SUCCESSFULLY SOLVED
              </p>

              <h3
                className="mt-1 uppercase"
                style={{ fontFamily: "Playfair Display", fontWeight: 800, fontSize: "clamp(1.3rem, 2.8vw, 1.8rem)", color: "#1B2A4A" }}
              >
                {caseTitle}
              </h3>
              <p
                className="mt-0.5 text-[10px] font-semibold tracking-[0.25em]"
                style={{ fontFamily: "Cinzel", color: "#B8944F" }}
              >
                CASE {caseId}
              </p>

              <p className="mx-auto mt-3 max-w-md text-[12px] leading-snug" style={{ color: "#4A4436" }}>
                Your deduction, analysis, and attention to detail have proven you to be a true{" "}
                <span style={{ color: "#B8944F", fontWeight: 600 }}>Master Detective</span>.
              </p>

              <div className="mt-4 flex items-center gap-6 text-center" style={{ color: "#1B2A4A" }}>
                <div className="flex flex-col items-center gap-1">
                  <Search size={18} style={{ color: "#B8944F" }} />
                  <span className="text-[9px] font-semibold tracking-[0.2em]" style={{ fontFamily: "Cinzel" }}>
                    SCORE
                  </span>
                  <span className="text-lg font-bold" style={{ fontFamily: "Playfair Display" }}>
                    {score}%
                  </span>
                </div>
                <div className="h-10 w-px" style={{ background: "#C9A961" }} />
                <div className="flex flex-col items-center gap-1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: "#B8944F" }}>
                    <path
                      d="M12 3l2.2 4.6 5 .7-3.6 3.6.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.6 5-.7L12 3z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[9px] font-semibold tracking-[0.2em]" style={{ fontFamily: "Cinzel" }}>
                    DIFFICULTY
                  </span>
                  <span className="text-sm font-bold uppercase" style={{ fontFamily: "Playfair Display" }}>
                    {difficulty}
                  </span>
                </div>
                <div className="h-10 w-px" style={{ background: "#C9A961" }} />
                <div className="flex flex-col items-center gap-1">
                  <Clock size={18} style={{ color: "#B8944F" }} />
                  <span className="text-[9px] font-semibold tracking-[0.2em]" style={{ fontFamily: "Cinzel" }}>
                    TIME TAKEN
                  </span>
                  <span className="text-lg font-bold" style={{ fontFamily: "Playfair Display" }}>
                    {timeTaken}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-[150px] shrink-0" />
          </div>

          {/* Footer row */}
          <div className="relative z-10 mt-auto flex w-full items-end justify-between px-2 pb-1">
            <div className="text-left">
              <p className="border-t pt-1 text-[11px] font-semibold" style={{ borderColor: "#8A7A54", color: "#1B2A4A", fontFamily: "Cinzel" }}>
                {date}
              </p>
              <p className="text-[8px] tracking-[0.2em]" style={{ color: "#8A7A54" }}>
                DATE
              </p>
            </div>

            <div className="flex flex-col items-center">
              <p style={{ fontFamily: "Tangerine", fontWeight: 700, fontSize: "1.6rem", color: "#1B2A4A" }}>
                {investigatorName}
              </p>
              <p className="border-t pt-0.5 text-[8px] tracking-[0.2em]" style={{ borderColor: "#8A7A54", color: "#8A7A54" }}>
                LEAD INVESTIGATOR
              </p>
            </div>

            <div className="flex flex-col items-end text-right">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ color: "#1B2A4A" }}>
                <path
                  d="M12 2a7 7 0 00-7 7c0 5-2 7-2 7m18 0s-2-2-2-7a7 7 0 00-7-7m-4 20c1-2 1-5 1-6m6 6c1-2 1-5 1-6M9 9a3 3 0 016 0c0 6 3 9 3 9M9 9c0 7-3 9-3 9"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <p className="mt-0.5 text-[8px] tracking-[0.1em]" style={{ color: "#8A7A54" }}>
                {certificateNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
