/**
 * Utility functions for the blog platform
 * Centralized utility functions for better maintainability and reusability
 */

/**
 * Generates initials from a name string
 * @param input - The input string to generate initials from
 * @param size - Maximum number of initials to return (default: 2)
 * @returns String of initials in uppercase
 *
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("John Michael Doe", 3) // "JMD"
 * getInitials("") // ""
 */
export function getInitials(input: string = "", size: number = 2): string {
  if (!input || typeof input !== "string" || !input.trim()) {
    return "";
  }

  const words = input.trim().split(/\s+/);
  let initials = "";

  for (let i = 0; i < words.length && initials.length < size; i++) {
    const word = words[i];
    if (word && word.length > 0) {
      initials += word[0].toUpperCase();
    }
  }

  return initials;
}

/**
 * Formats a date string to a readable format
 * @param dateString - ISO date string
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 *
 * @example
 * formatDate("2023-12-25T10:30:00Z") // "Dec 25, 2023"
 * formatDate("2023-12-25T10:30:00Z", { timeStyle: "short" }) // "10:30 AM"
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-US", options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}

/**
 * Debounces a function call
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 *
 * @example
 * const debouncedSearch = debounce((query) => {
 *   // Search logic
 * }, 300);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttles a function call
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 *
 * @example
 * const throttledScroll = throttle((event) => {
 *   // Scroll logic
 * }, 100);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generates a random ID
 * @param length - Length of the ID (default: 8)
 * @returns Random alphanumeric string
 *
 * @example
 * generateId() // "a1b2c3d4"
 * generateId(12) // "a1b2c3d4e5f6"
 */
export function generateId(length: number = 8): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * Validates an email address
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 *
 * @example
 * isValidEmail("user@example.com") // true
 * isValidEmail("invalid-email") // false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitizes a string by removing HTML tags and trimming whitespace
 * @param input - String to sanitize
 * @returns Sanitized string
 *
 * @example
 * sanitizeString("<p>Hello World</p>") // "Hello World"
 * sanitizeString("  Hello World  ") // "Hello World"
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim();
}

/**
 * Capitalizes the first letter of a string
 * @param str - String to capitalize
 * @returns String with first letter capitalized
 *
 * @example
 * capitalize("hello world") // "Hello world"
 * capitalize("HELLO") // "HELLO"
 */
export function capitalize(str: string): string {
  if (!str || typeof str !== "string") {
    return "";
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to a specified length
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: "...")
 * @returns Truncated string
 *
 * @example
 * truncateString("Hello World", 5) // "Hello..."
 * truncateString("Hello World", 5, "…") // "Hello…"
 */
export function truncateString(
  str: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (!str || typeof str !== "string" || str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength) + suffix;
}
