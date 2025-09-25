import { EditorJSData } from "../types/editorjs";
import { sanitizeString, truncateString } from "./index";

/**
 * Content utility functions for handling EditorJS data and text processing
 * Features:
 * - Text extraction from EditorJS blocks
 * - Content sanitization
 * - Text truncation
 * - HTML tag removal
 */

/**
 * Extracts plain text content from EditorJSData or returns the string as-is
 * @param content - String or EditorJSData to extract text from
 * @returns Extracted plain text content
 *
 * @example
 * extractTextContent("Hello World") // "Hello World"
 * extractTextContent({ blocks: [{ type: 'paragraph', data: { text: 'Hello' } }] }) // "Hello"
 */
export function extractTextContent(content: string | EditorJSData): string {
  if (typeof content === "string") {
    return content;
  }

  if (!content || !content.blocks || !Array.isArray(content.blocks)) {
    return "";
  }

  const extractedText = content.blocks
    .map((block) => {
      if (!block || !block.type || !block.data) {
        return "";
      }

      switch (block.type) {
        case "header":
          return (block.data as { text?: string }).text || "";
        case "paragraph":
          return (block.data as { text?: string }).text || "";
        case "list":
          return Array.isArray((block.data as { items?: unknown[] }).items)
            ? (block.data as { items: string[] }).items.join(" ")
            : "";
        case "quote":
          return (block.data as { text?: string }).text || "";
        case "code":
          return (block.data as { code?: string }).code || "";
        case "warning":
          const title = (block.data as { title?: string }).title || "";
          const message = (block.data as { message?: string }).message || "";
          return title && message ? `${title} ${message}` : title || message;
        case "image":
          return (block.data as { caption?: string }).caption || "";
        case "embed":
          return (block.data as { caption?: string }).caption || "";
        case "delimiter":
          return "---";
        case "table":
          // Extract text from table cells
          const tableData = block.data as { content?: unknown[][] };
          if (tableData.content && Array.isArray(tableData.content)) {
            return tableData.content
              .flat()
              .map((cell: unknown) => String(cell || ""))
              .join(" ");
          }
          return "";
        default:
          // Try to extract any text content from unknown block types
          if (block.data && typeof block.data === "object") {
            const textFields = Object.values(block.data)
              .filter((value) => typeof value === "string")
              .join(" ");
            return textFields;
          }
          return "";
      }
    })
    .join(" ");

  // Sanitize the extracted text
  return sanitizeString(extractedText);
}

/**
 * Truncates text content to specified length
 * @param content - String or EditorJSData to truncate
 * @param maxLength - Maximum length of the truncated text (default: 150)
 * @param suffix - Suffix to add when truncated (default: "...")
 * @returns Truncated text content
 *
 * @example
 * truncateContent("Hello World", 5) // "Hello..."
 * truncateContent({ blocks: [...] }, 100) // "Extracted text..."
 */
export function truncateContent(
  content: string | EditorJSData,
  maxLength: number = 150,
  suffix: string = "..."
): string {
  const text = extractTextContent(content);
  return truncateString(text, maxLength, suffix);
}

/**
 * Gets the word count of content
 * @param content - String or EditorJSData to count words in
 * @returns Number of words
 *
 * @example
 * getWordCount("Hello World") // 2
 * getWordCount({ blocks: [...] }) // 150
 */
export function getWordCount(content: string | EditorJSData): number {
  const text = extractTextContent(content);
  if (!text.trim()) return 0;

  return text.trim().split(/\s+/).length;
}

/**
 * Gets the reading time estimate for content
 * @param content - String or EditorJSData to estimate reading time for
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time in minutes
 *
 * @example
 * getReadingTime("Hello World") // 1
 * getReadingTime({ blocks: [...] }, 250) // 2
 */
export function getReadingTime(
  content: string | EditorJSData,
  wordsPerMinute: number = 200
): number {
  const wordCount = getWordCount(content);
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Checks if content is empty
 * @param content - String or EditorJSData to check
 * @returns Boolean indicating if content is empty
 *
 * @example
 * isEmptyContent("") // true
 * isEmptyContent("Hello") // false
 * isEmptyContent({ blocks: [] }) // true
 */
export function isEmptyContent(content: string | EditorJSData): boolean {
  if (typeof content === "string") {
    return !content.trim();
  }

  if (!content || !content.blocks || !Array.isArray(content.blocks)) {
    return true;
  }

  return (
    content.blocks.length === 0 ||
    content.blocks.every(
      (block) =>
        !block ||
        !block.data ||
        Object.values(block.data).every(
          (value) => !value || (typeof value === "string" && !value.trim())
        )
    )
  );
}
