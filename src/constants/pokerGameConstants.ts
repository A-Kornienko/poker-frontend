// timers for game events and animations
export const TIMERS = {
  TIMER_INTERVAL: 1000, // Countdown timer interval
  WINNERS_DISPLAY: 5000, // Winners display time
  RECONNECT_DELAY: 100, // Post-token refresh delay
  INITIAL_RECONNECT: 5000, // Initial SSE reconnection delay
  ANIMATION_DURATION: 1000, // Bank animation duration
};

// Percentages for bar color
export const BAR_COLOR_THRESHOLDS = {
  RED: 30,
  YELLOW: 60,
};

// initial values for game settings
export const INITIAL_VALUES = {
  STACK: 50, // initial stack size in big blinds
  GRID_FALLBACK: "3 / 5", // fallback grid area for players and chips if position is undefined
};

// colors for UI elements
export const COLORS = {
  BAR_RED: "bg-red-500",
  BAR_YELLOW: "bg-yellow-500",
  BAR_GREEN: "bg-green-500",
};

// z-index for layering components
export const Z_INDEXES = {
  TABLE_BACKGROUND: 0,
  CARDS: 10,
  PLAYERS: 20,
  CHIPS: 30,
  CONTROLS: 30,
  LOADER: 20,
};

// animation classes
export const ANIMATIONS = {
  CARD_DELAY_MULTIPLIER: 0.2,
  PULSE_CLASS: "my-animate-pulse",
  DEAL_CARD_CLASS: "my-animate-deal-card",
};

// size constants for components
export const SIZES = {
  CARD_WIDTH: "w-12 md:w-16",
  CARD_HEIGHT: "h-20 md:h-24",
  TABLE_ASPECT: "aspect-[5/3]",
  MAX_WIDTH: "max-w-[70vw]",
};

// getGridArea
export const GRID_AREAS = {
  player: {
    1: "5 / 5 / 7 / 7",
    2: "5 / 7 / 7 / 9",
    3: "4 / 10 / 5 / 11",
    4: "2 / 10 / 4 / 11",
    5: "1 / 7 / 2 / 9",
    6: "1 / 5 / 2 / 7",
    7: "1 / 3 / 2 / 5",
    8: "2 / 1 / 4 / 2",
    9: "4 / 1 / 5 / 2",
    10: "5 / 3 / 7 / 5",
  },
  blindChip: {
    1: "4 / 3 / 6 / 8",
    2: "4 / 7 / 6 / 7",
    3: "4 / 9 / 6 / 9",
    4: "3 / 9 / 4 / 10",
    5: "2 / 7 / 3 / 8",
    6: "2 / 5 / 3 / 6",
    7: "2 / 3 / 3 / 4",
    8: "3 / 2 / 4 / 3",
    9: "4 / 2 / 6 / 3",
    10: "4 / 3 / 6 / 4",
  },
  betChip: {
    1: "4 / 5 / 6 / 8",
    2: "4 / 8 / 6 / 9",
    3: "4 / 9 / 5 / 10",
    4: "2 / 9 / 4 / 10",
    5: "2 / 8 / 3 / 9",
    6: "2 / 6 / 3 / 6",
    7: "2 / 4 / 3 / 4",
    8: "2 / 2 / 4 / 3",
    9: "4 / 2 / 5 / 3",
    10: "4 / 4 / 6 / 4",
  },
};