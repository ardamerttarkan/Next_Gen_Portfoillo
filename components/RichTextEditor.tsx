import React, { useCallback, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Youtube from "@tiptap/extension-youtube";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { common, createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Link2Off,
  ImagePlus,
  Film,
  Undo2,
  Redo2,
  Highlighter,
  Palette,
  Type,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Table as TableIcon,
  Youtube as YoutubeIcon,
  Upload,
  X,
  Check,
  ExternalLink,
} from "lucide-react";

import { Node, mergeAttributes } from "@tiptap/core";

// Custom Video node extension for TipTap
const VideoNode = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      class: { default: "rounded-lg max-w-full mx-auto my-4" },
    };
  },

  parseHTML() {
    return [{ tag: "video" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      setVideo:
        (options: { src: string }) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    } as any;
  },
});

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

// Toolbar button component
const ToolbarBtn = ({
  onClick,
  active,
  disabled,
  title,
  children,
  className = "",
}: {
  onClick: (e: React.MouseEvent) => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    disabled={disabled}
    title={title}
    className={`
      p-1.5 rounded-md transition-all duration-150 flex items-center justify-center
      ${
        active
          ? "bg-prof-blue text-white shadow-sm shadow-blue-900/30"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }
      ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
      ${className}
    `}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-6 bg-gray-700/60 mx-1 shrink-0" />;

// Dropdown for headings
const HeadingDropdown = ({ editor }: { editor: any }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = editor.isActive("heading", { level: 1 })
    ? "H1"
    : editor.isActive("heading", { level: 2 })
      ? "H2"
      : editor.isActive("heading", { level: 3 })
        ? "H3"
        : "P";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
        className="flex items-center gap-1 px-2 py-1.5 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-xs font-bold min-w-[52px] justify-center"
        title="Text Type"
      >
        <Type className="w-3.5 h-3.5" />
        <span>{current}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-20 py-1 min-w-[140px]">
            {[
              {
                label: "Paragraph",
                action: () => editor.chain().focus().setParagraph().run(),
                active: !editor.isActive("heading"),
              },
              {
                label: "Heading 1",
                action: () =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run(),
                active: editor.isActive("heading", { level: 1 }),
              },
              {
                label: "Heading 2",
                action: () =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run(),
                active: editor.isActive("heading", { level: 2 }),
              },
              {
                label: "Heading 3",
                action: () =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run(),
                active: editor.isActive("heading", { level: 3 }),
              },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  item.action();
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 ${item.active ? "text-prof-blue" : "text-gray-300"}`}
              >
                {item.active && <Check className="w-3 h-3" />}
                <span className={!item.active ? "ml-5" : ""}>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Color picker
const ColorPicker = ({ editor }: { editor: any }) => {
  const [open, setOpen] = useState(false);
  const colors = [
    "#ffffff",
    "#94a3b8",
    "#f87171",
    "#fb923c",
    "#fbbf24",
    "#a3e635",
    "#34d399",
    "#22d3ee",
    "#60a5fa",
    "#a78bfa",
    "#f472b6",
    "#e11d48",
    "#ea580c",
    "#ca8a04",
    "#16a34a",
    "#0891b2",
    "#2563eb",
    "#7c3aed",
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
        className="p-1.5 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-all flex items-center gap-0.5"
        title="Text Color"
      >
        <Palette className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-20 p-2 w-[180px]">
            <div className="grid grid-cols-6 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor(color).run();
                    setOpen(false);
                  }}
                  className="w-6 h-6 rounded border border-gray-700 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().unsetColor().run();
                setOpen(false);
              }}
              className="w-full mt-2 text-xs text-gray-400 hover:text-white py-1 rounded hover:bg-gray-800 transition-colors"
            >
              Reset Color
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Link input popup
const LinkPopup = ({
  editor,
  onClose,
}: {
  editor: any;
  onClose: () => void;
}) => {
  const [url, setUrl] = useState(editor.getAttributes("link").href || "");

  const handleSubmit = () => {
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    onClose();
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl">
      <ExternalLink className="w-4 h-4 text-gray-500 shrink-0" />
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="https://example.com"
        className="bg-transparent text-sm text-white outline-none w-48 placeholder:text-gray-600"
        autoFocus
      />
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="p-1 text-green-400 hover:text-green-300"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          onClose();
        }}
        className="p-1 text-gray-500 hover:text-white"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// Media upload modal
const MediaUploadModal = ({
  type,
  onInsert,
  onClose,
}: {
  type: "image" | "video" | "youtube";
  onInsert: (data: { src: string; type: string; file?: File }) => void;
  onClose: () => void;
}) => {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const validImage = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    const validVideo = ["video/mp4", "video/webm", "video/ogg"];
    const allowed = type === "image" ? validImage : validVideo;

    if (!allowed.includes(file.type)) {
      alert(`Invalid file type. Allowed: ${allowed.join(", ")}`);
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert("File too large. Maximum 50MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      setUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gray-900 w-full max-w-md rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center gap-2">
            {type === "image" && (
              <>
                <ImagePlus className="w-5 h-5 text-blue-400" /> Insert Image
              </>
            )}
            {type === "video" && (
              <>
                <Film className="w-5 h-5 text-purple-400" /> Insert Video
              </>
            )}
            {type === "youtube" && (
              <>
                <YoutubeIcon className="w-5 h-5 text-red-400" /> YouTube Video
              </>
            )}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* File Upload Area (not for youtube) */}
          {type !== "youtube" && (
            <div
              className={`
                border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
                ${
                  dragActive
                    ? "border-prof-blue bg-blue-500/10 text-blue-400"
                    : "border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-300"
                }
              `}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-medium">
                {dragActive ? "Drop here..." : "Click or drag & drop to upload"}
              </p>
              <p className="text-xs mt-1 opacity-60">
                {type === "image"
                  ? "JPG, PNG, GIF, WebP, SVG · Max 50MB"
                  : "MP4, WebM, OGG · Max 50MB"}
              </p>
              <input
                ref={fileRef}
                type="file"
                accept={type === "image" ? "image/*" : "video/*"}
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          )}

          {/* Preview */}
          {preview && type === "image" && (
            <div className="relative rounded-lg overflow-hidden border border-gray-700">
              <img
                src={preview}
                className="w-full max-h-48 object-contain bg-gray-950"
              />
              <button
                onClick={() => {
                  setPreview(null);
                  setUrl("");
                }}
                className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-red-500/80"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {preview && type === "video" && (
            <div className="relative rounded-lg overflow-hidden border border-gray-700">
              <video
                src={preview}
                controls
                className="w-full max-h-48 bg-gray-950"
              />
              <button
                onClick={() => {
                  setPreview(null);
                  setUrl("");
                }}
                className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-red-500/80"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Divider */}
          {type !== "youtube" && (
            <div className="flex items-center gap-3 text-gray-600 text-xs">
              <div className="flex-1 h-px bg-gray-800" />
              <span>OR enter URL</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
          )}

          {/* URL Input */}
          <div>
            <input
              type="url"
              value={preview ? "" : url}
              onChange={(e) => {
                setUrl(e.target.value);
                setPreview(null);
              }}
              placeholder={
                type === "youtube"
                  ? "https://youtube.com/watch?v=..."
                  : `Enter ${type} URL...`
              }
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white text-sm focus:ring-2 focus:ring-prof-blue focus:border-transparent outline-none transition-all placeholder:text-gray-600"
              disabled={!!preview}
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (url) onInsert({ src: url, type });
              onClose();
            }}
            disabled={!url}
            className="px-4 py-2 bg-prof-blue hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Insert
          </button>
        </div>
      </div>
    </div>
  );
};

// Table insert popup
const TableInsertPopup = ({
  editor,
  onClose,
}: {
  editor: any;
  onClose: () => void;
}) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  return (
    <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-20 p-3 w-[200px]">
      <p className="text-xs text-gray-400 mb-2 font-medium">Insert Table</p>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-xs text-gray-500 w-10">Rows</label>
        <input
          type="number"
          min={1}
          max={10}
          value={rows}
          onChange={(e) => setRows(+e.target.value)}
          className="w-full bg-gray-950 border border-gray-800 rounded px-2 py-1 text-white text-sm outline-none"
        />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <label className="text-xs text-gray-500 w-10">Cols</label>
        <input
          type="number"
          min={1}
          max={10}
          value={cols}
          onChange={(e) => setCols(+e.target.value)}
          className="w-full bg-gray-950 border border-gray-800 rounded px-2 py-1 text-white text-sm outline-none"
        />
      </div>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor
            .chain()
            .focus()
            .insertTable({ rows, cols, withHeaderRow: true })
            .run();
          onClose();
        }}
        className="w-full py-1.5 bg-prof-blue text-white rounded text-xs font-medium hover:bg-blue-600 transition-colors"
      >
        Insert {rows}×{cols} Table
      </button>
    </div>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
}) => {
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [mediaModal, setMediaModal] = useState<
    "image" | "video" | "youtube" | null
  >(null);
  const [showTable, setShowTable] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        horizontalRule: false,
      }),
      Underline,
      Superscript,
      Subscript,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-400 underline cursor-pointer" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full mx-auto" },
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Start writing your content here...",
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Youtube.configure({
        HTMLAttributes: { class: "w-full rounded-lg overflow-hidden" },
        width: 640,
        height: 360,
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      HorizontalRule,
      VideoNode,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none min-h-[350px] p-5",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            const reader = new FileReader();
            reader.onload = () => {
              const src = reader.result as string;
              view.dispatch(
                view.state.tr.replaceSelectionWith(
                  view.state.schema.nodes.image.create({ src }),
                ),
              );
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith("image/")) {
              event.preventDefault();
              const file = items[i].getAsFile();
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  const src = reader.result as string;
                  view.dispatch(
                    view.state.tr.replaceSelectionWith(
                      view.state.schema.nodes.image.create({ src }),
                    ),
                  );
                };
                reader.readAsDataURL(file);
              }
              return true;
            }
          }
        }
        return false;
      },
    },
  });

  const insertMedia = useCallback(
    (data: { src: string; type: string }) => {
      if (!editor) return;
      if (data.type === "image") {
        editor.chain().focus().setImage({ src: data.src }).run();
      } else if (data.type === "youtube") {
        editor.chain().focus().setYoutubeVideo({ src: data.src }).run();
      } else if (data.type === "video") {
        // Insert using the custom Video node extension
        (editor.chain().focus() as any).setVideo({ src: data.src }).run();
      }
    },
    [editor],
  );

  if (!editor) return null;

  return (
    <div className="w-full bg-gray-950 border border-gray-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-prof-blue/60 transition-all shadow-lg">
      {/* Toolbar */}
      <div className="bg-gray-900/80 border-b border-gray-800 p-2 flex flex-wrap items-center gap-0.5">
        {/* Undo / Redo */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </ToolbarBtn>

        <Divider />

        {/* Heading dropdown */}
        <HeadingDropdown editor={editor} />

        <Divider />

        {/* Inline Formatting */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline Code"
        >
          <Code className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          active={editor.isActive("superscript")}
          title="Superscript"
        >
          <SuperscriptIcon className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          active={editor.isActive("subscript")}
          title="Subscript"
        >
          <SubscriptIcon className="w-4 h-4" />
        </ToolbarBtn>

        <Divider />

        {/* Color & Highlight */}
        <ColorPicker editor={editor} />
        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#fbbf24" }).run()
          }
          active={editor.isActive("highlight")}
          title="Highlight"
        >
          <Highlighter className="w-4 h-4" />
        </ToolbarBtn>

        <Divider />

        {/* Text Align */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </ToolbarBtn>

        <Divider />

        {/* Lists */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          active={editor.isActive("taskList")}
          title="Task List"
        >
          <ListChecks className="w-4 h-4" />
        </ToolbarBtn>

        <Divider />

        {/* Block Elements */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code2 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </ToolbarBtn>

        <Divider />

        {/* Links */}
        <div className="relative">
          <ToolbarBtn
            onClick={() => {
              if (editor.isActive("link")) {
                editor.chain().focus().unsetLink().run();
              } else {
                setShowLinkPopup(!showLinkPopup);
              }
            }}
            active={editor.isActive("link")}
            title={editor.isActive("link") ? "Remove Link" : "Add Link"}
          >
            {editor.isActive("link") ? (
              <Link2Off className="w-4 h-4" />
            ) : (
              <Link2 className="w-4 h-4" />
            )}
          </ToolbarBtn>
          {showLinkPopup && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowLinkPopup(false)}
              />
              <div className="absolute top-full left-0 mt-1 z-20">
                <LinkPopup
                  editor={editor}
                  onClose={() => setShowLinkPopup(false)}
                />
              </div>
            </>
          )}
        </div>

        <Divider />

        {/* Media */}
        <ToolbarBtn onClick={() => setMediaModal("image")} title="Insert Image">
          <ImagePlus className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => setMediaModal("video")} title="Insert Video">
          <Film className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => setMediaModal("youtube")}
          title="Insert YouTube Video"
        >
          <YoutubeIcon className="w-4 h-4" />
        </ToolbarBtn>

        {/* Table */}
        <div className="relative">
          <ToolbarBtn
            onClick={() => setShowTable(!showTable)}
            active={editor.isActive("table")}
            title="Insert Table"
          >
            <TableIcon className="w-4 h-4" />
          </ToolbarBtn>
          {showTable && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowTable(false)}
              />
              <TableInsertPopup
                editor={editor}
                onClose={() => setShowTable(false)}
              />
            </>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div
        className="prose prose-invert prose-sm max-w-none 
        [&_.ProseMirror]:min-h-[350px] [&_.ProseMirror]:p-5 [&_.ProseMirror]:outline-none
        [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-600 
        [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] 
        [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left 
        [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 
        [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none
        [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:mx-auto [&_.ProseMirror_img]:my-4
        [&_.ProseMirror_video]:rounded-lg [&_.ProseMirror_video]:max-w-full [&_.ProseMirror_video]:mx-auto [&_.ProseMirror_video]:my-4
        [&_.ProseMirror_iframe]:rounded-lg [&_.ProseMirror_iframe]:w-full [&_.ProseMirror_iframe]:aspect-video [&_.ProseMirror_iframe]:my-4
        [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-prof-blue [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-gray-400
        [&_.ProseMirror_pre]:bg-gray-900 [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:text-sm [&_.ProseMirror_pre]:overflow-x-auto
        [&_.ProseMirror_code]:bg-gray-800 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:text-pink-400 [&_.ProseMirror_code]:text-sm
        [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:my-4
        [&_.ProseMirror_th]:bg-gray-800 [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-gray-700 [&_.ProseMirror_th]:p-2 [&_.ProseMirror_th]:text-left [&_.ProseMirror_th]:font-bold
        [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-gray-700 [&_.ProseMirror_td]:p-2
        [&_.ProseMirror_hr]:border-gray-700 [&_.ProseMirror_hr]:my-6
        [&_.ProseMirror_ul[data-type=taskList]]:list-none [&_.ProseMirror_ul[data-type=taskList]]:pl-0
        [&_.ProseMirror_ul[data-type=taskList]_li]:flex [&_.ProseMirror_ul[data-type=taskList]_li]:items-start [&_.ProseMirror_ul[data-type=taskList]_li]:gap-2
        [&_.ProseMirror_ul[data-type=taskList]_li_label]:mt-0.5
        [&_.ProseMirror_a]:text-blue-400 [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:cursor-pointer
        [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h1]:mt-6
        [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h2]:mt-5
        [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:mt-4
        [&_.ProseMirror_mark]:bg-yellow-400/30 [&_.ProseMirror_mark]:rounded [&_.ProseMirror_mark]:px-0.5
      "
      >
        <EditorContent editor={editor} />
      </div>

      {/* Word count footer */}
      <div className="px-4 py-2 border-t border-gray-800 bg-gray-900/50 flex items-center justify-between text-xs text-gray-500">
        <span>
          {editor.storage.characterCount?.characters?.() ??
            editor.getText().length}{" "}
          characters
        </span>
        <span>
          {editor.getText().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>

      {/* Media Upload Modal */}
      {mediaModal && (
        <MediaUploadModal
          type={mediaModal}
          onInsert={insertMedia}
          onClose={() => setMediaModal(null)}
        />
      )}
    </div>
  );
};
