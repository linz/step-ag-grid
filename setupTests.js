// This needs to happen before setupTests.tsx, hence why it's in a separate file

// Suppress for all tests.

const SUPPRESSED_ERRORS = ["Error: Could not parse CSS stylesheet"];

const originalError = console.error.bind(console.error);
console.error = (...args) => {
  const consoleMessage = args.toString();
  !SUPPRESSED_ERRORS.some((s) => {
    if (!Array.isArray(s)) s = [s];
    return !s.some((match) => !consoleMessage.includes(match));
  }) && originalError(...args);
};

global.console = {
  ...console,
  info: jest.fn(),
  warn: jest.fn(),
};

export {};
