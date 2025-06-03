import React from 'react';

const CONVERGENCE_POINT = { x: 500, y: 300 };
const CENTRAL_SQUARE_SIZE = 80;
const VERTICAL_LINE_LENGTH = 40;
const HORIZONTAL_STUB_LENGTH = 20;
const ICON_SIZE = 24; // Size of the square icon container

const ANIM_START_DELAY = "1.2s"; // Overall start for this module
const LINE_DRAW_DURATION = "0.3s";
const ICON_ANIM_DURATION = "0.2s";
const ICON_ANIM_DELAY_OFFSET = "0.2s"; // Icon animation starts 0.2s after line animation begins

const BranchLines = () => {
  // Top Branch calculations
  const topBranchStartX = CONVERGENCE_POINT.x;
  const topBranchStartY = CONVERGENCE_POINT.y - CENTRAL_SQUARE_SIZE / 2;
  const topBranchKneeY = topBranchStartY - VERTICAL_LINE_LENGTH;
  const topBranchEndX = topBranchStartX + HORIZONTAL_STUB_LENGTH;
  const topBranchPath = `M ${topBranchStartX} ${topBranchStartY} L ${topBranchStartX} ${topBranchKneeY} L ${topBranchEndX} ${topBranchKneeY}`;
  const topBranchPathLength = VERTICAL_LINE_LENGTH + HORIZONTAL_STUB_LENGTH;
  // Position for the icon group's top-left corner
  const topIconGroupX = topBranchEndX;
  const topIconGroupY = topBranchKneeY - ICON_SIZE / 2;

  // Bottom Branch calculations
  const bottomBranchStartX = CONVERGENCE_POINT.x; // Same X start as top
  const bottomBranchStartY = CONVERGENCE_POINT.y + CENTRAL_SQUARE_SIZE / 2;
  const bottomBranchKneeY = bottomBranchStartY + VERTICAL_LINE_LENGTH;
  const bottomBranchEndX = bottomBranchStartX + HORIZONTAL_STUB_LENGTH; // Same X end as top
  const bottomBranchPath = `M ${bottomBranchStartX} ${bottomBranchStartY} L ${bottomBranchStartX} ${bottomBranchKneeY} L ${bottomBranchEndX} ${bottomBranchKneeY}`;
  const bottomBranchPathLength = VERTICAL_LINE_LENGTH + HORIZONTAL_STUB_LENGTH;
  // Position for the icon group's top-left corner
  const bottomIconGroupX = bottomBranchEndX;
  const bottomIconGroupY = bottomBranchKneeY - ICON_SIZE / 2;

  const lineStroke = "#A78FFF"; // Updated line color
  const iconPopDelay = `calc(${ANIM_START_DELAY} + ${ICON_ANIM_DELAY_OFFSET})`;

  return (
    <>
      <style jsx>{`
        @keyframes animateBranchLineDraw {
          from {
            stroke-dashoffset: var(--line-length);
            opacity: 0;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 0.3; /* Updated final opacity */
          }
        }
        @keyframes animateBranchIconPop {
          from {
            opacity: 0;
            transform: scale(0.5); /* Start a bit smaller for a pop effect */
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Disappear Animations */
        @keyframes retractBranchLine {
          to {
            opacity: 0;
            /* stroke-dashoffset: var(--line-length); Optional for retract effect */
          }
        }
        @keyframes hideBranchIcon {
          to {
            opacity: 0;
            transform: scale(0);
          }
        }

        .branch-line {
          stroke-dasharray: var(--line-length);
          stroke-dashoffset: var(--line-length); /* Start with line "undrawn" */
          opacity: 0; /* Start transparent */
          animation:
            animateBranchLineDraw ${LINE_DRAW_DURATION} ease-in-out ${ANIM_START_DELAY} forwards, /* Updated easing */
            retractBranchLine 0.5s ease-out 3.0s forwards;
        }
        .branch-icon-group {
          opacity: 0; /* Start hidden */
          transform-origin: center center; /* Scale from the center of the icon */
          animation:
            animateBranchIconPop ${ICON_ANIM_DURATION} ease-out ${iconPopDelay} forwards,
            hideBranchIcon 0.5s ease-out 3.0s forwards;
        }
      `}</style>
      <g>
        {/* Top Branch */}
        <path
          className="branch-line"
          d={topBranchPath}
          stroke={lineStroke}
          strokeWidth="1"
          fill="none"
          style={{ '--line-length': topBranchPathLength }}
        />
        <g
          className="branch-icon-group"
          transform={`translate(${topIconGroupX}, ${topIconGroupY})`}
        >
          {/* Icon container for centering content if icon itself isn't 0,0 based */}
          <rect width={ICON_SIZE} height={ICON_SIZE} fill="#4A0E4E" rx="3" />
          {/* Simple accent */}
          <circle cx={ICON_SIZE/2} cy={ICON_SIZE/2} r="4" fill="#FF00FF" opacity="0.7"/>
        </g>

        {/* Bottom Branch */}
        <path
          className="branch-line"
          d={bottomBranchPath}
          stroke={lineStroke}
          strokeWidth="1"
          fill="none"
          style={{ '--line-length': bottomBranchPathLength }}
        />
        <g
          className="branch-icon-group"
          transform={`translate(${bottomIconGroupX}, ${bottomIconGroupY})`}
        >
          {/* 4-pane grid icon placeholder */}
          <rect x="2" y="2" width={ICON_SIZE/2 - 3} height={ICON_SIZE/2 - 3} fill="#008080" />
          <rect x={ICON_SIZE/2 + 1} y="2" width={ICON_SIZE/2 - 3} height={ICON_SIZE/2 - 3} fill="#008080" />
          <rect x="2" y={ICON_SIZE/2 + 1} width={ICON_SIZE/2 - 3} height={ICON_SIZE/2 - 3} fill="#008080" />
          <rect x={ICON_SIZE/2 + 1} y={ICON_SIZE/2 + 1} width={ICON_SIZE/2 - 3} height={ICON_SIZE/2 - 3} fill="#008080" />
        </g>
      </g>
    </>
  );
};
export default BranchLines;
