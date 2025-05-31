import { useEffect, useRef } from "react";
import Quill from "quill";

import "quill/dist/quill.snow.css";

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const TextEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image", "code-block"],
                        ["clean"],
                    ],
                },
            });

            quillRef.current.on("text-change", () => {
                const html = editorRef.current!.querySelector(".ql-editor")?.innerHTML || "";
                onChange(html);
            });
        }
    }, [onChange]);

    useEffect(() => {
        if (quillRef.current) {
            const currentHtml = quillRef.current.root.innerHTML;
            if (value !== currentHtml) {
                quillRef.current.root.innerHTML = value;
            }
        }
    }, [value]);

    return (
        <div className="rounded-xl border bg-background shadow-sm">
            <style>{`
        .ql-toolbar {
          border-radius: 0.75rem 0.75rem 0 0;
          background-color: #27272a;
          border: none !important;
          padding: 0.5rem;
        }

        .ql-container {
          border: none !important;
          font-family: inherit;
        }

        .ql-editor {
          min-height: 10rem;
          font-size: 1rem;
          padding: 0.75rem 1rem;
        }

        .ql-editor:focus {
          outline: none;
        }
      `}</style>

            <div
                ref={editorRef}
                className="min-h-[10rem] rounded-b-xl px-0 py-0"
            />
        </div>
    );
};

export default TextEditor;
