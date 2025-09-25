// Editor.js types
export interface EditorJSData {
  time?: number;
  blocks: EditorJSBlock[];
  version?: string;
}

export interface EditorJSBlock {
  id?: string;
  type: string;
  data: unknown;
}

export interface EditorJSTool {
  class: unknown;
  inlineToolbar?: boolean;
  config?: unknown;
}

export interface EditorJSConfig {
  holder: string;
  placeholder?: string;
  tools: Record<string, EditorJSTool>;
  data?: EditorJSData;
  readOnly?: boolean;
  onChange?: (api: unknown, event: unknown) => void;
}
