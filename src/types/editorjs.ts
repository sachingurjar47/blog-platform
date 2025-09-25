// Editor.js types
export interface EditorJSData {
  time?: number;
  blocks: EditorJSBlock[];
  version?: string;
}

export interface EditorJSBlock {
  id?: string;
  type: string;
  data: any;
}

export interface EditorJSTool {
  class: any;
  inlineToolbar?: boolean;
  config?: any;
}

export interface EditorJSConfig {
  holder: string;
  placeholder?: string;
  tools: Record<string, EditorJSTool>;
  data?: EditorJSData;
  readOnly?: boolean;
  onChange?: (api: any, event: any) => void;
}
