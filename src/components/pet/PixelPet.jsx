import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PixelPetSprite } from './PixelPetSprite';
import { usePortfolio } from '../../context/PortfolioContext';

const STORAGE_KEY_INTERACTIONS = 'milind_turtle_interactions';
const STORAGE_KEY_SECTIONS = 'milind_turtle_visited_sections';
const STORAGE_KEY_SECRET = 'milind_turtle_secret_unlocked';

export function PixelPet({ activeSection = 'hero' }) {
  const { selectedProject, isCommandPaletteOpen, isTelemetryOpen } = usePortfolio();

  // Core creature state
  const [petState, setPetState] = useState('idle');
  const [speechText, setSpeechText] = useState('');
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isNearCursor, setIsNearCursor] = useState(false);
  const [lookDirection, setLookDirection] = useState('forward');

  // Walking & Translation Positioning state
  const [positionX, setPositionX] = useState(42); // Start at Right home dock (42px)
  const [directionScale, setDirectionScale] = useState(-1); // 1 = right, -1 = left
  const [isWalking, setIsWalking] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0); // 0 | 1 alternating leg stride

  // Persistence & Discovery initialized safely
  const [interactionCount, setInteractionCount] = useState(() => {
    try {
      return parseInt(
        localStorage.getItem(STORAGE_KEY_INTERACTIONS) ||
        localStorage.getItem('milind_pet_interactions') ||
        '0',
        10
      );
    } catch {
      return 0;
    }
  });

  const [hasVisitedMultiple, setHasVisitedMultiple] = useState(() => {
    try {
      const visited = JSON.parse(
        localStorage.getItem(STORAGE_KEY_SECTIONS) ||
        localStorage.getItem('milind_pet_visited_sections') ||
        '[]'
      );
      return visited.length >= 3;
    } catch {
      return false;
    }
  });

  const [hasUnlockedSecret, setHasUnlockedSecret] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SECRET) === 'true';
    } catch {
      return false;
    }
  });

  // Refs for animation frame loop, timers & interaction tracking
  const petDockRef = useRef(null);
  const characterRef = useRef(null);
  const currentXRef = useRef(42);
  const directionScaleRef = useRef(-1);
  const isWalkingRef = useRef(false);
  const isUserInteractingRef = useRef(false);
  const isHoveredRef = useRef(false);

  const rafIdRef = useRef(null);
  const scheduleNextActionRef = useRef(null);
  const autonomousTimerRef = useRef(null);
  const userCooldownTimerRef = useRef(null);
  const blinkTimerRef = useRef(null);
  const clickResetTimerRef = useRef(null);
  const sleepNapTimerRef = useRef(null);

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
    directionScaleRef.current = directionScale;
  }, [directionScale]);

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
  // Autonomous Walking & Animation System
  // --------------------------------------------------------------------------

  const performAutonomousWalk = useCallback(() => {
    // Cancel any currently running animation frame
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
    const minX = 0;
    const maxX = isMobile ? 40 : 54;
    const currentX = currentXRef.current;

    // Pick targetX at least 20px and at most 54px away to ensure clearly visible translation
    let targetX;
    let attempts = 0;
    do {
      targetX = Math.round(minX + Math.random() * (maxX - minX));
      attempts++;
    } while (Math.abs(targetX - currentX) < 20 && attempts < 15);

    // If still too close, step toward whichever side has room
    if (Math.abs(targetX - currentX) < 20) {
      targetX = currentX > (minX + maxX) / 2 ? minX + 4 : maxX - 4;
    }

    // Direction:
    // If targetX > currentX -> direction = right -> directionScale = 1
    // If targetX < currentX -> direction = left -> directionScale = -1 (flipped)
    const newDirScale = targetX > currentX ? 1 : -1;
    setDirectionScale(newDirScale);
    directionScaleRef.current = newDirScale;

    const distance = Math.abs(targetX - currentX);
    // Slow natural turtle crawling speed (~16 px/sec)
    const speed = 16;
    const duration = Math.round((distance / speed) * 1000); // 1500ms - 3400ms

    const startX = currentX;
    const startTime = performance.now();

    setIsWalking(true);
    isWalkingRef.current = true;
    setPetState('walk');

    const animateWalk = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Continuous linear motion across platform
      const curX = startX + (targetX - startX) * progress;
      setPositionX(curX);
      currentXRef.current = curX;

      // Alternating leg cadence every 220ms
      const stepPhase = Math.floor(elapsed / 220) % 2;
      setWalkFrame(stepPhase);

      if (progress < 1 && isWalkingRef.current) {
        rafIdRef.current = requestAnimationFrame(animateWalk);
      } else {
        // Target reached!
        rafIdRef.current = null;
        setPositionX(targetX);
        currentXRef.current = targetX;
        setIsWalking(false);
        isWalkingRef.current = false;
        setWalkFrame(0); // Return legs to neutral resting position
        setPetState(getSectionMood());

        // Wait 4-8s before next autonomous action
        scheduleNextActionRef.current?.();
      }
    };

    rafIdRef.current = requestAnimationFrame(animateWalk);
  }, [getSectionMood]);

  const performAutonomousLookAround = useCallback(() => {
    // Glance in the opposite direction
    const oppositeDir = -directionScaleRef.current;
    setDirectionScale(oppositeDir);
    setLookDirection('up');

    setTimeout(() => {
      if (!isUserInteractingRef.current) {
        setDirectionScale(directionScaleRef.current);
        setLookDirection('forward');
      }
      scheduleNextActionRef.current?.();
    }, 2200);
  }, []);

  const performAutonomousCurious = useCallback(() => {
    setPetState('curious');
    setLookDirection('up');

    setTimeout(() => {
      if (!isUserInteractingRef.current) {
        setPetState(getSectionMood());
        setLookDirection('forward');
      }
      scheduleNextActionRef.current?.();
    }, 1800);
  }, [getSectionMood]);

  const performAutonomousHappy = useCallback(() => {
    setPetState('happy');

    setTimeout(() => {
      if (!isUserInteractingRef.current) {
        setPetState(getSectionMood());
      }
      scheduleNextActionRef.current?.();
    }, 1600);
  }, [getSectionMood]);

  const performAutonomousSleep = useCallback(() => {
    setPetState('sleeping');

    clearTimeout(sleepNapTimerRef.current);
    sleepNapTimerRef.current = setTimeout(() => {
      if (!isUserInteractingRef.current) {
        setPetState('waking');
        setTimeout(() => {
          setPetState(getSectionMood());
          scheduleNextActionRef.current?.();
        }, 350);
      } else {
        scheduleNextActionRef.current?.();
      }
    }, 4800);
  }, [getSectionMood]);

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
        scheduleNextActionRef.current?.(3500);
        return;
      }

      // Roll for autonomous action:
      // WALK: 60% (predominant action)
      // LOOK AROUND: 16%
      // CURIOUS: 12%
      // HAPPY: 8%
      // SLEEP: 4%
      const r = Math.random();

      if (r < 0.60) {
        // 1. WALK: Smoothly translate turtle across platform with walking legs
        performAutonomousWalk();
      } else if (r < 0.76) {
        // 2. LOOK AROUND: Turn & glance in opposite direction
        performAutonomousLookAround();
      } else if (r < 0.88) {
        // 3. CURIOUS: Alert glance or alert sparkle
        performAutonomousCurious();
      } else if (r < 0.96) {
        // 4. HAPPY: Tiny hop/bounce
        performAutonomousHappy();
      } else {
        // 5. SLEEP: Short nap
        performAutonomousSleep();
      }
    }, delay);
  }, [
    isCommandPaletteOpen,
    isTelemetryOpen,
    performAutonomousWalk,
    performAutonomousLookAround,
    performAutonomousCurious,
    performAutonomousHappy,
    performAutonomousSleep,
  ]);

  // Keep scheduleNextActionRef up to date
  useEffect(() => {
    scheduleNextActionRef.current = scheduleNextAction;
  }, [scheduleNextAction]);

  // Start autonomous scheduler on mount and clean up rAF on unmount
  useEffect(() => {
    scheduleNextActionRef.current?.(3800);
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      clearTimeout(autonomousTimerRef.current);
      clearTimeout(userCooldownTimerRef.current);
      clearTimeout(sleepNapTimerRef.current);
      clearTimeout(clickResetTimerRef.current);
      clearTimeout(blinkTimerRef.current);
    };
  }, []);

  // --------------------------------------------------------------------------
  // User Interaction Priority & Cooldown
  // --------------------------------------------------------------------------

  const notifyUserActivity = useCallback((pauseDuration = 4000) => {
    isUserInteractingRef.current = true;
    clearTimeout(autonomousTimerRef.current);
    clearTimeout(userCooldownTimerRef.current);

    // Cancel rAF loop immediately and freeze cleanly at current position
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (isWalkingRef.current) {
      setIsWalking(false);
      isWalkingRef.current = false;
      setWalkFrame(0);
      setPetState(getSectionMood());
    }

    userCooldownTimerRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
      // Resume autonomous activity after 3-5 seconds cooldown
      scheduleNextActionRef.current?.(3500 + Math.random() * 1500);
    }, pauseDuration);
  }, [getSectionMood]);

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
  // Home dock is at ~42px. When positionX changes, offset tracks the difference.
  const speechBubbleOffset = positionX - 42;

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
          positionX={positionX}
          directionScale={directionScale}
          isWalking={isWalking}
          characterRef={characterRef}
        />
      </button>
    </aside>
  );
}
