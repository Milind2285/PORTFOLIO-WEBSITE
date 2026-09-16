import React from 'react';

/**
 * PixelPetSprite
 * Renders an original, minimalist Minecraft-inspired pixel turtle on a voxel platform runway.
 * Coordinate Grid: 54 x 26 pixels with crispEdges rendering.
 *
 * Supported Visual States:
 * - 'idle': Calm resting stance with specular eyes
 * - 'walk': Active walking state with stepping legs and bobbing
 * - 'curious': Inquisitive stance with raised head & alert eyes
 * - 'listening': Listening stance with focused acoustic perk (Audio Comparison)
 * - 'focused': Determined brow and focused gaze (Skills section)
 * - 'happy': Cheerful curved '^ ^' eyes, amber blush, and floating golden heart
 * - 'sleeping': Resting posture, closed slit eyes, and floating 'z Z' particles
 * - 'waking': Half-open eye slit transitioning to open
 * - 'laptop': Hidden easter egg where turtle types on a mini voxel laptop with a glowing cyan screen
 */
export function PixelPetSprite({
  state = 'idle',
  isBlinking = false,
  lookDirection = 'forward', // 'left' | 'right' | 'up' | 'forward'
  walkFrame = 0, // 0 | 1 for leg cadence
  walkPx = 50, // horizontal translation offset in CSS px (0 to 50)
  walkDuration = 2800, // transition duration in ms
  isWalking = false,
  facing = 'left', // 'left' | 'right'
}) {
  const isHappy = state === 'happy';
  const isSleeping = state === 'sleeping';
  const isWaking = state === 'waking';
  const isCurious = state === 'curious' || state === 'look-cursor';
  const isListening = state === 'listening';
  const isFocused = state === 'focused';
  const isLaptop = state === 'laptop';

  // Head offsets for dynamic breathing, looking, and sleeping
  const headYOffset = isSleeping ? 1 : isWaking ? 0 : (isCurious || isListening ? -1 : 0);

  // Subtle walk vertical bob
  const walkBob = isWalking && walkFrame === 1 ? -0.5 : 0;

  return (
    <svg
      viewBox="0 0 54 26"
      width="144"
      height="69"
      className={`pixel-turtle-svg state-${state} dir-${lookDirection} facing-${facing}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {/* ========================================================= */}
      {/* 1. STATIONARY VOXEL GROUND PLATFORM (54x26 runway)        */}
      {/* ========================================================= */}
      <g className="turtle-platform">
        {/* Grass Top Surface (y=21, x=2..52) */}
        <rect x="2" y="21" width="50" height="1" fill="#10b981" />
        {/* Grass Highlights */}
        <rect x="4" y="21" width="2" height="1" fill="#34d399" />
        <rect x="11" y="21" width="2" height="1" fill="#34d399" />
        <rect x="18" y="21" width="2" height="1" fill="#34d399" />
        <rect x="26" y="21" width="2" height="1" fill="#34d399" />
        <rect x="34" y="21" width="2" height="1" fill="#34d399" />
        <rect x="42" y="21" width="2" height="1" fill="#34d399" />
        <rect x="49" y="21" width="2" height="1" fill="#34d399" />
        {/* Grass Shadows */}
        <rect x="8" y="21" width="2" height="1" fill="#059669" />
        <rect x="15" y="21" width="2" height="1" fill="#059669" />
        <rect x="22" y="21" width="2" height="1" fill="#059669" />
        <rect x="30" y="21" width="2" height="1" fill="#059669" />
        <rect x="38" y="21" width="2" height="1" fill="#059669" />
        <rect x="46" y="21" width="2" height="1" fill="#059669" />

        {/* Grass Blades popping up (y=20) */}
        <rect x="3" y="20" width="1" height="1" fill="#34d399" />
        <rect x="14" y="20" width="1" height="1" fill="#10b981" />
        <rect x="25" y="20" width="1" height="1" fill="#34d399" />
        <rect x="36" y="20" width="1" height="1" fill="#10b981" />
        <rect x="48" y="20" width="1" height="1" fill="#34d399" />

        {/* Stone / Slate Platform Base (y=22..24) */}
        <rect x="2" y="22" width="50" height="2" fill="#1e2433" />
        <rect x="3" y="24" width="48" height="1" fill="#171b26" />
        {/* Stone texture & highlights */}
        <rect x="5" y="22" width="3" height="1" fill="#2a3449" />
        <rect x="13" y="23" width="3" height="1" fill="#2a3449" />
        <rect x="24" y="22" width="2" height="1" fill="#2a3449" />
        <rect x="33" y="23" width="3" height="1" fill="#2a3449" />
        <rect x="43" y="22" width="3" height="1" fill="#2a3449" />
        {/* Dark crevices */}
        <rect x="9" y="22" width="2" height="2" fill="#141822" />
        <rect x="20" y="23" width="2" height="1" fill="#141822" />
        <rect x="29" y="22" width="2" height="2" fill="#141822" />
        <rect x="39" y="22" width="2" height="2" fill="#141822" />

        {/* Tiny Cyan Sprout on left edge (x=4..5, y=17..20) */}
        <rect x="5" y="19" width="1" height="2" fill="#059669" />
        <rect x="4" y="19" width="1" height="1" fill="#10b981" />
        <rect x="5" y="18" width="1" height="1" fill="#34d399" />
        <rect x="4" y="17" width="2" height="1" fill="#38bdf8" />
        <rect x="4" y="17" width="1" height="1" fill="#bae6fd" />
      </g>

      {/* ========================================================= */}
      {/* 2. MOBILE TURTLE CREATURE GROUP (Moves across platform)   */}
      {/* ========================================================= */}
      <g
        className="turtle-mover"
        style={{
          transform: `translateX(${walkPx}px)`,
          transition: isWalking
            ? `transform ${walkDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`
            : 'transform 300ms ease-out',
        }}
      >
        {/* Flippable Turtle Creature Group (Faces left or right within [4, 27]) */}
        <g
          className={`turtle-creature ${isWalking ? 'is-walking' : ''}`}
          transform={facing === 'right' ? 'translate(31, 0) scale(-1, 1)' : undefined}
          style={{
            transform: walkBob !== 0 ? `translateY(${walkBob}px)` : undefined,
          }}
        >
          {/* Floating Particles (attached above turtle's head/shell) */}
          {isSleeping && (
            <g className="turtle-particles-sleep">
              <rect x="7" y="8" width="3" height="1" fill="#38bdf8" />
              <rect x="8" y="9" width="1" height="1" fill="#38bdf8" />
              <rect x="7" y="10" width="3" height="1" fill="#38bdf8" />
              <rect x="10" y="3" width="4" height="1" fill="#7dd3fc" />
              <rect x="12" y="4" width="1" height="1" fill="#7dd3fc" />
              <rect x="11" y="5" width="1" height="1" fill="#7dd3fc" />
              <rect x="10" y="6" width="4" height="1" fill="#7dd3fc" />
            </g>
          )}

          {isHappy && (
            <g className="turtle-particles-heart">
              <rect x="15" y="3" width="2" height="1" fill="#fbbf24" />
              <rect x="18" y="3" width="2" height="1" fill="#fbbf24" />
              <rect x="14" y="4" width="7" height="1" fill="#f59e0b" />
              <rect x="14" y="4" width="1" height="1" fill="#fde047" />
              <rect x="15" y="5" width="5" height="1" fill="#f59e0b" />
              <rect x="16" y="6" width="3" height="1" fill="#d97706" />
              <rect x="17" y="7" width="1" height="1" fill="#b45309" />
            </g>
          )}

          {isListening && (
            <g className="turtle-particles-audio">
              <rect x="5" y="7" width="1" height="2" fill="#38bdf8" />
              <rect x="7" y="6" width="1" height="4" fill="#38bdf8" />
              <rect x="9" y="8" width="1" height="1" fill="#38bdf8" />
            </g>
          )}

          {isCurious && (
            <g className="turtle-particles-alert">
              <rect x="7" y="6" width="1" height="2" fill="#38bdf8" />
              <rect x="6" y="7" width="3" height="1" fill="#38bdf8" />
              <rect x="7" y="7" width="1" height="1" fill="#ffffff" />
            </g>
          )}

          {/* Tail (x=26..27, y=15..16) */}
          <rect x="26" y="15" width="2" height="2" fill="#16a34a" />
          <rect x="27" y="16" width="1" height="1" fill="#15803d" />

          {/* Back Leg (x=21..24, y=17..21) */}
          <g className="turtle-leg-back">
            <rect
              x={isWalking && walkFrame === 1 ? "20" : "21"}
              y="17"
              width="3"
              height="4"
              fill="#16a34a"
            />
            <rect
              x={isWalking && walkFrame === 1 ? "20" : "21"}
              y="17"
              width="1"
              height="4"
              fill="#15803d"
            />
            <rect
              x={isWalking && walkFrame === 1 ? "19" : "20"}
              y="20"
              width="4"
              height="1"
              fill="#15803d"
            />
          </g>

          {/* Front Leg (x=9..12, y=17..21) */}
          {!isLaptop && (
            <g className="turtle-leg-front">
              <rect
                x={isWalking && walkFrame === 1 ? "10" : "9"}
                y="17"
                width="3"
                height="4"
                fill="#22c55e"
              />
              <rect
                x={isWalking && walkFrame === 1 ? "12" : "11"}
                y="17"
                width="1"
                height="4"
                fill="#16a34a"
              />
              <rect
                x={isWalking && walkFrame === 1 ? "9" : "8"}
                y="20"
                width="4"
                height="1"
                fill="#16a34a"
              />
              <rect
                x={isWalking && walkFrame === 1 ? "9" : "8"}
                y="20"
                width="2"
                height="1"
                fill="#4ade80"
              />
            </g>
          )}

          {/* Shell Dome & Plates (x=11..26, y=9..18) */}
          <g className="turtle-shell">
            {/* Shell Base Shadow / Underbelly */}
            <rect x="12" y="17" width="14" height="1" fill="#292524" />
            <rect x="13" y="18" width="12" height="1" fill="#1c1917" />

            {/* Main Shell Silhouette Block */}
            <rect x="15" y="9" width="8" height="1" fill="#d97706" />
            <rect x="13" y="10" width="12" height="2" fill="#92400e" />
            <rect x="11" y="12" width="15" height="5" fill="#78350f" />

            {/* Top Amber Highlight Ridge */}
            <rect x="16" y="9" width="6" height="1" fill="#f59e0b" />
            <rect x="14" y="10" width="3" height="1" fill="#f59e0b" />
            <rect x="22" y="10" width="2" height="1" fill="#b45309" />

            {/* Geometric Shell Plates */}
            <rect x="14" y="11" width="3" height="2" fill="#b45309" />
            <rect x="15" y="11" width="1" height="1" fill="#d97706" />
            <rect x="19" y="11" width="4" height="2" fill="#b45309" />
            <rect x="20" y="11" width="2" height="1" fill="#d97706" />

            <rect x="12" y="14" width="3" height="2" fill="#92400e" />
            <rect x="12" y="14" width="2" height="1" fill="#b45309" />
            <rect x="16" y="14" width="4" height="2" fill="#b45309" />
            <rect x="17" y="14" width="2" height="1" fill="#d97706" />
            <rect x="21" y="14" width="4" height="2" fill="#92400e" />
            <rect x="22" y="14" width="2" height="1" fill="#b45309" />

            {/* Seams between plates */}
            <rect x="17" y="10" width="1" height="4" fill="#451a03" />
            <rect x="11" y="13" width="15" height="1" fill="#451a03" />
            <rect x="15" y="13" width="1" height="4" fill="#451a03" />
            <rect x="20" y="13" width="1" height="4" fill="#451a03" />

            {/* Shell Rim / Scutes along bottom border */}
            <rect x="11" y="16" width="15" height="1" fill="#d97706" />
            <rect x="12" y="16" width="2" height="1" fill="#fbbf24" />
            <rect x="16" y="16" width="2" height="1" fill="#fbbf24" />
            <rect x="21" y="16" width="2" height="1" fill="#fbbf24" />
            <rect x="11" y="17" width="1" height="1" fill="#92400e" />
            <rect x="25" y="17" width="1" height="1" fill="#451a03" />
          </g>

          {/* Secret Easter Egg Laptop */}
          {isLaptop && (
            <g className="turtle-laptop">
              <rect x="2" y="19" width="7" height="2" fill="#1e2433" />
              <rect x="3" y="19" width="5" height="1" fill="#3a455e" />
              <rect x="2" y="13" width="1" height="6" fill="#1e2433" />
              <rect x="3" y="14" width="1" height="5" fill="#38bdf8" />
              <rect x="3" y="15" width="1" height="2" fill="#ffffff" />
              <rect x="7" y="17" width="2" height="3" fill="#22c55e" />
              <rect x="6" y="18" width="2" height="2" fill="#4ade80" />
            </g>
          )}

          {/* Head & Expression */}
          <g
            className="turtle-head"
            style={{
              transform: `translateY(${headYOffset}px)`,
              transition: 'transform 180ms ease-out',
            }}
          >
            <rect x="10" y="14" width="2" height="3" fill="#16a34a" />
            <rect x="5" y="11" width="6" height="5" fill="#22c55e" />
            <rect x="6" y="11" width="4" height="1" fill="#86efac" />
            <rect x="5" y="12" width="1" height="3" fill="#4ade80" />
            <rect x="5" y="15" width="6" height="1" fill="#16a34a" />
            <rect x="5" y="16" width="5" height="1" fill="#15803d" />
            <rect x="4" y="13" width="1" height="2" fill="#16a34a" />
            <rect x="4" y="13" width="1" height="1" fill="#22c55e" />

            {/* Expression Eyes */}
            {isSleeping ? (
              <g className="turtle-eye-sleeping">
                <rect x="6" y="14" width="3" height="1" fill="#14532d" />
              </g>
            ) : isWaking ? (
              <g className="turtle-eye-waking">
                <rect x="6" y="14" width="3" height="1" fill="#0f172a" />
                <rect x="7" y="14" width="1" height="1" fill="#38bdf8" />
              </g>
            ) : isHappy ? (
              <g className="turtle-eye-happy">
                <rect x="6" y="13" width="1" height="1" fill="#38bdf8" />
                <rect x="7" y="12" width="1" height="1" fill="#38bdf8" />
                <rect x="8" y="13" width="1" height="1" fill="#38bdf8" />
                <rect x="5" y="14" width="2" height="1" fill="#f59e0b" />
              </g>
            ) : isBlinking ? (
              <g className="turtle-eye-blinking">
                <rect x="6" y="13" width="3" height="1" fill="#14532d" />
              </g>
            ) : isCurious || lookDirection === 'up' ? (
              <g className="turtle-eye-curious">
                <rect x="6" y="12" width="3" height="3" fill="#0f172a" />
                <rect x="8" y="12" width="1" height="1" fill="#ffffff" />
                <rect x="7" y="13" width="1" height="1" fill="#38bdf8" />
                <rect x="6" y="11" width="2" height="1" fill="#15803d" />
              </g>
            ) : isListening ? (
              <g className="turtle-eye-listening">
                <rect x="6" y="13" width="3" height="2" fill="#0f172a" />
                <rect x="7" y="13" width="1" height="1" fill="#ffffff" />
                <rect x="8" y="13" width="1" height="1" fill="#38bdf8" />
                <rect x="9" y="11" width="2" height="3" fill="#38bdf8" />
                <rect x="9" y="12" width="1" height="1" fill="#ffffff" />
              </g>
            ) : isFocused ? (
              <g className="turtle-eye-focused">
                <rect x="6" y="13" width="3" height="2" fill="#0f172a" />
                <rect x="6" y="13" width="1" height="1" fill="#ffffff" />
                <rect x="7" y="13" width="2" height="1" fill="#38bdf8" />
                <rect x="5" y="12" width="3" height="1" fill="#15803d" />
              </g>
            ) : lookDirection === 'forward' ? (
              <g className="turtle-eye-visitor">
                <rect x="6" y="13" width="3" height="2" fill="#0f172a" />
                <rect x="7" y="13" width="1" height="1" fill="#ffffff" />
                <rect x="8" y="13" width="1" height="1" fill="#38bdf8" />
              </g>
            ) : (
              <g className="turtle-eye-idle">
                <rect x="6" y="13" width="3" height="2" fill="#0f172a" />
                <rect x="6" y="13" width="1" height="1" fill="#ffffff" />
                <rect x="7" y="13" width="1" height="1" fill="#38bdf8" />
                <rect x="7" y="14" width="1" height="1" fill="#0f172a" />
              </g>
            )}
          </g>
        </g>
      </g>
    </svg>
  );
}
