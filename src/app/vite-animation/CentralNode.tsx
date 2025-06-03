import React from 'react';

const SQUARE_SIZE = 80;
const CONVERGENCE_POINT = { x: 500, y: 300 };
const SQUARE_X = CONVERGENCE_POINT.x - SQUARE_SIZE / 2;
const SQUARE_Y = CONVERGENCE_POINT.y - SQUARE_SIZE / 2;
const SQUARE_FILL = "#10121A";
const GLOW_COLOR = "#6E43FF"; // Purple glow

const SQUARE_ANIM_DELAY = "0.6s";
const SQUARE_FADE_DURATION = "0.3s"; // Fade in part of square & initial glow
const GLOW_PULSE_ANIM_DELAY_OFFSET = "0.3s"; // Start pulsing after fade-in
const GLOW_PULSE_DURATION = "0.6s"; // Duration for the entire pulse animation (e.g., two pulses)
const NUM_GLOW_PULSES = 2;

const LOGO_ANIM_DELAY = "0.8s";
const LOGO_ANIM_DURATION = "0.5s";

const CentralNode = () => {
  const logoCenterX = CONVERGENCE_POINT.x;
  const logoCenterY = CONVERGENCE_POINT.y;

  // Calculate delay for glow pulse animation to start after square fade-in
  // This is string concatenation for CSS, ensure units are consistent
  const glowPulseStartDelay = `calc(${SQUARE_ANIM_DELAY} + ${SQUARE_FADE_DURATION})`;

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulseGlowEffect {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes fadeInZoom {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1.0);
          }
        }

        /* Disappear Animations */
        @keyframes fadeOutSquare { to { opacity: 0; } }
        @keyframes fadeOutGlow { to { opacity: 0; } } /* Can also include scale down if desired */
        @keyframes fadeOutZoomLogo {
          to {
            opacity: 0;
            transform: scale(0.9); /* Optional: scale down on exit */
          }
        }

        /* Bounce animation for the central square */
        @keyframes bounceCentralSquare {
          0%, 100% { transform: scale(1.0); }
          50% { transform: scale(1.05); }
        }

        .square-shape {
          animation:
            fadeIn ${SQUARE_FADE_DURATION} cubic-bezier(0.4,0,0.2,1) ${SQUARE_ANIM_DELAY} forwards,
            bounceCentralSquare 0.5s cubic-bezier(0.34,1.56,0.64,1) 2.0s forwards,
            fadeOutSquare 0.5s cubic-bezier(0.4,0,0.2,1) 3.0s forwards;
          transform-origin: center; /* SVG transform origin: center of the element's bounding box */
          transform-box: fill-box;  /* Use the fill box as reference for transform-origin */
        }

        .glow-element {
          animation:
            fadeIn ${SQUARE_FADE_DURATION} cubic-bezier(0.4,0,0.2,1) ${SQUARE_ANIM_DELAY} forwards,
            pulseGlowEffect ${GLOW_PULSE_DURATION} ease-in-out ${glowPulseStartDelay} ${NUM_GLOW_PULSES},
            fadeOutGlow 0.5s cubic-bezier(0.4,0,0.2,1) 3.0s forwards;
          transform-origin: center; /* For the scale transform in pulseGlowEffect */
        }

        .logo-element {
          animation:
            fadeInZoom ${LOGO_ANIM_DURATION} cubic-bezier(0.4,0,0.2,1) ${LOGO_ANIM_DELAY} forwards,
            fadeOutZoomLogo 0.5s cubic-bezier(0.4,0,0.2,1) 3.0s forwards;
          transform-origin: 50% 50%; /* Explicitly center the scaling for the animation */
        }
      `}</style>

      <defs>
        <filter id="svgBlurEffect" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>
      </defs>

      {/* Glow Element: A slightly larger, blurred rect behind the main square */}
      <rect
        className="glow-element"
        x={SQUARE_X - 5}
        y={SQUARE_Y - 5}
        width={SQUARE_SIZE + 10}
        height={SQUARE_SIZE + 10}
        rx="10"
        fill={GLOW_COLOR}
        opacity="0" // Starts transparent, animation handles fade and pulse
        filter="url(#svgBlurEffect)"
      />

      <rect
        className="square-shape"
        x={SQUARE_X}
        y={SQUARE_Y}
        width={SQUARE_SIZE}
        height={SQUARE_SIZE}
        fill={SQUARE_FILL}
        rx="8"
        opacity="0" // Starts transparent, animation handles it
      />

      {/* === ACTUAL VITE LOGO === */}
      <g
        className="logo-element"
        style={{
          opacity: 0, // Initial state for animation
          // This transform positions the group's origin at the convergence point.
          // The animation's scale will be applied based on the 'transform-origin' in CSS.
          transform: `translate(${logoCenterX}px, ${logoCenterY}px)`,
        }}
      >
        {/* Defs for the Vite logo gradients (IDs prefixed) */}
        <defs>
          <linearGradient id="paint0_linear_vite_logo" x1="6.00017" y1="32.9999" x2="235" y2="344" gradientUnits="userSpaceOnUse">
            <stop stopColor="#41D1FF"/>
            <stop offset="1" stopColor="#BD34FE"/>
          </linearGradient>
          <linearGradient id="paint1_linear_vite_logo" x1="194.651" y1="8.81818" x2="236.076" y2="292.989" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFEA83"/>
            <stop offset="0.0833333" stopColor="#FFDD35"/>
            <stop offset="1" stopColor="#FFA800"/>
          </linearGradient>
        </defs>
        {/* Inner group to scale and center the logo paths */}
        {/* Translates logo's viewBox center to (0,0), scales, then this group is already at CONVERGENCE_POINT */}
        <g transform={`scale(${scaleFactor}) translate(-${logoViewBoxCenterX} -${logoViewBoxCenterY})`}>
          <path d="M399.641 59.5246L215.643 388.545C211.844 395.338 202.084 395.378 198.228 388.618L10.5817 59.5563C6.38087 52.1896 12.6802 43.2665 21.0281 44.7586L205.223 77.6824C206.398 77.8924 207.601 77.8904 208.776 77.6763L389.119 44.8058C397.439 43.2894 403.768 52.1434 399.641 59.5246Z" fill="url(#paint0_linear_vite_logo)"/>
          <path d="M292.965 1.5744L156.801 28.2552C154.563 28.6937 152.906 30.5903 152.771 32.8664L144.395 174.33C144.198 177.662 147.258 180.248 150.51 179.498L188.42 170.749C191.967 169.931 195.172 173.055 194.443 176.622L183.18 231.775C182.422 235.487 185.907 238.661 189.532 237.56L212.947 230.446C216.577 229.344 220.065 232.527 219.297 236.242L201.398 322.875C200.278 328.294 207.486 331.249 210.492 326.603L212.5 323.5L323.454 102.072C325.312 98.3645 322.108 94.137 318.036 94.9228L279.014 102.454C275.347 103.161 272.227 99.746 273.262 96.1583L298.731 7.86689C299.767 4.27314 296.636 0.855181 292.965 1.5744Z" fill="url(#paint1_linear_vite_logo)"/>
        </g>
      </g>
      {/* === END ACTUAL VITE LOGO === */}
    </>
  );
};

export default CentralNode;
