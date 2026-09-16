import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PixelPetSprite } from './PixelPetSprite';
import { usePortfolio } from '../../context/PortfolioContext';

const STORAGE_KEY_INTERACTIONS = 'milind_turtle_interactions';
const STORAGE_KEY_SECTIONS = 'milind_turtle_visited_sections';
const STORAGE_KEY_SECRET = 'milind_turtle_secret_unlocked';

// Position offsets on platform runway (in CSS pixels, within 144px platform)
// Position 0 = Left (near sprout, offset 0px)
// Position 1 = Center (offset 25px)
// Position 2 = Right (home dock, offset 50px)
const POS_PX = [0, 25, 50];

export function PixelPet({ activeSection = 'hero' }) {
  const { selectedProject, isCommandPaletteOpen, isTelemetryOpen } = usePortfolio();

  // Core creature state
  const [petState, setPetState] = useState('idle');
  const [speechText, setSpeechText] = useState('');
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isNearCursor, setIsNearCursor] = useState(false);
  const [lookDirection, setLookDirection] = useState('forward');

  // Walking & Positioning state
  const [currentPosIndex, setCurrentPosIndex] = useState(2); // Start at Right (home = 50px)
  const [walkPx, setWalkPx] = useState(50);
  const [walkDuration, setWalkDuration] = useState(2600);
  const [isWalking, setIsWalking] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0);
  const [facing, setFacing] = useState('left');

  // Persistence & Discovery
  const [interactionCount, setInteractionCount] = useState(0);
  const [hasVisitedMultiple, setHasVisitedMultiple] = useState(false);
  const [hasUnlockedSecret, setHasUnlockedSecret] = useState(false);

  // Refs for timers & interaction tracking
  const petDockRef = useRef(null);
  const currentPosRef = useRef(2);
  const facingRef = useRef('left');
  const isWalkingRef = useRef(false);
  const isUserInteractingRef = useRef(false);
  const isHoveredRef = useRef(false);

  const autonomousTimerRef = useRef(null);
  const userCooldownTimerRef = useRef(null);
  const walkStepIntervalRef = useRef(null);
  const walkFinishTimerRef = useRef(null);
  const blinkTimerRef = useRef(null);
  const clickResetTimerRef = useRef(null);
  const sleepNapTimerRef = useRef(null);

  // Initialize persistence from localStorage
  useEffect(() => {
    try {
      const savedCount = parseInt(
        localStorage.getItem(STORAGE_KEY_INTERACTIONS) ||
        localStorage.getItem('milind_pet_interactions') ||
        '0',
        10
      );
      setInteractionCount(savedCount);

      const visited = JSON.parse(
        localStorage.getItem(STORAGE_KEY_SECTIONS) ||
        localStorage.getItem('milind_pet_visited_sections') ||
        '[]'
      );
      if (visited.length >= 3) {
        setHasVisitedMultiple(true);
      }

      const secretUnlocked = localStorage.getItem(STORAGE_KEY_SECRET) === 'true';
      setHasUnlockedSecret(secretUnlocked);
    } catch {
      // Fallback gracefully
    }
  }, []);

  // Track visited sections
  useEffect(() => {
    if (!activeSection) return;
    try {
      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY_SECTIONS) ||
        localStorage.getItem('milind_pet_visited_sections') ||
        '[]'
      );
      const visited = new Set(stored);
      visited.add(activeSection);
      const arr = Array.from(visited);
      localStorage.setItem(STORAGE_KEY_SECTIONS, JSON.stringify(arr));
      if (arr.length >= 3) {
        setHasVisitedMultiple(true);
      }
    } catch {
      // Ignore
    }
  }, [activeSection]);

  // Section-based reactive mood
  const getSectionMood = useCallback(() => {
    if (selectedProject) {
      if (selectedProject.id === 'audio-comparison-tool') return 'listening';
      return 'curious';
    }

    switch (activeSection) {
      case 'projects':
        return 'curious';
      case 'skills':
        return 'focused';
      case 'experience':
        return 'idle';
      case 'education':
        return 'sleeping';
      case 'contact':
        return 'happy';
      default:
        return 'idle';
    }
  }, [activeSection, selectedProject]);

  // Keep refs in sync
  useEffect(() => {
    currentPosRef.current = currentPosIndex;
  }, [currentPosIndex]);

  useEffect(() => {
    facingRef.current = facing;
  }, [facing]);

  useEffect(() => {
    isWalkingRef.current = isWalking;
  }, [isWalking]);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Idle natural eye blinking (every 3.5 - 7.5s)
  useEffect(() => {
    const triggerBlink = () => {
      if (petState !== 'sleeping') {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 140);
      }
      const nextDelay = 3500 + Math.random() * 4000;
      blinkTimerRef.current = setTimeout(triggerBlink, nextDelay);
    };

    blinkTimerRef.current = setTimeout(triggerBlink, 3200);
    return () => clearTimeout(blinkTimerRef.current);
  }, [petState]);

  // --------------------------------------------------------------------------
  // Autonomous Action Handlers
  // --------------------------------------------------------------------------

  const scheduleNextAction = useCallback((delayOverride) => {
    clearTimeout(autonomousTimerRef.current);

    // Random idle duration: 4.0 - 8.0 seconds
    const delay = delayOverride ?? (4000 + Math.random() * 4000);

    autonomousTimerRef.current = setTimeout(() => {
      // Check user interaction or modal overlay
      if (
        isUserInteractingRef.current ||
        isHoveredRef.current ||
        isCommandPaletteOpen ||
        isTelemetryOpen
      ) {
        // Postpone check after a short rest
        scheduleNextAction(3500);
        return;
      }

      // Roll for autonomous action:
      // WALK: 50%
      // LOOK AROUND: 20%
      // CURIOUS: 15%
      // HAPPY: 10%
      // SLEEP: 5%
      const r = Math.random();

      if (r < 0.50) {
        // 1. WALK: Move 25px to 50px across platform
        performAutonomousWalk();
      } else if (r < 0.70) {
        // 2. LOOK AROUND: Look in opposite direction
        performAutonomousLookAround();
      } else if (r < 0.85) {
        // 3. CURIOUS: Alert glance or look toward cursor
        performAutonomousCurious();
      } else if (r < 0.95) {
        // 4. HAPPY: Tiny hop/bounce
        performAutonomousHappy();
      } else {
        // 5. SLEEP: Short nap
        performAutonomousSleep();
      }
    }, delay);
  }, [isCommandPaletteOpen, isTelemetryOpen]);

  const performAutonomousWalk = useCallback(() => {
    const currentPos = currentPosRef.current;
    let nextPos;

    if (currentPos === 2) {
      // At Right: walk to Left (0, 50px) or Center (1, 25px)
      nextPos = Math.random() < 0.5 ? 0 : 1;
    } else if (currentPos === 0) {
      // At Left: walk to Right (2, 50px) or Center (1, 25px)
      nextPos = Math.random() < 0.5 ? 2 : 1;
    } else {
      // At Center: walk to Left (0) or Right (2)
      nextPos = Math.random() < 0.5 ? 0 : 2;
    }

    const distanceUnits = Math.abs(nextPos - currentPos);
    // Slow turtle speed: ~2.4s for 25px, ~3.6s for 50px
    const duration = distanceUnits === 2 ? 3600 : 2400;

    // Face the direction of motion
    const nextFacing = nextPos < currentPos ? 'left' : 'right';
    setFacing(nextFacing);

    // Start walking
    setPetState('walk');
    setIsWalking(true);
    setWalkDuration(duration);
    setCurrentPosIndex(nextPos);
    setWalkPx(POS_PX[nextPos]);

    // Leg cadence interval (stepping every 300ms)
    clearInterval(walkStepIntervalRef.current);
    let step = 0;
    walkStepIntervalRef.current = setInterval(() => {
      step = step === 0 ? 1 : 0;
      setWalkFrame(step);
    }, 300);

    // On arrival
    clearTimeout(walkFinishTimerRef.current);
    walkFinishTimerRef.current = setTimeout(() => {
      clearInterval(walkStepIntervalRef.current);
      setIsWalking(false);
      setPetState(getSectionMood());

      // Idle pause of 4–8 seconds before next autonomous action
      scheduleNextAction();
    }, duration);
  }, [getSectionMood, scheduleNextAction]);

  const performAutonomousLookAround = useCallback(() => {
    // Turn in the opposite direction
    const oppositeFacing = facingRef.current === 'left' ? 'right' : 'left';
    setFacing(oppositeFacing);
    setLookDirection('up');

    setTimeout(() => {
      if (!isUserInteractingRef.current) {
        setFacing('left'); // return to default resting orientation
        setLookDirection('forward');
      }
      scheduleNextAction();
    }, 2200);
  }, [scheduleNextAction]);

  const performAutonomousCurious = useCallback(() => {
    setPetState('curious');
    setLookDirection('up');

    setTimeout(() => {
      if (!isUserInteractingRef.current) {
        setPetState(getSectionMood());
        setLookDirection('forward');
      }
      scheduleNextAction();
    }, 1800);
  }, [getSectionMood, scheduleNextAction]);

  const performAutonomousHappy = useCallback(() => {
    setPetState('happy');

    setTimeout(() => {
      if (!isUserInteractingRef.current) {
        setPetState(getSectionMood());
      }
      scheduleNextAction();
    }, 1600);
  }, [getSectionMood, scheduleNextAction]);

  const performAutonomousSleep = useCallback(() => {
    setPetState('sleeping');

    clearTimeout(sleepNapTimerRef.current);
    sleepNapTimerRef.current = setTimeout(() => {
      if (!isUserInteractingRef.current) {
        setPetState('waking');
        setTimeout(() => {
          setPetState(getSectionMood());
          scheduleNextAction();
        }, 350);
      } else {
        scheduleNextAction();
      }
    }, 4800);
  }, [getSectionMood, scheduleNextAction]);

  // Start autonomous scheduler on mount
  useEffect(() => {
    scheduleNextAction(4200);
    return () => {
      clearTimeout(autonomousTimerRef.current);
      clearTimeout(walkFinishTimerRef.current);
      clearInterval(walkStepIntervalRef.current);
      clearTimeout(sleepNapTimerRef.current);
    };
  }, [scheduleNextAction]);

  // --------------------------------------------------------------------------
  // User Interaction Priority & Cooldown
  // --------------------------------------------------------------------------

  const notifyUserActivity = useCallback((pauseDuration = 4000) => {
    isUserInteractingRef.current = true;
    clearTimeout(autonomousTimerRef.current);
    clearTimeout(userCooldownTimerRef.current);

    // If currently walking, stop walking cleanly at target position
    if (isWalkingRef.current) {
      setIsWalking(false);
      clearInterval(walkStepIntervalRef.current);
      clearTimeout(walkFinishTimerRef.current);
      setPetState(getSectionMood());
    }

    userCooldownTimerRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
      // Resume autonomous activity after 3-5 seconds cooldown
      scheduleNextAction(3500 + Math.random() * 1500);
    }, pauseDuration);
  }, [getSectionMood, scheduleNextAction]);

  // Cursor Proximity Awareness
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!petDockRef.current) return;
      const rect = petDockRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      if (distance < 140) {
        setIsNearCursor(true);
        notifyUserActivity(4000);

        if (e.clientY < rect.top) {
          setLookDirection('up');
        } else if (e.clientX < rect.left) {
          setLookDirection('left');
        } else {
          setLookDirection('forward');
        }

        // Wake up if sleeping
        if (petState === 'sleeping' && activeSection !== 'education') {
          setPetState('waking');
          setTimeout(() => setPetState(getSectionMood()), 300);
        }
      } else {
        if (isNearCursor) {
          setIsNearCursor(false);
          setLookDirection('forward');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isNearCursor, petState, activeSection, getSectionMood, notifyUserActivity]);

  // Scroll listener to prioritize user interaction
  useEffect(() => {
    const handleScroll = () => {
      notifyUserActivity(3500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [notifyUserActivity]);

  // Inactivity Sleep: 45s of no user activity -> deep sleep
  useEffect(() => {
    let inactivityTimer = null;

    const resetInactivity = () => {
      clearTimeout(inactivityTimer);
      if (petState === 'sleeping' && activeSection !== 'education') {
        setPetState('waking');
        setTimeout(() => setPetState(getSectionMood()), 300);
      }
      inactivityTimer = setTimeout(() => {
        if (!isUserInteractingRef.current) {
          setPetState('sleeping');
        }
      }, 45000);
    };

    window.addEventListener('mousemove', resetInactivity, { passive: true });
    window.addEventListener('keydown', resetInactivity, { passive: true });
    window.addEventListener('scroll', resetInactivity, { passive: true });
    inactivityTimer = setTimeout(() => setPetState('sleeping'), 45000);

    return () => {
      window.removeEventListener('mousemove', resetInactivity);
      window.removeEventListener('keydown', resetInactivity);
      window.removeEventListener('scroll', resetInactivity);
      clearTimeout(inactivityTimer);
    };
  }, [petState, activeSection, getSectionMood]);

  // Handle Click / Tap / Keyboard Interaction
  const handleInteract = () => {
    notifyUserActivity(4500);

    const newCount = interactionCount + 1;
    setInteractionCount(newCount);

    try {
      localStorage.setItem(STORAGE_KEY_INTERACTIONS, String(newCount));
    } catch {
      // Ignore
    }

    clearTimeout(clickResetTimerRef.current);

    // Progression, discovery & microcopy logic
    if (newCount === 1) {
      setPetState('happy');
      setSpeechText('hi.');
    } else if (newCount === 2) {
      setPetState('curious');
      setSpeechText('you found me.');
    } else if (newCount === 4) {
      setPetState('happy');
      setSpeechText('exploring?');
    } else if (newCount === 6 && !hasUnlockedSecret) {
      // Unlock Discovery Secret: Tiny voxel laptop
      setPetState('laptop');
      setSpeechText('compiling... 🐢💻');
      setHasUnlockedSecret(true);
      try {
        localStorage.setItem(STORAGE_KEY_SECRET, 'true');
      } catch {
        // Ignore
      }
    } else if (newCount > 6 && newCount % 5 === 0) {
      setPetState('laptop');
      setSpeechText('turtles ship too. 🐢⚡');
    } else if (hasVisitedMultiple && Math.random() > 0.6) {
      setPetState('happy');
      setSpeechText('slow down.');
    } else {
      // 30% chance of a silent cute hop reaction
      const isSilent = Math.random() < 0.3;
      if (isSilent) {
        setPetState(Math.random() > 0.5 ? 'happy' : 'curious');
        setSpeechText('');
      } else {
        const messages = [
          'hi.',
          'oh.',
          'nice.',
          'still here.',
          '...',
          'slow down.',
          'turtles ship too.'
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setPetState(Math.random() > 0.4 ? 'happy' : 'curious');
        setSpeechText(randomMsg);
      }
    }

    // Return to calm section state after 1.8s
    clickResetTimerRef.current = setTimeout(() => {
      setSpeechText('');
      setPetState(getSectionMood());
    }, 1800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleInteract();
    }
  };

  // Yield gracefully if full-screen command palette or telemetry modal is open
  if (isCommandPaletteOpen || isTelemetryOpen) {
    return null;
  }

  // Calculate speech bubble horizontal position to follow turtle
  const speechBubbleOffset = walkPx - 50;

  return (
    <aside
      ref={petDockRef}
      className="pixel-pet-dock"
      aria-label="Pixel turtle pet"
      role="complementary"
    >
      {/* Retro Pixel Speech Bubble (Tracks turtle position) */}
      {speechText && (
        <div
          className="pet-speech-bubble mono"
          role="status"
          aria-live="polite"
          style={{
            transform: `translateX(${speechBubbleOffset}px)`,
            transition: isWalking
              ? `transform ${walkDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`
              : 'transform 200ms ease-out',
          }}
        >
          <span>{speechText}</span>
          <span className="speech-pip" aria-hidden="true" />
        </div>
      )}

      {/* Interactive Pixel Companion Button */}
      <button
        type="button"
        onClick={handleInteract}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => {
          setIsHovered(true);
          notifyUserActivity(4000);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        className={`pixel-pet-trigger state-${petState} ${isHovered ? 'is-hovered' : ''} ${isNearCursor ? 'near-cursor' : ''}`}
        aria-label={`Pixel turtle (${petState}). Press Enter or Space to interact.`}
        title="Pixel Turtle · Click or press Enter"
      >
        <PixelPetSprite
          state={petState}
          isBlinking={isBlinking}
          lookDirection={isHovered ? 'forward' : lookDirection}
          walkFrame={walkFrame}
          walkPx={walkPx}
          walkDuration={walkDuration}
          isWalking={isWalking}
          facing={facing}
        />
      </button>
    </aside>
  );
}
