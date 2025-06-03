import React from 'react';

const CONVERGENCE_POINT = { x: 500, y: 300 };
const CENTRAL_SQUARE_SIZE = 80;
const SPINE_LENGTH = 350;
const SPINE_START_X = CONVERGENCE_POINT.x + CENTRAL_SQUARE_SIZE / 2;
const SPINE_Y = CONVERGENCE_POINT.y;

const SPINE_COLOR = "rgba(179, 157, 255, 0.3)"; // #B39DFF at 30%
const PULSE_GLOW_COLOR = "rgba(179, 157, 255, 0.6)"; // Brighter for pulse (increased opacity)
const DOT_DIAMETER = 8;
const LABEL_COLOR = "#DDDDDD";

const SPINE_ANIM_DELAY = "1.2s";
const SPINE_DRAW_DURATION = "0.4s";

const DOT1_POP_DELAY = "1.6s"; // Pop animation start
const DOT2_POP_DELAY = "1.7s";
const DOT3_POP_DELAY = "1.8s";
const DOT_POP_ANIM_DURATION = "0.3s";
const LABEL_FADE_DURATION = "0.3s"; // Sync with dot pop

const PULSE_ANIM_DELAY = "2.0s"; // Start of the pulse effect
const PULSE_TOTAL_DURATION = 0.5; // Total duration of one pulse (0.2s up, 0.3s down)

const OutputLines = () => {
  const outputNodesData = [
    { xPosFactor: 0.25, label: ".html", popDelay: DOT1_POP_DELAY },
    { xPosFactor: 0.55, label: ".css", popDelay: DOT2_POP_DELAY },
    { xPosFactor: 0.85, label: ".js", popDelay: DOT3_POP_DELAY },
  ];

  // Calculate keyframe percentage for pulse peak based on durations
  const pulseUpDuration = 0.2;
  const pulsePeakPercent = (pulseUpDuration / PULSE_TOTAL_DURATION) * 100;

  return (
    <>
      <style jsx>{`
        @keyframes animateSpineDraw {
          from { stroke-dashoffset: var(--line-length); opacity: 0; }
          to { stroke-dashoffset: 0; opacity: 1; }
        }

        @keyframes animateDotPop {
          0% { transform: scale(0.5); opacity: 0; } /* Start smaller and faded */
          60% { transform: scale(1.1); opacity: 1; } /* Overshoot slightly */
          100% { transform: scale(1.0); opacity: 1; }
        }

        @keyframes animateLabelFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes animatePulseEffect {
          0%, 100% {
            stroke: ${SPINE_COLOR};
            fill: ${SPINE_COLOR};
          }
          ${pulsePeakPercent}% {
            stroke: ${PULSE_GLOW_COLOR};
            fill: ${PULSE_GLOW_COLOR};
          }
        }

        /* Disappear Animations */
        @keyframes fadeOutSpine {
          to { opacity: 0; /* stroke-dashoffset: var(--line-length); Optional */ }
        }
        @keyframes hideOutputDot {
          to { opacity: 0; transform: scale(0); }
        }
        @keyframes fadeOutLabel {
          to { opacity: 0; }
        }

        .output-spine {
          stroke: ${SPINE_COLOR};
          stroke-dasharray: var(--line-length);
          stroke-dashoffset: var(--line-length);
          opacity: 0;
          animation:
            animateSpineDraw ${SPINE_DRAW_DURATION} ease-in-out ${SPINE_ANIM_DELAY} forwards, /* Updated easing */
            animatePulseEffect ${PULSE_TOTAL_DURATION}s ease-in-out ${PULSE_ANIM_DELAY} forwards,
            fadeOutSpine 0.5s ease-out 3.0s forwards;
        }

        .output-dot {
          fill: ${SPINE_COLOR};
          opacity: 0;
          transform-origin: center;
          animation-name: animateDotPop, animatePulseEffect, hideOutputDot;
          animation-duration: ${DOT_POP_ANIM_DURATION}, ${PULSE_TOTAL_DURATION}s, 0.5s;
          animation-timing-function: ease-out, ease-in-out, ease-out;
          animation-fill-mode: forwards, forwards, forwards;
          /* Delays for pop and pulse are inline, hideOutputDot delay is 3.0s globally */
        }

        .output-label {
          opacity: 0;
          animation:
            animateLabelFadeIn ${LABEL_FADE_DURATION} ease-out forwards, /* Delay inline */
            fadeOutLabel 0.5s ease-out 3.0s forwards;
          /* animation-delay for fadeIn set inline to match dot pop */
        }
      `}</style>
      <g>
        <line
          className="output-spine"
          x1={SPINE_START_X} y1={SPINE_Y}
          x2={SPINE_START_X + SPINE_LENGTH} y2={SPINE_Y}
          strokeWidth="1.5" /* Slightly thicker spine */
          style={{ '--line-length': SPINE_LENGTH }}
        />
        {outputNodesData.map((node, index) => {
          const dotX = SPINE_START_X + node.xPosFactor * SPINE_LENGTH;
          const labelY = SPINE_Y - DOT_DIAMETER - 4; // Adjusted for text size
          return (
            <g key={index}>
              <circle
                className="output-dot"
                cx={dotX} cy={SPINE_Y}
                r={DOT_DIAMETER / 2}
                style={{
                  // Delays for: animateDotPop, animatePulseEffect, hideOutputDot
                  animationDelay: `${node.popDelay}, ${PULSE_ANIM_DELAY}, 3.0s`
                }}
              />
              <text
                className="output-label"
                x={dotX} y={labelY}
                fill={LABEL_COLOR} fontSize="12" /* Slightly larger label */
                textAnchor="middle"
                style={{
                  // Delay for: animateLabelFadeIn (fadeOutLabel uses global 3.0s from class)
                  animationDelay: node.popDelay
                }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </g>
    </>
  );
};
export default OutputLines;
