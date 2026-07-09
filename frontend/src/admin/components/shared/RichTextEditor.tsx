import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useEffect, useState, useCallback, useRef } from "react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import CharacterCount from "@tiptap/extension-character-count";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { createLowlight, common } from "lowlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Youtube as YoutubeIcon,
  Table as TableIcon,
  Plus,
  Trash2,
  Rows3,
  Save,
  Eye,
  EyeOff,
  ChevronDown,
  Palette,
  FileCode,
  Strikethrough,
  PanelTopOpen,
  Minus as DividerIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { uploadFile } from "../../services/api";

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const TEMPLATES = [
  {
    name: "مقال قياسي",
    description: "هيكل مقال نموذجي مع مقدمة، أقسام، وخاتمة",
    content: `<h2>مقدمة</h2><p>اكتب مقدمتك هنا...</p><h2>القسم الأول</h2><p>محتوى القسم الأول...</p><h2>القسم الثاني</h2><p>محتوى القسم الثاني...</p><h2>الخلاصة</h2><p>اكتب خلاصتك هنا...</p>`,
  },
  {
    name: "دليل تعليمي",
    description: "دليل خطوة بخطوة مع قوائم مرقمة",
    content: `<h2>ما سنغطيه</h2><p>نظرة عامة على الدليل...</p><h2>الخطوة 1</h2><p>تفاصيل الخطوة الأولى...</p><ol><li><p>النقطة الأولى</p></li><li><p>النقطة الثانية</p></li></ol><h2>الخطوة 2</h2><p>تفاصيل الخطوة الثانية...</p><h2>الخطوة 3</h2><p>تفاصيل الخطوة الثالثة...</p><h2>الخلاصة</h2><p>خلاصة الدليل...</p>`,
  },
  {
    name: "دراسة حالة",
    description: "دراسة حالة مع التحديات والحلول",
    content: `<h2>نظرة عامة</h2><p>وصف مختصر للدراسة...</p><h2>التحدي</h2><p>ما هو التحدي الذي واجهه العميل...</p><h2>الحل</h2><p>كيف قدمنا الحل...</p><h2>النتائج</h2><ul><li><p>نتيجة 1</p></li><li><p>نتيجة 2</p></li><li><p>نتيجة 3</p></li></ul><h2>الخلاصة</h2><p>الدروس المستفادة...</p>`,
  },
  {
    name: "خبر تقني",
    description: "نموذج خبر مع إحصائيات واقتباسات",
    content: `<h2>الخلاصة التنفيذية</h2><p>نقاط رئيسية من الخبر...</p><blockquote><p>اقتباس مهم ه...</p></blockquote><h2>التفاصيل</h2><p>شرح تفصيلي للخبر...</p><h2>التحليل</h2><p>تحليل للتأثيرات والنتائج...</p><h2>ما التالي؟</h2><p>الخطوات المستقبلية...</p>`,
  },
];

const COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981",
  "#06b6d4", "#3b82f6", "#6366f1", "#a855f7", "#ec4899",
  "#f43f5e", "#78716c", "#ffffff",
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = "ابدأ الكتابة...",
  className,
}: RichTextEditorProps) {
  const [, setEditorState] = useState(0);
  const [showHtml, setShowHtml] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [showYoutube, setShowYoutube] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Image.configure({
        HTMLAttributes: { class: "max-w-full rounded-lg my-4" },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-emerald-400 underline hover:text-emerald-300" },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Highlight.configure({ multicolor: true }),
      Underline,
      Subscript,
      Superscript,
      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: { class: "w-full aspect-video rounded-lg my-4" },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: { class: "rounded-lg my-4 p-4 bg-slate-900 text-slate-100 font-mono text-sm" },
        languageClassPrefix: "language-",
      }),
      TextStyle,
      Color,
      CharacterCount.configure({
        limit: 50000,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        dir: "rtl",
        class: "prose prose-invert prose-emerald max-w-none p-4 min-h-[400px] bg-slate-700/30 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[350px] [&_.ProseMirror]:text-white [&_.ProseMirror_h1]:text-white [&_.ProseMirror_h2]:text-white [&_.ProseMirror_h3]:text-white [&_.ProseMirror_p]:text-slate-200 [&_.ProseMirror_ul]:text-slate-200 [&_.ProseMirror_ol]:text-slate-200 [&_.ProseMirror_li]:text-slate-200 [&_.ProseMirror_li]:mb-1 [&_.ProseMirror_li]:leading-relaxed [&_.ProseMirror_blockquote]:text-slate-300 [&_.ProseMirror_blockquote]:border-r-4 [&_.ProseMirror_blockquote]:border-emerald-500 [&_.ProseMirror_blockquote]:pr-4 [&_.ProseMirror_blockquote]:bg-slate-800/50 [&_.ProseMirror_blockquote]:p-4 [&_.ProseMirror_blockquote]:rounded-lg [&_.ProseMirror_code]:text-slate-100 [&_.ProseMirror_code]:bg-slate-800 [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:rounded [&_.ProseMirror_pre]:bg-slate-900 [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:my-4 [&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:text-slate-100 [&_.ProseMirror_pre_code]:font-mono [&_.ProseMirror_pre_code]:text-sm [&_.ProseMirror_hr]:border-slate-600 [&_.ProseMirror_hr]:my-8 [&_.ProseMirror_hr]:border-t-2 [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:my-4 [&_.ProseMirror_th]:bg-slate-700 [&_.ProseMirror_th]:text-white [&_.ProseMirror_th]:p-3 [&_.ProseMirror_th]:text-right [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-slate-600 [&_.ProseMirror_td]:p-3 [&_.ProseMirror_td]:text-slate-200 [&_.ProseMirror_td]:text-right [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-slate-600 [&_.ProseMirror_td]:bg-slate-800/30 [&_.prose-rtl]:direction-rtl [&_.prose-rtl_h1]:text-right [&_.prose-rtl_h2]:text-right [&_.prose-rtl_h3]:text-right [&_.prose-rtl_p]:text-right [&_.prose-rtl_ul]:text-right [&_.prose-rtl_ol]:text-right [&_.prose-rtl_li]:text-right [&_.prose-rtl_blockquote]:text-right [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-slate-500 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          const files = Array.from(event.dataTransfer.files);
          files.forEach(async (file) => {
            if (file.type.startsWith("image/")) {
              try {
                const src = await uploadFile(file);
                view.dispatch(
                  view.state.tr.replaceSelectionWith(
                    view.state.schema.nodes.image.create({ src })
                  )
                );
              } catch (error) {
                console.error("Failed to upload image:", error);
              }
            }
          });
          return true;
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          const imageItems = Array.from(items).filter((item) =>
            item.type.startsWith("image/")
          );
          if (imageItems.length > 0) {
            imageItems.forEach(async (item) => {
              const file = item.getAsFile();
              if (file) {
                try {
                  const src = await uploadFile(file);
                  view.dispatch(
                    view.state.tr.replaceSelectionWith(
                      view.state.schema.nodes.image.create({ src })
                    )
                  );
                } catch (error) {
                  console.error("Failed to upload image:", error);
                }
              }
            });
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: () => {
      setEditorState((prev) => prev + 1);
    },
    onTransaction: () => {
      setEditorState((prev) => prev + 1);
    },
  });

  // Auto-save
  useEffect(() => {
    if (!editor) return;
    autoSaveRef.current = setInterval(() => {
      const html = editor.getHTML();
      if (html && html !== "<p></p>") {
        localStorage.setItem("editor-autosave", html);
        setLastSaved(new Date());
      }
    }, 30000);
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [editor]);

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [editor, value]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("أدخل الرابط:", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editor) return;
      if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
            break;
          case "i":
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
            break;
          case "u":
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
            break;
          case "z":
            e.preventDefault();
            editor.chain().focus().undo().run();
            break;
          case "y":
            e.preventDefault();
            editor.chain().focus().redo().run();
            break;
          case "k":
            e.preventDefault();
            addLink();
            break;
          case "s":
            e.preventDefault();
            localStorage.setItem("editor-autosave", editor.getHTML());
            setLastSaved(new Date());
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor, addLink]);

  const insertImage = useCallback(() => {
    if (!editor || !imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl("");
    setShowImageUpload(false);
  }, [editor, imageUrl]);

  const insertYoutube = useCallback(() => {
    if (!editor || !youtubeUrl) return;
    editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
    setYoutubeUrl("");
    setShowYoutube(false);
  }, [editor, youtubeUrl]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const insertDivider = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().setHorizontalRule().run();
  }, [editor]);

  const applyTemplate = useCallback((templateContent: string) => {
    if (!editor) return;
    editor.chain().focus().setContent(templateContent).run();
    setShowTemplates(false);
  }, [editor]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    if (file.type.startsWith("image/")) {
      try {
        const src = await uploadFile(file);
        editor.chain().focus().setImage({ src }).run();
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  }, [editor]);

  const toggleHtmlView = useCallback(() => {
    if (!editor) return;
    if (!showHtml) {
      setHtmlContent(editor.getHTML());
    } else {
      editor.commands.setContent(htmlContent);
    }
    setShowHtml(!showHtml);
  }, [editor, showHtml, htmlContent]);

  const setTextColor = useCallback((color: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-[400px] border border-slate-700 rounded-xl bg-slate-800/50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const charCount = editor.storage.characterCount?.characters() || 0;
  const wordCount = editor.storage.characterCount?.words() || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
    disabled = false,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "h-9 w-9 transition-colors",
        isActive
          ? "bg-emerald-500/20 text-emerald-400"
          : "text-slate-400 hover:text-white hover:bg-slate-700",
        disabled && "opacity-40 cursor-not-allowed"
      )}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </Button>
  );

  const ToolbarDropdown = ({
    label,
    children,
    isOpen,
    onToggle,
  }: {
    label: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "h-9 px-3 text-xs font-medium transition-colors flex items-center gap-1",
          isOpen
            ? "bg-emerald-500/20 text-emerald-400"
            : "text-slate-400 hover:text-white hover:bg-slate-700"
        )}
        onClick={onToggle}
      >
        {label}
        <ChevronDown className="h-3 w-3" />
      </Button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => onToggle()} />
          <div className="absolute top-full right-0 mt-1 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-2 min-w-[200px]">
            {children}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        "border border-slate-700 rounded-xl overflow-hidden flex flex-col",
        className
      )}
      dir="rtl"
    >
      {/* Top Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/50 border-b border-slate-700 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span>{charCount.toLocaleString()} حرف</span>
          <span>{wordCount.toLocaleString()} كلمة</span>
          <span>{readingTime} دقيقة قراءة</span>
        </div>
        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="flex items-center gap-1 text-emerald-400">
              <Save className="h-3 w-3" />
              حُفظ تلقائياً {lastSaved.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
      </div>

      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 bg-slate-800/80 border-b border-slate-700">
        {/* Templates */}
        <ToolbarDropdown
          label="القوالب"
          isOpen={showTemplates}
          onToggle={() => setShowTemplates(!showTemplates)}
        >
          <div className="space-y-1">
            {TEMPLATES.map((template) => (
              <button
                key={template.name}
                type="button"
                className="w-full text-right p-2 rounded hover:bg-slate-700 transition-colors"
                onClick={() => applyTemplate(template.content)}
              >
                <div className="font-medium text-slate-200 text-sm">{template.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{template.description}</div>
              </button>
            ))}
          </div>
        </ToolbarDropdown>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="عريض (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="مائل (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="خط تحت (Ctrl+U)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="خط وسط"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        {/* Highlight & Color */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowColorPicker(!showColorPicker)}
            isActive={editor.isActive("textStyle")}
            title="لون النص"
          >
            <Palette className="h-4 w-4" />
          </ToolbarButton>
          {showColorPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowColorPicker(false)} />
              <div className="absolute top-full left-0 mt-1 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-3 grid grid-cols-4 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-7 h-7 rounded-full border border-slate-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => setTextColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          title="تظليل"
        >
          <Highlighter className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="عنوان رئيسي (H1)"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="عنوان فرعي (H2)"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="عنوان فرعي (H3)"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="محاذاة لليمين"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="توسيط"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="محاذاة لليسار"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          title="ضبط"
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        {/* Lists & Quotes */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="قائمة نقطية"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="قائمة مرقمة"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="اقتباس"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        {/* Media */}
        <ToolbarButton
          onClick={() => setShowImageUpload(!showImageUpload)}
          isActive={showImageUpload}
          title="إدراج صورة"
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setShowYoutube(!showYoutube)}
          isActive={showYoutube}
          title="تضمين يوتيوب"
        >
          <YoutubeIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={insertTable}
          title="إدراج جدول"
        >
          <TableIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="كتلة كود"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        {/* Inline */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="كود مضمن"
        >
          <FileCode className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive("subscript")}
          title="نص سفلي"
        >
          <SubscriptIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive("superscript")}
          title="نص علوي"
        >
          <SuperscriptIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={insertDivider}
          title="خط فاصل"
        >
          <DividerIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={addLink}
          isActive={editor.isActive("link")}
          title="رابط (Ctrl+K)"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        {/* History */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="تراجع (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="إعادة (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        {/* View Toggle */}
        <ToolbarButton
          onClick={toggleHtmlView}
          isActive={showHtml}
          title={showHtml ? "عرض المحرر" : "عرض HTML"}
        >
          {showHtml ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </ToolbarButton>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="p-3 bg-slate-800/50 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="أدخل رابط الصورة أو ارفع ملف..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white flex-1"
              dir="ltr"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-slate-600 hover:bg-slate-700"
              onClick={() => fileInputRef.current?.click()}
            >
              <PanelTopOpen className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={insertImage}
              disabled={!imageUrl}
            >
              إدراج
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
              onClick={() => { setShowImageUpload(false); setImageUrl(""); }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Youtube Modal */}
      {showYoutube && (
        <div className="p-3 bg-slate-800/50 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="رابط فيديو يوتيوب..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white flex-1"
              dir="ltr"
            />
            <Button
              type="button"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
              onClick={insertYoutube}
              disabled={!youtubeUrl}
            >
              <YoutubeIcon className="h-4 w-4 mr-1" />
              تضمين
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
              onClick={() => { setShowYoutube(false); setYoutubeUrl(""); }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Table Controls */}
      {editor.isActive("table") && (
        <div className="flex items-center gap-1 p-2 bg-slate-800/30 border-b border-slate-700">
          <span className="text-xs text-slate-500 px-2">جدول:</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-slate-400 hover:text-white"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
          >
            <Plus className="h-3 w-3" /> عمود قبل
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-slate-400 hover:text-white"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            <Plus className="h-3 w-3" /> عمود بعد
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-slate-400 hover:text-white"
            onClick={() => editor.chain().focus().addRowBefore().run()}
          >
            <Rows3 className="h-3 w-3" /> صف قبل
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-slate-400 hover:text-white"
            onClick={() => editor.chain().focus().addRowAfter().run()}
          >
            <Rows3 className="h-3 w-3" /> صف بعد
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            <Trash2 className="h-3 w-3" /> حذف الجدول
          </Button>
        </div>
      )}

      {/* Bubble Menu (Floating on selection) */}
      {editor && (
        <BubbleMenu
          editor={editor}
          className="flex items-center gap-0.5 bg-slate-800 border border-slate-600 rounded-lg shadow-xl p-1"
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="عريض"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="مائل"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="خط تحت"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
            title="تظليل"
          >
            <Highlighter className="h-4 w-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-slate-600 mx-0.5" />
          <ToolbarButton
            onClick={addLink}
            isActive={editor.isActive("link")}
            title="رابط"
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="إزالة الرابط"
          >
            <Trash2 className="h-4 w-4" />
          </ToolbarButton>
        </BubbleMenu>
      )}

      {/* Editor Content */}
      {!showHtml ? (
        <EditorContent editor={editor} className="flex-1 min-h-0" />
      ) : (
        <textarea
          value={htmlContent}
          onChange={(e) => {
            setHtmlContent(e.target.value);
            editor?.commands.setContent(e.target.value);
          }}
          className="flex-1 p-4 bg-slate-900 text-slate-300 font-mono text-sm resize-none outline-none min-h-[350px]"
          dir="ltr"
        />
      )}

      {/* Bottom Status Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/50 border-t border-slate-700 text-[10px] text-slate-500">
        <div className="flex items-center gap-3">
          <span>TipTap Pro Editor</span>
          <span className="text-slate-600">|</span>
          <span>Markdown/HTML متوافق</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Ctrl+B عريض</span>
          <span className="text-slate-600">Ctrl+I مائل</span>
          <span className="text-slate-600">Ctrl+K رابط</span>
          <span className="text-slate-600">Ctrl+S حفظ</span>
        </div>
      </div>
    </div>
  );
}
