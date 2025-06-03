import React from 'react';

const NUM_LINES = 15;
const CONVERGENCE_POINT = { x: 500, y: 300 }; // Center of 1000x600 viewBox
const VERTICAL_BAND_HEIGHT = 200;
const ANIMATION_DURATION = 0.8; // seconds
const STAGGER_DELAY = 0.05; // seconds
const LINE_START_X = 0; // Start at the left edge of the viewBox

const AnimatedStreaks = () => {
  const lines = [];

  for (let i = 0; i < NUM_LINES; i++) {
    const y1 = CONVERGENCE_POINT.y - VERTICAL_BAND_HEIGHT / 2 + i * (VERTICAL_BAND_HEIGHT / (NUM_LINES > 1 ? NUM_LINES - 1 : 1));
    const x1 = LINE_START_X;
    const x2 = CONVERGENCE_POINT.x;
    const y2 = CONVERGENCE_POINT.y;

    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    lines.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#A78FFF" // Updated line color
        strokeWidth="1"
        strokeDasharray={length}
        strokeDashoffset={length} // Initially not drawn
        style={{
          // Appear animation with its individual stagger
          // Disappear animation starts globally at 3.0s
          animation: `animateStreak ${ANIMATION_DURATION}s ease-in-out ${i * STAGGER_DELAY}s forwards, retractOrFadeStreaks 0.5s ease-out 3.0s forwards`,
        }}
      />
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes animateStreak {
          0% {
            /* stroke-dashoffset is already set to line length by style prop */
            opacity: 0;
          }
          50% {
            opacity: 0.3; /* Updated peak opacity */
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.15; /* Updated resting opacity */
          }
        }

        @keyframes retractOrFadeStreaks {
          to {
            opacity: 0;
            /* Optional: retract the line by uncommenting next line */
            /* stroke-dashoffset: var(--line-length-css-var); Ensure --line-length-css-var is set if used */
          }
        }
      `}</style>
      {/* Each line needs its own --line-length-css-var if retracting, or just rely on initial strokeDasharray for length.
          For simplicity, we're only fading opacity. If retracting, would need to pass 'length' as a CSS var. */}
      <g>{lines}</g>
    </>
  );
};

export default AnimatedStreaks;
