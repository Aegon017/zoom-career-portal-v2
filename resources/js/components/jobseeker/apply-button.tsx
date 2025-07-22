import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { router } from "@inertiajs/react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FileUpload from "@/components/file-upload";

const applySchema = z.object({
    resume: z.union([z.string().nonempty("Please upload your resume."), z.literal("")]),
    selectedResumeId: z.number().nullable().optional(),
});

type ApplyFormData = z.infer<typeof applySchema>;

interface Resume {
    id: number;
    name: string;
    url: string;
    uploaded_at: string;
}

interface ApplyButtonProps {
    jobId: number;
    hasApplied: boolean;
    status?: string;
}

export default function ApplyButton({ jobId, hasApplied, status }: ApplyButtonProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [resumes, setResumes] = useState<Resume[]>([]);

    const form = useForm<ApplyFormData>({
        resolver: zodResolver(applySchema),
        defaultValues: {
            resume: "",
            selectedResumeId: null,
        },
    });

    const { handleSubmit, control, setValue, watch, reset } = form;
    const resume = watch("resume");
    const selectedResumeId = watch("selectedResumeId");

    useEffect(() => {
        if (dialogOpen) {
            fetch("/jobseeker/resumes/data")
                .then((res) => res.json())
                .then((data) => setResumes(data))
                .catch((err) => console.error("Failed to fetch resumes", err));
        }
    }, [dialogOpen]);

    const onSubmit = useCallback(
        (data: ApplyFormData) => {
            setIsProcessing(true);
            const formData = new FormData();

            if (data.selectedResumeId) {
                formData.append("resume_id", String(data.selectedResumeId));
            } else {
                formData.append("resume", data.resume);
            }

            router.post(`/jobseeker/jobs/${jobId}/apply`, formData, {
                preserveScroll: true,
                forceFormData: true,
                onFinish: () => {
                    setIsProcessing(false);
                    setDialogOpen(false);
                    reset();
                },
            });
        },
        [jobId, reset]
    );

    const handleWithdraw = () => {
        if (isProcessing) return;

        setIsProcessing(true);
        router.post(`/jobseeker/jobs/${jobId}/withdraw`, {}, {
            preserveScroll: true,
            onFinish: () => {
                setIsProcessing(false);
            },
        });
    };

    return (
        <>
            {hasApplied ? (
                <button
                    onClick={handleWithdraw}
                    disabled={isProcessing}
                    className="zc-btn zc-btn-primary"
                >
                    {isProcessing ? "Processing..." : `Withdraw${status ? ` (${status})` : ""}`}
                </button>
            ) : (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <button
                            disabled={isProcessing}
                            className="zc-btn zc-btn-primary"
                            type="button"
                        >
                            {isProcessing ? "Processing..." : "Apply Now"}
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Submit Your Resume</DialogTitle>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                                {/* Select from uploaded resumes */}
                                <FormField
                                    control={control}
                                    name="selectedResumeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Previous Resume</FormLabel>
                                            <FormControl>
                                                <select
                                                    className="form-select"
                                                    value={field.value || ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const id = val ? parseInt( val ) : null;;
                                                        setValue("selectedResumeId", id);
                                                        setValue("resume", "");
                                                    }}
                                                >
                                                    <option value="">-- Select an existing resume --</option>
                                                    {resumes.map((resume) => (
                                                        <option key={resume.id} value={resume.id}>
                                                            {resume.name} ({new Date(resume.uploaded_at).toLocaleDateString()})
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Upload new resume */}
                                <FormField
                                    control={control}
                                    name="resume"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Or Upload New Resume</FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    name="file"
                                                    acceptedFileTypes={[
                                                        "application/pdf",
                                                    ]}
                                                    placeholder="Drag & Drop your resume (PDF)"
                                                    onUploaded={(file) => {
                                                        setValue("resume", file);
                                                        setValue("selectedResumeId", null);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <button
                                        type="submit"
                                        className="zc-btn zc-btn-primary"
                                        disabled={isProcessing || (!resume && !selectedResumeId)}
                                    >
                                        {isProcessing ? "Submitting..." : "Submit Application"}
                                    </button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
