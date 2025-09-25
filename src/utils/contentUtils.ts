import { EditorJSData } from '../types/editorjs';

/**
 * Extracts plain text content from EditorJSData or returns the string as-is
 */
export function extractTextContent(content: string | EditorJSData): string {
  if (typeof content === 'string') {
    return content;
  }

  if (!content || !content.blocks) {
    return '';
  }

  return content.blocks
    .map((block) => {
      switch (block.type) {
        case 'header':
          return block.data.text || '';
        case 'paragraph':
          return block.data.text || '';
        case 'list':
          return block.data.items?.join(' ') || '';
        case 'quote':
          return block.data.text || '';
        case 'code':
          return block.data.code || '';
        case 'warning':
          return `${block.data.title || ''} ${block.data.message || ''}`;
        case 'image':
          return block.data.caption || '';
        case 'embed':
          return block.data.caption || '';
        case 'delimiter':
          return '---';
        default:
          return '';
      }
    })
    .join(' ')
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

/**
 * Truncates text content to specified length
 */
export function truncateContent(content: string | EditorJSData, maxLength: number = 150): string {
  const text = extractTextContent(content);
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}
