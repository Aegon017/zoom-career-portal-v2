import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import clsx from "clsx";

const themes = [
    { name: "Magician", color: "bg-gradient-to-r from-purple-800 via-purple-600 to-pink-500", key: "magician" },
    { name: "Poolside", color: "bg-cyan-200", key: "poolside" },
    { name: "Notebook", color: "bg-yellow-300", key: "notebook" },
    { name: "Tangerine", color: "bg-orange-500", key: "tangerine" },
    { name: "Sky", color: "bg-blue-500", key: "sky" },
    { name: "Violet", color: "bg-violet-400", key: "violet" },
    { name: "Lime", color: "bg-lime-300", key: "lime" },
    { name: "Nori", color: "bg-green-900", key: "nori" },
];

export default function EditBannerModal({
    open,
    onClose,
    onSave,
}: {
    open: boolean;
    onClose: () => void;
    onSave: (theme: string) => void;
}) {
    const [selected, setSelected] = useState("magician");

    const handleSave = () => {
        onSave(selected);
        onClose();
    };

    const selectedTheme = themes.find((t) => t.key === selected);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="p-0 overflow-hidden">
                {/* Banner Preview */}
                <div className={clsx("h-40 w-full", selectedTheme?.color)} />

                {/* Content */}
                <div className="p-6 bg-white">
                    <DialogHeader>
                        <DialogTitle>Edit Banner</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground mb-4">Choose a theme</p>

                    <div className="flex flex-wrap gap-2 mb-6" role="radiogroup" aria-label="Theme options">
                        {themes.map((theme) => (
                            <button
                                key={theme.key}
                                type="button"
                                onClick={() => setSelected(theme.key)}
                                role="radio"
                                aria-checked={selected === theme.key}
                                className={clsx(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition focus:outline-none",
                                    selected === theme.key
                                        ? "border-black bg-black/5 ring-1 ring-black/30"
                                        : "border-muted"
                                )}
                            >
                                <span
                                    className={clsx(
                                        "w-4 h-4 rounded-full",
                                        theme.color,
                                        selected === theme.key && "ring ring-offset-1 ring-black/40"
                                    )}
                                />
                                {theme.name}
                            </button>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
