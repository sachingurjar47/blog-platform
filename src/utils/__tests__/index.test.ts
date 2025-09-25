import {
  getInitials,
  formatDate,
  debounce,
  throttle,
  generateId,
  isValidEmail,
  sanitizeString,
  capitalize,
  truncateString,
} from "../index";

describe("utils/index", () => {
  describe("getInitials", () => {
    it("returns initials for full name", () => {
      expect(getInitials("John Doe")).toBe("JD");
    });

    it("returns single initial for single name", () => {
      expect(getInitials("John")).toBe("J");
    });

    it("handles empty string", () => {
      expect(getInitials("")).toBe("");
    });

    it("handles multiple names", () => {
      expect(getInitials("John Michael Doe")).toBe("JM");
    });
  });

  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = "2023-01-01T00:00:00.000Z";
      const result = formatDate(date);
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("handles invalid date", () => {
      const result = formatDate("invalid");
      expect(result).toBeDefined();
    });
  });

  describe("debounce", () => {
    it("debounces function calls", (done) => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 150);
    });
  });

  describe("throttle", () => {
    it("throttles function calls", (done) => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 150);
    });
  });

  describe("generateId", () => {
    it("generates unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe("string");
      expect(typeof id2).toBe("string");
    });
  });

  describe("isValidEmail", () => {
    it("validates correct email", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
    });

    it("rejects invalid email", () => {
      expect(isValidEmail("invalid-email")).toBe(false);
    });

    it("handles empty string", () => {
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("sanitizeString", () => {
    it("sanitizes string correctly", () => {
      const input = "  Test  String  ";
      const result = sanitizeString(input);
      expect(result).toBe("Test String");
    });

    it("handles empty string", () => {
      expect(sanitizeString("")).toBe("");
    });
  });

  describe("capitalize", () => {
    it("capitalizes first letter", () => {
      expect(capitalize("test")).toBe("Test");
    });

    it("handles empty string", () => {
      expect(capitalize("")).toBe("");
    });
  });

  describe("truncateString", () => {
    it("truncates string correctly", () => {
      const input = "This is a very long string";
      const result = truncateString(input, 10);
      expect(result).toBe("This is a ...");
    });

    it("returns original string if shorter than limit", () => {
      const input = "Short";
      const result = truncateString(input, 10);
      expect(result).toBe("Short");
    });
  });
});
