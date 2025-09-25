import {
  extractTextContent,
  truncateContent,
  getWordCount,
  getReadingTime,
  isEmptyContent,
} from "../contentUtils";
import { EditorJSData } from "@/types/editorjs";

describe("contentUtils", () => {
  describe("extractTextContent", () => {
    it("extracts text from EditorJS data", () => {
      const editorData: EditorJSData = {
        blocks: [
          {
            type: "paragraph",
            data: {
              text: "This is a test paragraph.",
            },
          },
          {
            type: "header",
            data: {
              text: "Test Header",
              level: 1,
            },
          },
        ],
      };

      const result = extractTextContent(editorData);
      expect(result).toBe("This is a test paragraph. Test Header");
    });

    it("handles empty EditorJS data", () => {
      const editorData: EditorJSData = {
        blocks: [],
      };

      const result = extractTextContent(editorData);
      expect(result).toBe("");
    });

    it("handles null/undefined input", () => {
      expect(extractTextContent(null as unknown as EditorJSData)).toBe("");
      expect(extractTextContent(undefined as unknown as EditorJSData)).toBe("");
    });
  });

  describe("truncateContent", () => {
    it("truncates content to specified length", () => {
      const content = "This is a very long content that should be truncated.";
      const result = truncateContent(content, 20);
      expect(result).toBe("This is a very long ...");
    });

    it("returns original content if shorter than limit", () => {
      const content = "Short content";
      const result = truncateContent(content, 20);
      expect(result).toBe("Short content");
    });

    it("handles empty content", () => {
      const result = truncateContent("", 20);
      expect(result).toBe("");
    });
  });

  describe("getWordCount", () => {
    it("counts words correctly", () => {
      const content = "This is a test content with multiple words.";
      const result = getWordCount(content);
      expect(result).toBe(8);
    });

    it("handles empty content", () => {
      const result = getWordCount("");
      expect(result).toBe(0);
    });

    it("handles content with extra spaces", () => {
      const content = "  This   is   a   test  ";
      const result = getWordCount(content);
      expect(result).toBe(4);
    });
  });

  describe("getReadingTime", () => {
    it("calculates reading time correctly", () => {
      const content =
        "This is a test content with multiple words for reading time calculation.";
      const result = getReadingTime(content);
      expect(result).toBeGreaterThan(0);
    });

    it("handles empty content", () => {
      const result = getReadingTime("");
      expect(result).toBe(1);
    });
  });

  describe("isEmptyContent", () => {
    it("returns true for empty EditorJS data", () => {
      const editorData: EditorJSData = {
        blocks: [],
      };

      const result = isEmptyContent(editorData);
      expect(result).toBe(true);
    });

    it("returns false for non-empty EditorJS data", () => {
      const editorData: EditorJSData = {
        blocks: [
          {
            type: "paragraph",
            data: {
              text: "This is a test paragraph.",
            },
          },
        ],
      };

      const result = isEmptyContent(editorData);
      expect(result).toBe(false);
    });

    it("handles null/undefined input", () => {
      expect(isEmptyContent(null as unknown as EditorJSData)).toBe(true);
      expect(isEmptyContent(undefined as unknown as EditorJSData)).toBe(true);
    });
  });
});
