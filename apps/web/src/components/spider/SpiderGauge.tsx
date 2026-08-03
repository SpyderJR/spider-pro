const CX = 100;
const CY = 100;
const R = 84;
const STROKE = 16;

function arcPoint(thetaDeg: number) {
  const theta = (thetaDeg * Math.PI) / 180;
  return { x: CX + R * Math.cos(theta), y: CY - R * Math.sin(theta) };
}

function describeArc(theta1: number, theta2: number) {
  const p1 = arcPoint(theta1);
  const p2 = arcPoint(theta2);
  const largeArc = theta1 - theta2 > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${R} ${R} 0 ${largeArc} 1 ${p2.x} ${p2.y}`;
}

// score (0-100) -> angle (180deg = izquierda/0, 0deg = derecha/100)
function scoreToTheta(score: number) {
  return 180 - (score / 100) * 180;
}

interface Props {
  score: number;
  size?: number;
}

/** Velocímetro semicircular 0-100 — zonas fijas rojo/dorado/verde, sin caja negra. */
export function SpiderGauge({ score, size = 240 }: Props) {
  const clamped = Math.max(0, Math.min(100, score));
  const needleTheta = scoreToTheta(clamped);
  const needleRad = (needleTheta * Math.PI) / 180;
  const needleLen = R - STROKE / 2 - 4;
  const needleTip = {
    x: CX + needleLen * Math.cos(needleRad),
    y: CY - needleLen * Math.sin(needleRad),
  };

  return (
    <svg viewBox="0 0 200 115" width={size} height={size * 0.575} role="img" aria-label={`Spider Score: ${clamped.toFixed(0)} de 100`}>
      <path d={describeArc(180, 117)} stroke="#ff3b5c" strokeWidth={STROKE} strokeLinecap="round" fill="none" opacity={0.85} />
      <path d={describeArc(117, 63)} stroke="#ffcf4d" strokeWidth={STROKE} fill="none" opacity={0.85} />
      <path d={describeArc(63, 0)} stroke="#39ff9c" strokeWidth={STROKE} strokeLinecap="round" fill="none" opacity={0.85} />

      {/* marcas de umbral 35 / 65 */}
      {[35, 65].map((s) => {
        const t = scoreToTheta(s);
        const inner = arcPoint(t);
        return <circle key={s} cx={inner.x} cy={inner.y} r={2} fill="#05060a" />;
      })}

      <line
        x1={CX}
        y1={CY}
        x2={needleTip.x}
        y2={needleTip.y}
        stroke="#e8ecf1"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx={CX} cy={CY} r={6} fill="#e8ecf1" />
    </svg>
  );
}
