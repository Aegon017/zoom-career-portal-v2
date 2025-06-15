import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import FileUpload from "@/components/file-upload";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    headline: z.string().optional(),
    pronouns: z.string().optional(),
    location: z.string().optional(),
    profile_image: z.string().optional(),
});

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (data: Record<string, any>) => void;
    user?: {
        name: string;
        headline?: string;
        pronouns?: string;
        location?: string;
        profile_image?: string;
    };
}

export default function EditProfileModal({ open, onClose, onSave, user }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            headline: "",
            pronouns: "",
            location: "",
            profile_image: "",
        },
    });

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = form;

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || "",
                headline: user.headline || "",
                pronouns: user.pronouns || "",
                location: user.location || "",
                profile_image: user.profile_image || "",
            });
        }
    }, [user, reset]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        onSave(values);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile. Click save when done.
                            </DialogDescription>
                        </DialogHeader>

                        <FormField
                            control={control}
                            name="profile_image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile image</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            acceptedFileTypes={['image/*']}
                                            placeholder="Upload profile image"
                                            name="file"
                                            onUploaded={(url) => setValue("profile_image", url)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Your full name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="headline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Headline (optional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g., Product Manager at Stripe" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="pronouns"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pronouns (optional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g., she/her" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location (optional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g., New York, USA" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-2">
                            <DialogClose asChild>
                                <Button type="button" variant="ghost" onClick={onClose}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}