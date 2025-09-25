import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Box, Typography } from "@mui/material";
import { EditorJSData } from "../types/editorjs";
import { trackUploadedImage } from "../utils/imageCleanup";

// EditorJS type definitions
interface EditorJS {
  destroy(): void;
  isReady: Promise<void>;
  save(): Promise<EditorJSData>;
}

interface EditorJSToolClass {
  new (): any;
  toolbox?: any;
  sanitize?: any;
}

interface RichTextEditorProps {
  data?: EditorJSData;
  onChange?: (data: EditorJSData) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  data,
  onChange,
  placeholder = "Start writing your post...",
  readOnly = false,
  minHeight = 300,
}) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const handleChange = useCallback(
    async (api: { saver: { save: () => Promise<EditorJSData> } }) => {
      if (onChange) {
        try {
          const outputData = await api.saver.save();
          onChange(outputData);
        } catch (error) {
          console.error("Error saving editor data:", error);
        }
      }
    },
    [onChange]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const initEditor = async () => {
      try {
        // Check if the holder element exists using ref
        if (!holderRef.current) {
          console.error(`Editor holder element not found`);
          setError("Editor container not found");
          return;
        }

        if (
          editorRef.current &&
          typeof editorRef.current.destroy === "function"
        ) {
          editorRef.current.destroy();
        }

        // Dynamically import Editor.js modules
        const [
          { default: EditorJS },
          { default: Header },
          { default: List },
          { default: Paragraph },
          { default: Quote },
          { default: Code },
          { default: Image },
          { default: InlineCode },
          { default: Marker },
          { default: Delimiter },
          { default: Underline },
        ] = await Promise.all([
          import("@editorjs/editorjs"),
          import("@editorjs/header"),
          import("@editorjs/list"),
          import("@editorjs/paragraph"),
          import("@editorjs/quote"),
          import("@editorjs/code"),
          import("@editorjs/image"),
          import("@editorjs/inline-code"),
          import("@editorjs/marker"),
          import("@editorjs/delimiter"),
          import("@editorjs/underline"),
        ]);

        const editor = new EditorJS({
          holder: holderRef.current,
          placeholder,
          readOnly,
          data: data || {
            time: Date.now(),
            blocks: [],
            version: "2.28.2",
          },
          tools: {
            header: {
              class: Header as EditorJSToolClass,
              config: {
                placeholder: "Enter a header",
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2,
              },
            },
            paragraph: {
              class: Paragraph as EditorJSToolClass,
              inlineToolbar: true,
            },
            list: {
              class: List as EditorJSToolClass,
              inlineToolbar: true,
              config: {
                defaultStyle: "unordered",
              },
            },
            quote: {
              class: Quote as EditorJSToolClass,
              inlineToolbar: true,
              config: {
                quotePlaceholder: "Enter a quote",
                captionPlaceholder: "Quote's author",
              },
            },
            code: {
              class: Code as EditorJSToolClass,
              config: {
                placeholder: "Enter code",
              },
            },
            image: {
              class: Image as EditorJSToolClass,
              config: {
                endpoints: {
                  byFile: "/api/upload-image",
                  byUrl: "/api/fetch-image",
                },
                field: "image",
                types: "image/*",
                additionalRequestData: {},
                additionalRequestHeaders: {},
                captionPlaceholder: "Enter image caption",
                buttonContent: "Select an image",
                uploader: {
                  uploadByFile: async (file: File) => {
                    const formData = new FormData();
                    formData.append("image", file);

                    try {
                      const response = await fetch("/api/upload-image", {
                        method: "POST",
                        body: formData,
                      });
                      const result = await response.json();

                      // Track uploaded image for cleanup
                      if (result.success === 1 && result.file?.url) {
                        trackUploadedImage(result.file.url);
                      }

                      return result;
                    } catch (error) {
                      console.error("Image upload error:", error);
                      return {
                        success: 0,
                        message: "Image upload failed",
                      };
                    }
                  },
                  uploadByUrl: async (url: string) => {
                    try {
                      const response = await fetch("/api/fetch-image", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ url }),
                      });
                      const result = await response.json();
                      return result;
                    } catch (error) {
                      console.error("Image fetch error:", error);
                      return {
                        success: 0,
                        message: "Image fetch failed",
                      };
                    }
                  },
                },
              },
            },
            inlineCode: {
              class: InlineCode as EditorJSToolClass,
              shortcut: "CMD+SHIFT+C",
            },
            marker: {
              class: Marker as EditorJSToolClass,
              shortcut: "CMD+SHIFT+M",
            },
            delimiter: {
              class: Delimiter as EditorJSToolClass,
            },
            underline: {
              class: Underline as EditorJSToolClass,
              shortcut: "CMD+U",
            },
          },
          onChange: handleChange,
        });

        editorRef.current = editor;
        await editor.isReady;
        setError(null);
      } catch (error) {
        console.error("Error initializing Editor.js:", error);
        setError("Failed to initialize editor");
      }
    };

    initEditor();

    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
      }
    };
  }, [placeholder, readOnly, handleChange, isClient]);

  // Note: Editor.js will handle data changes internally
  // The editor is initialized with the data prop and will update accordingly

  if (!isClient) {
    return (
      <Box
        sx={{
          minHeight,
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="text.secondary">Loading editor...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight,
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight,
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        "& .codex-editor": {
          padding: 2,
        },
        "& .codex-editor__redactor": {
          paddingBottom: "0 !important",
        },
        "& .ce-block__content": {
          maxWidth: "none",
        },
        "& .ce-toolbar__content": {
          maxWidth: "none",
        },
      }}
    >
      <div ref={holderRef} />
    </Box>
  );
};

export default RichTextEditor;
