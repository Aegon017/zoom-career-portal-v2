import AppLayout from "@/layouts/jobseeker-layout";
import FileUpload from "@/components/file-upload";
import { Head, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface Resume {
    id: number;
    name: string;
    url: string;
    uploaded_at: string;
}

type FormValues = {
    resume: string | null;
};

export default function MyDocuments({ resumes }: { resumes: Resume[] }) {
    const form = useForm<FormValues>({
        defaultValues: {
            resume: null,
        },
    });

    const { handleSubmit, control, setValue, watch, reset } = form;
    const file = watch("resume");

    const onSubmit = async (data: FormValues) => {
        if (!data.resume) return;

        const formData = new FormData();
        formData.append("resume", data.resume);

        router.post("/jobseeker/resumes", formData, {
            forceFormData: true,
            onSuccess: () => {
                reset();
            },
            onError: () => {
                toast.error("Upload failed");
            },
        });
    };

    const deleteResume = (id: number) => {
        if (!confirm("Are you sure you want to delete this resume?")) return;

        router.delete(`/jobseeker/resumes/destroy/${id}`, {
            onError: () => toast.error("Failed to delete resume"),
        });
    };

    return (
        <AppLayout>
            <Head title="My Documents" />
            <div className="zc-job-details-wrapper">
                <div className="zc-container">
                    <div className="container mt-5">
                        <h1 className="mb-4">My Resumes</h1>

                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <FormField
                                    control={control}
                                    name="resume"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Upload Resume</FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    placeholder="Upload your resume (PDF/DOC)"
                                                    name="file"
                                                    acceptedFileTypes={[
                                                        'application/pdf',
                                                        'application/msword',
                                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                                    ]}
                                                    onUploaded={(path) => setValue("resume", path)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <button
                                    className="btn btn-primary mt-2"
                                    type="submit"
                                    disabled={!file}
                                >
                                    Upload
                                </button>
                            </form>
                        </Form>

                        <div className="list-group mt-4">
                            {resumes.length === 0 ? (
                                <div className="text-muted">No resumes uploaded yet.</div>
                            ) : (
                                resumes.map((resume) => (
                                    <div
                                        key={resume.id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        <div>
                                            <strong>{resume.name}</strong>
                                            <div className="small text-muted">
                                                Uploaded: {new Date(resume.uploaded_at).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <a
                                                href={resume.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline-secondary btn-sm"
                                            >
                                                View
                                            </a>
                                            <button
                                                onClick={() => deleteResume(resume.id)}
                                                className="btn btn-outline-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
