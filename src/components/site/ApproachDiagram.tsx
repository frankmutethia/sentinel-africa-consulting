import sentinelLogo from "@/assets/logos/SENTINEL-AFRICA-LOGO-2023.png";

// Listed in paint order, matching the original artwork: Understand overlaps Tailor,
// and Embed sits on top of both.
const steps = [
  { id: "tailor", step: "Step 2:", name: "TAILOR", cx: 260, cy: 140, labelX: 318, labelY: 124 },
  {
    id: "understand",
    step: "Step 1:",
    name: "UNDERSTAND",
    cx: 140,
    cy: 140,
    labelX: 84,
    labelY: 124,
  },
  { id: "embed", step: "Step 3:", name: "EMBED", cx: 200, cy: 244, labelX: 200, labelY: 300 },
] as const;
const radius = 112;

/** Sentinel's Understand → Tailor → Embed model: three overlapping circles around the logo. */
export function ApproachDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 380"
      role="img"
      aria-labelledby="approach-diagram-title approach-diagram-desc"
    >
      <title id="approach-diagram-title">How we do it</title>
      <desc id="approach-diagram-desc">
        Three overlapping circles: Step 1, Understand; Step 2, Tailor; Step 3, Embed. Sentinel
        Africa sits where all three meet.
      </desc>
      <defs>
        <linearGradient id="approach-understand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b80a6" />
          <stop offset="0.55" stopColor="#2c2f66" />
          <stop offset="1" stopColor="#1b1f4f" />
        </linearGradient>
        <linearGradient id="approach-tailor" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1fb24a" />
          <stop offset="1" stopColor="#129a3c" />
        </linearGradient>
        <linearGradient id="approach-embed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b9fd6" />
          <stop offset="0.45" stopColor="#1f78bb" />
          <stop offset="1" stopColor="#0f6aae" />
        </linearGradient>
        <filter id="approach-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#102d3e" floodOpacity="0.18" />
        </filter>
      </defs>

      <g filter="url(#approach-shadow)">
        {steps.map((step) => (
          <circle
            key={step.id}
            cx={step.cx}
            cy={step.cy}
            r={radius}
            fill={`url(#approach-${step.id})`}
          />
        ))}
      </g>
      {/* Outlines drawn on top so every overlap stays visible, as in the original diagram. */}
      <g fill="none" stroke="#fff" strokeWidth="3">
        {steps.map((step) => (
          <circle key={step.id} cx={step.cx} cy={step.cy} r={radius} />
        ))}
      </g>

      <circle cx="200" cy="176" r="60" fill="#fff" />
      <image href={sentinelLogo} x="152" y="166" width="96" height="21" />

      <g fill="#fff" textAnchor="middle" fontFamily="var(--font-display)">
        {steps.map((step) => (
          <text key={step.id} x={step.labelX} y={step.labelY}>
            <tspan x={step.labelX} fontSize="10" opacity="0.8" letterSpacing="1">
              {step.step}
            </tspan>
            <tspan x={step.labelX} dy="15" fontSize="12" fontWeight="700" letterSpacing="1.4">
              {step.name}
            </tspan>
          </text>
        ))}
      </g>
    </svg>
  );
}
