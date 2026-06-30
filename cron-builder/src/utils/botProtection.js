const SESSION_KEY = 'cron_builder_bot_score';
const HONEYPOT_FIELD_NAME = 'cron_builder_website_url';
const MIN_INTERACTION_DELAY_MS = 100;
const MOUSE_CHECK_WINDOW_MS = 5000;
const MIN_MOUSE_EVENTS = 1;

let botScore = 0;
let pageLoadTime = 0;
let mouseEventCount = 0;
let firstInteractionTime = 0;
let mouseCheckDone = false;
let featuresDisabled = false;

function loadScore() {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) {
        botScore = parsed;
        if (botScore >= 3) {
          featuresDisabled = true;
        }
      }
    }
  } catch {
    // sessionStorage might be unavailable
  }
}

function saveScore() {
  try {
    sessionStorage.setItem(SESSION_KEY, String(botScore));
  } catch {
    // sessionStorage might be unavailable
  }
}

function addScore(points, reason) {
  botScore += points;
  saveScore();
  if (typeof console !== 'undefined' && console.warn) {
    console.warn(`[BotProtection] Suspicious activity: ${reason} (score: ${botScore})`);
  }
  if (botScore >= 3) {
    featuresDisabled = true;
  }
}

export function initBotProtection() {
  pageLoadTime = Date.now();
  loadScore();

  const mouseHandler = () => {
    mouseEventCount++;
  };
  window.addEventListener('mousemove', mouseHandler, { passive: true });

  setTimeout(() => {
    if (mouseEventCount < MIN_MOUSE_EVENTS && !mouseCheckDone) {
      addScore(1, 'no mouse movement detected in first 5 seconds');
    }
    mouseCheckDone = true;
    window.removeEventListener('mousemove', mouseHandler);
  }, MOUSE_CHECK_WINDOW_MS);

  return () => {
    window.removeEventListener('mousemove', mouseHandler);
  };
}

export function checkWebdriver() {
  try {
    if (navigator.webdriver === true) {
      addScore(2, 'navigator.webdriver is true');
      return true;
    }
  } catch {
    // navigator might be restricted
  }
  return false;
}

export function checkPlugins() {
  try {
    if (navigator.plugins && navigator.plugins.length === 0) {
      addScore(1, 'no browser plugins detected');
      return true;
    }
  } catch {
    // navigator might be restricted
  }
  return false;
}

export function checkLanguages() {
  try {
    if (!navigator.languages || navigator.languages.length === 0) {
      addScore(1, 'no languages detected');
      return true;
    }
  } catch {
    // navigator might be restricted
  }
  return false;
}

export function recordInteraction() {
  const now = Date.now();
  if (firstInteractionTime === 0) {
    firstInteractionTime = now;
    const delay = now - pageLoadTime;
    if (delay < MIN_INTERACTION_DELAY_MS) {
      addScore(2, `interaction too fast (${delay}ms after page load)`);
      return true;
    }
  }
  return false;
}

export function checkHoneypot(value) {
  if (value && value.trim().length > 0) {
    addScore(3, 'honeypot field was filled');
    return true;
  }
  return false;
}

export function getBotScore() {
  return botScore;
}

export function isFeaturesDisabled() {
  return featuresDisabled;
}

export function isLikelyBot() {
  return botScore >= 3;
}

export function resetBotProtection() {
  botScore = 0;
  mouseEventCount = 0;
  firstInteractionTime = 0;
  mouseCheckDone = false;
  featuresDisabled = false;
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // sessionStorage might be unavailable
  }
}

export function getHoneypotFieldName() {
  return HONEYPOT_FIELD_NAME;
}

export function runAllChecks() {
  checkWebdriver();
  checkPlugins();
  checkLanguages();
  return getBotScore();
}
