import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import Image from "next/image";
import { EditorJSData } from "../types/editorjs";

interface EditorJSRendererProps {
  data: EditorJSData;
}

const EditorJSRenderer: React.FC<EditorJSRendererProps> = ({ data }) => {
  const renderBlock = (
    block: { type: string; data: unknown },
    index: number
  ) => {
    switch (block.type) {
      case "header":
        const HeaderTag = `h${
          (block.data as { level: number }).level
        }` as keyof React.JSX.IntrinsicElements;
        const headerText =
          typeof (block.data as { text: unknown }).text === "string"
            ? (block.data as { text: string }).text
            : String((block.data as { text: unknown }).text || "");
        return React.createElement(
          HeaderTag,
          {
            key: index,
            style: {
              marginTop: index > 0 ? "24px" : "0",
              marginBottom: "16px",
            },
          },
          headerText
        );

      case "paragraph":
        const paragraphText =
          typeof (block.data as { text: unknown }).text === "string"
            ? (block.data as { text: string }).text
            : String((block.data as { text: unknown }).text || "");
        return (
          <Typography
            key={index}
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, marginBottom: "16px" }}
            dangerouslySetInnerHTML={{
              __html:
                paragraphText
                  ?.replace(
                    /<mark class="cdx-marker">(.*?)<\/mark>/g,
                    '<mark style="background-color: #ffeb3b; padding: 2px 4px; border-radius: 3px;">$1</mark>'
                  )
                  ?.replace(
                    /<code class="inline-code">(.*?)<\/code>/g,
                    '<code style="background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 0.9em;">$1</code>'
                  )
                  ?.replace(
                    /<u>(.*?)<\/u>/g,
                    '<u style="text-decoration: underline;">$1</u>'
                  ) || paragraphText,
            }}
          />
        );

      case "list":
        const ListTag =
          (block.data as { style: string }).style === "ordered" ? "ol" : "ul";
        return (
          <Box key={index} component={ListTag} sx={{ pl: 3, mb: 2 }}>
            {(block.data as { items: unknown[] }).items.map(
              (item: unknown, itemIndex: number) => {
                // Ensure item is a string
                const itemText =
                  typeof item === "string" ? item : String(item || "");
                return (
                  <Typography
                    key={itemIndex}
                    component="li"
                    variant="body1"
                    dangerouslySetInnerHTML={{
                      __html:
                        itemText
                          ?.replace(
                            /<mark class="cdx-marker">(.*?)<\/mark>/g,
                            '<mark style="background-color: #ffeb3b; padding: 2px 4px; border-radius: 3px;">$1</mark>'
                          )
                          ?.replace(
                            /<code class="inline-code">(.*?)<\/code>/g,
                            '<code style="background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 0.9em;">$1</code>'
                          )
                          ?.replace(
                            /<u>(.*?)<\/u>/g,
                            '<u style="text-decoration: underline;">$1</u>'
                          ) || itemText,
                    }}
                  />
                );
              }
            )}
          </Box>
        );

      case "quote":
        return (
          <Paper
            key={index}
            elevation={1}
            sx={{
              p: 3,
              mb: 2,
              borderLeft: "4px solid",
              borderLeftColor: "primary.main",
              backgroundColor: "grey.50",
            }}
          >
            <Typography variant="body1" sx={{ fontStyle: "italic", mb: 1 }}>
              {(block.data as { text?: string }).text}
            </Typography>
            {(block.data as { caption?: string }).caption && (
              <Typography variant="caption" color="text.secondary">
                — {(block.data as { caption: string }).caption}
              </Typography>
            )}
          </Paper>
        );

      case "code":
        return (
          <Paper
            key={index}
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: "grey.900",
              color: "white",
              overflow: "auto",
            }}
          >
            <pre
              style={{ margin: 0, fontFamily: "monospace", fontSize: "14px" }}
            >
              <code>{(block.data as { code?: string }).code}</code>
            </pre>
          </Paper>
        );

      case "table":
        return (
          <Box key={index} sx={{ overflow: "auto", mb: 2 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {(block.data as { content?: string[][] }).content?.map(
                  (row: string[], rowIndex: number) => (
                    <tr key={rowIndex}>
                      {row.map((cell: string, cellIndex: number) => (
                        <td
                          key={cellIndex}
                          style={{
                            border: "1px solid #e0e0e0",
                            padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </Box>
        );

      case "warning":
        return (
          <Paper
            key={index}
            elevation={1}
            sx={{
              p: 3,
              mb: 2,
              borderLeft: "4px solid",
              borderLeftColor: "warning.main",
              backgroundColor: "warning.light",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, color: "warning.dark" }}>
              {(block.data as { title?: string }).title}
            </Typography>
            <Typography variant="body1">
              {(block.data as { message?: string }).message}
            </Typography>
          </Paper>
        );

      case "image":
        const imageData = block.data as {
          file?: { url?: string };
          url?: string;
          caption?: string;
        };
        return (
          <Box key={index} sx={{ mb: 2, textAlign: "center" }}>
            <Image
              src={imageData.file?.url || imageData.url || ""}
              alt={imageData.caption || "Image"}
              width={800}
              height={400}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
            {imageData.caption && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                {imageData.caption}
              </Typography>
            )}
          </Box>
        );

      case "embed":
        const embedData = block.data as {
          embed?: string;
          html?: string;
          caption?: string;
        };
        return (
          <Box key={index} sx={{ mb: 2, textAlign: "center" }}>
            <div
              dangerouslySetInnerHTML={{
                __html: embedData.embed || embedData.html || "",
              }}
            />
            {embedData.caption && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                {embedData.caption}
              </Typography>
            )}
          </Box>
        );

      case "delimiter":
        return (
          <Box key={index} sx={{ my: 3, textAlign: "center" }}>
            <Divider sx={{ borderColor: "primary.main", borderWidth: 2 }} />
          </Box>
        );

      default:
        return (
          <Typography key={index} variant="body1" paragraph>
            Unsupported block type: {block.type}
          </Typography>
        );
    }
  };

  if (!data || !data.blocks || data.blocks.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No content available
      </Typography>
    );
  }

  return (
    <Box>{data.blocks.map((block, index) => renderBlock(block, index))}</Box>
  );
};

export default EditorJSRenderer;
