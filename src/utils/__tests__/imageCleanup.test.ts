import {
  trackUploadedImage,
  removeUploadedImage,
  cleanupUploadedImages,
  getUploadedImages,
  clearUploadedImages,
} from "../imageCleanup";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

// Mock console.log to avoid test output noise
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe("imageCleanup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the in-memory array before each test
    clearUploadedImages();
  });

  describe("trackUploadedImage", () => {
    it("tracks uploaded image", () => {
      trackUploadedImage("test-image.jpg");
      const images = getUploadedImages();
      expect(images).toContain("test-image.jpg");
    });
  });

  describe("removeUploadedImage", () => {
    it("removes uploaded image", () => {
      trackUploadedImage("test-image.jpg");
      removeUploadedImage("test-image.jpg");
      const images = getUploadedImages();
      expect(images).not.toContain("test-image.jpg");
    });
  });

  describe("cleanupUploadedImages", () => {
    it("cleans up uploaded images", async () => {
      trackUploadedImage("test-image.jpg");
      await cleanupUploadedImages();
      const images = getUploadedImages();
      expect(images).toHaveLength(0);
    });
  });

  describe("getUploadedImages", () => {
    it("returns uploaded images", () => {
      const result = getUploadedImages();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("clearUploadedImages", () => {
    it("clears uploaded images", () => {
      trackUploadedImage("test-image.jpg");
      clearUploadedImages();
      const images = getUploadedImages();
      expect(images).toHaveLength(0);
    });
  });
});
