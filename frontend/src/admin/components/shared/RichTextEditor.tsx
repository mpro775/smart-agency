import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "ابدأ الكتابة...",
  className,
}: RichTextEditorProps) {
  const [editorState, setEditorState] = useState(0); // Force re-render when selection changes

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full rounded-lg",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        dir: "rtl",
        class: "prose-rtl",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: () => {
      setEditorState((prev) => prev + 1); // Force re-render to update toolbar buttons
    },
    onTransaction: () => {
      setEditorState((prev) => prev + 1); // Force re-render on any editor transaction
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  // Custom styles for lists
  const listStyles = `
    .ProseMirror ul {
      list-style-type: disc;
      padding-left: 1.5rem;
    }
    .ProseMirror ol {
      list-style-type: decimal;
      padding-left: 1.5rem;
    }
    .ProseMirror li {
      margin-bottom: 0.25rem;
      line-height: 1.625;
    }
    .prose-rtl ul,
    .prose-rtl ol {
      padding-left: 0;
      padding-right: 1.5rem;
    }
  `;

  const addLink = () => {
    const url = window.prompt("أدخل الرابط:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("أدخل رابط الصورة:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8",
        isActive
          ? "bg-slate-700 text-emerald-400"
          : "text-slate-400 hover:text-white"
      )}
      onClick={onClick}
      title={title}
    >
      {children}
    </Button>
  );

  return (
    <div
      className={cn(
        "border border-slate-700 rounded-xl overflow-hidden",
        className
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: listStyles }} />
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-1 p-2 bg-slate-800/50 border-b border-slate-700"
        key={editorState}
      >
        <ToolbarButton
          key={`bold-${editorState}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="عريض"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          key={`italic-${editorState}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="مائل"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          key={`code-${editorState}`}
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="كود"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        <ToolbarButton
          key={`h1-${editorState}`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="عنوان 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          key={`h2-${editorState}`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="عنوان 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          key={`h3-${editorState}`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="عنوان 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        {/* Font Size Buttons */}
        <ToolbarButton
          key={`small-${editorState}`}
          onClick={() => {
            const { from, to } = editor?.state.selection || {};
            if (from !== to) {
              // Get selected text
              const text = editor?.state.doc.textBetween(from, to) || "";
              if (text) {
                // Replace selected text with styled span
                editor
                  ?.chain()
                  .focus()
                  .deleteSelection()
                  .insertContent(
                    `<span style="font-size: 14px;">${text}</span>`
                  )
                  .run();
              }
            }
          }}
          title="نص صغير"
        >
          <span className="text-xs font-bold">ص</span>
        </ToolbarButton>

        <ToolbarButton
          key={`normal-${editorState}`}
          onClick={() => {
            const { from, to } = editor?.state.selection || {};
            if (from !== to) {
              // Get selected text
              const text = editor?.state.doc.textBetween(from, to) || "";
              if (text) {
                // Replace selected text with styled span
                editor
                  ?.chain()
                  .focus()
                  .deleteSelection()
                  .insertContent(
                    `<span style="font-size: 16px;">${text}</span>`
                  )
                  .run();
              }
            }
          }}
          title="نص عادي"
        >
          <span className="text-sm font-bold">ع</span>
        </ToolbarButton>

        <ToolbarButton
          key={`large-${editorState}`}
          onClick={() => {
            const { from, to } = editor?.state.selection || {};
            if (from !== to) {
              // Get selected text
              const text = editor?.state.doc.textBetween(from, to) || "";
              if (text) {
                // Replace selected text with styled span
                editor
                  ?.chain()
                  .focus()
                  .deleteSelection()
                  .insertContent(
                    `<span style="font-size: 18px;">${text}</span>`
                  )
                  .run();
              }
            }
          }}
          title="نص كبير"
        >
          <span className="text-base font-bold">ك</span>
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        <ToolbarButton
          key={`bullet-${editorState}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="قائمة نقطية"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          key={`ordered-${editorState}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="قائمة مرقمة"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          key={`quote-${editorState}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="اقتباس"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        <ToolbarButton
          key={`link-${editorState}`}
          onClick={addLink}
          isActive={editor.isActive("link")}
          title="رابط"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          key={`image-${editorState}`}
          onClick={addImage}
          title="صورة"
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        <ToolbarButton
          key={`undo-${editorState}`}
          onClick={() => editor.chain().focus().undo().run()}
          title="تراجع"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          key={`redo-${editorState}`}
          onClick={() => editor.chain().focus().redo().run()}
          title="إعادة"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose prose-invert prose-emerald max-w-none p-4 min-h-[300px] bg-slate-700/30 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[250px] [&_.ProseMirror]:text-white [&_.ProseMirror_h1]:text-white [&_.ProseMirror_h2]:text-white [&_.ProseMirror_h3]:text-white [&_.ProseMirror_p]:text-slate-200 [&_.ProseMirror_ul]:text-slate-200 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:text-slate-200 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_li]:text-slate-200 [&_.ProseMirror_li]:mb-1 [&_.ProseMirror_li]:leading-relaxed [&_.ProseMirror_blockquote]:text-slate-300 [&_.ProseMirror_code]:text-slate-100 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-slate-500 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.prose-rtl]:direction-rtl [&_.prose-rtl_h1]:text-right [&_.prose-rtl_h2]:text-right [&_.prose-rtl_h3]:text-right [&_.prose-rtl_p]:text-right [&_.prose-rtl_ul]:text-right [&_.prose-rtl_ol]:text-right [&_.prose-rtl_li]:text-right [&_.prose-rtl_blockquote]:text-right"
      />
    </div>
  );
}
