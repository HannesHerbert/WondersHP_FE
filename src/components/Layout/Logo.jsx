import { useId } from 'react';
import '../../sass/Logo.scss';

// Farben aus variables.scss – von außen (rot) nach innen (blau)
const STRIPES = [
  "#760712", // red_2
  "#a0100e", // red_1
  "#ca7810", // yellow_2
  "#cba27c", // yellow_1
  "#469291", // blue_4
  "#2e7380", // blue_3
  "#044a67", // blue_2
  "#022f4e", // blue_1
];

const CREAM = "#f4d799";
const INK = "#0a0a0c";

// Geometrie des Regenbogens: Viertelkreis links, der in horizontale Streifen übergeht
const CX = 78;
const BASE_Y = 146;
const R_OUTER = 74;
const STRIPE_W = 6;
const STRIPE_END = 548;

function Sparkle({ x, y, size, delay }) {
  const s = size;
  return (
    <path
      className="logo-sparkle"
      style={{ animationDelay: `${delay}s`, transformOrigin: `${x}px ${y}px` }}
      d={`M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s} Z`}
      fill={CREAM}
    />
  );
}

function Logo() {
  const uid = useId().replace(/:/g, "");
  const ballGrad = `ball-grad-${uid}`;
  const ballClip = `ball-clip-${uid}`;

  return (
    <svg
      className="wonders-logo"
      viewBox="0 0 560 150"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Jody Cooper & the Wonders"
    >
      <defs>
        <radialGradient id={ballGrad} cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#c9c9cf" />
          <stop offset="100%" stopColor="#4a4a52" />
        </radialGradient>
        <clipPath id={ballClip}>
          <rect x="0" y="0" width="560" height={BASE_Y} />
        </clipPath>
      </defs>

      {/* Regenbogen-Streifen: Bogen steigt links auf und läuft nach rechts aus */}
      <g fill="none" strokeWidth={STRIPE_W} strokeLinecap="round">
        {STRIPES.map((color, i) => {
          const r = R_OUTER - i * STRIPE_W;
          const end = STRIPE_END - i * 9;
          return (
            <path
              key={color}
              stroke={color}
              d={`M ${CX - r} ${BASE_Y} A ${r} ${r} 0 0 1 ${CX} ${BASE_Y - r} H ${end}`}
            />
          );
        })}
      </g>

      {/* Disco-Sonne: aufgehende Spiegelkugel im Bogen */}
      <g clipPath={`url(#${ballClip})`}>
        <circle cx={CX} cy={BASE_Y} r="25" fill={`url(#${ballGrad})`} stroke={INK} strokeWidth="2" />
        <g stroke={INK} strokeOpacity="0.35" strokeWidth="1" fill="none">
          <path d={`M ${CX - 25} ${BASE_Y - 8} H ${CX + 25}`} />
          <path d={`M ${CX - 22} ${BASE_Y - 16} H ${CX + 22}`} />
          <path d={`M ${CX - 14} ${BASE_Y - 22} H ${CX + 14}`} />
          <path d={`M ${CX} ${BASE_Y - 25} V ${BASE_Y}`} />
          <path d={`M ${CX - 10} ${BASE_Y - 23} Q ${CX - 16} ${BASE_Y - 10} ${CX - 14} ${BASE_Y}`} />
          <path d={`M ${CX + 10} ${BASE_Y - 23} Q ${CX + 16} ${BASE_Y - 10} ${CX + 14} ${BASE_Y}`} />
        </g>
      </g>

      {/* "Jody Cooper & the" – Schreibschrift */}
      <text
        className="logo-script"
        x="168"
        y="46"
        fontSize="34"
        fill={STRIPES[3]}
        stroke={INK}
        strokeWidth="7"
        strokeLinejoin="round"
        paintOrder="stroke"
        transform="rotate(-4 168 46)"
      >
        Jody Cooper &amp; the
      </text>

      {/* "WONDERS" – 70er Blockschrift mit Schicht-Schatten */}
      <g className="logo-block" fontSize="66" letterSpacing="2" strokeLinejoin="round">
        <text x="166" y="128" fill={INK} stroke={INK} strokeWidth="12">WONDERS</text>
        <text x="163" y="125" fill={STRIPES[1]} stroke={STRIPES[1]} strokeWidth="5">WONDERS</text>
        <text x="160" y="122" fill={STRIPES[2]} stroke={STRIPES[2]} strokeWidth="5">WONDERS</text>
        <text x="157" y="119" fill={CREAM} stroke={INK} strokeWidth="2.5" paintOrder="stroke">WONDERS</text>
      </g>

      <Sparkle x={536} y={28} size={11} delay={0} />
      <Sparkle x={508} y={52} size={6} delay={0.8} />
      <Sparkle x={30} y={52} size={8} delay={1.6} />
    </svg>
  );
}

export default Logo;
