import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

export default function EditProfileModal({ open, onClose, onSave }: Props) {
    const [formData, setFormData] = useState({
        firstName: "Tasneem",
        lastName: "Noble",
        headline: "Default: The New School",
        pronouns: "she/her",
        location: "66 West 12th Street, New York, New York 10011, United States",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName">First name</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last name</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="headline">Headline (optional)</Label>
                            <Input
                                id="headline"
                                name="headline"
                                value={formData.headline}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label htmlFor="pronouns">Pronouns (optional)</Label>
                            <Input
                                id="pronouns"
                                name="pronouns"
                                value={formData.pronouns}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label htmlFor="location">Location (optional)</Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
