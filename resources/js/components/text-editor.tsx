import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";

interface QuillEditorProps {
	value: string;
	onChange: (value: string) => void;
	disabled: boolean;
	placeholder?: string;
}

const TextEditor: React.FC<QuillEditorProps> = ({
	value,
	onChange,
	disabled,
	placeholder = "",
}) => {
	const editorRef = useRef<HTMLDivElement | null>(null);
	const quillRef = useRef<Quill | null>(null);

	useEffect(() => {
		if (editorRef.current && !quillRef.current) {
			// Initialize Quill with placeholder support
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
				placeholder, // Set the placeholder
				readOnly: disabled,
			});

			// Set initial value if provided
			if (value) {
				quillRef.current.root.innerHTML = value;
			}

			quillRef.current.on("text-change", () => {
				const html =
					editorRef.current!.querySelector(".ql-editor")?.innerHTML || "";
				onChange(html);
			});
		}
	}, [onChange, disabled, placeholder]); // Add placeholder to dependencies

	useEffect(() => {
		if (quillRef.current && value !== quillRef.current.root.innerHTML) {
			quillRef.current.root.innerHTML = value;
		}
	}, [value]);

	useEffect(() => {
		if (quillRef.current) {
			quillRef.current.enable(!disabled);
		}
	}, [disabled]);

	return (
		<div className="bg-background rounded-xl border shadow-sm">
			<style>{`
                .ql-toolbar {
                    border-radius: 0.75rem 0.75rem 0 0;
                    background-color: #f6f6f6;
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

                /* Style for placeholder */
                .ql-editor.ql-blank::before {
                    color: rgba(0, 0, 0, 0.6);
                    font-style: normal;
                    left: 1rem;
                    right: 1rem;
                }
            `}</style>

			<div ref={editorRef} className="min-h-[10rem] rounded-b-xl px-0 py-0" />
		</div>
	);
};

export default TextEditor;
