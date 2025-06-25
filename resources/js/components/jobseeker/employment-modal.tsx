import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { WorkExperience, Company } from "@/types";
import FileUpload from "@/components/file-upload";
import { DatePicker } from "../date-picker";
import PopupModal from "../popup-modal";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

interface Props {
    isActive: boolean;
    handleClose: () => void;
    companies: Company[];
    defaultValues?: Partial<WorkExperience>;
}

export default function EmploymentModal({
    isActive,
    handleClose,
    companies,
    defaultValues,
}: Props) {
    const [manualEntry, setManualEntry] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<WorkExperience>({
        defaultValues: {
            ...defaultValues,
            is_current: defaultValues?.is_current ?? false,
        },
    });

    useEffect(() => {
        if (isActive) {
            reset({
                ...defaultValues,
                is_current: defaultValues?.is_current ?? false,
            });

            setManualEntry(Boolean(!defaultValues?.company_id && defaultValues?.company_name));
        }
    }, [defaultValues, isActive, reset]);

    const is_current = watch("is_current");

    const onSubmit = (data: any) => {
        router.post(route("jobseeker.profile.experience.store"), data, {
            preserveScroll: true,
            onError: (errors) => {
                toast.error("Failed to add experience.");
                console.error(errors);
            },
        });
    };

    return (
        <PopupModal
            isActive={isActive}
            title="Employment Details"
            onClose={handleClose}
            onSave={handleSubmit(onSubmit)}
        >
            <div className="modal-body overflow-auto" style={{ maxHeight: "400px" }}>
                <div className="mb-3">
                    {!manualEntry ? (
                        <>
                            <label htmlFor="company_id" className="form-label">
                                Select Company:
                            </label>
                            <select
                                id="company_id"
                                className="form-control"
                                {...register("company_id", { required: !manualEntry })}
                            >
                                <option value="">Select company...</option>
                                {companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.company_name}
                                    </option>
                                ))}
                            </select>
                            {errors.company_id && (
                                <p className="text-danger">Company is required</p>
                            )}
                        </>
                    ) : (
                        <>
                            <label htmlFor="company_name" className="form-label">
                                Company Name:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                {...register("company_name", { required: manualEntry })}
                                placeholder="Enter company name"
                            />
                            {errors.company_name && (
                                <p className="text-danger">Company name is required</p>
                            )}

                            <label className="form-label mt-2">Company Logo:</label>
                            <FileUpload
                                acceptedFileTypes={["image/*"]}
                                placeholder="Upload logo"
                                name="file"
                                onUploaded={(url) => setValue("company_logo", url)}
                            />
                        </>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id="manualCompany"
                            checked={manualEntry}
                            onChange={(e) => {
                                setManualEntry(e.target.checked);
                                setValue("company_id", undefined);
                            }}
                        />
                        <label htmlFor="manualCompany" className="text-sm text-muted-foreground">
                            Company not listed? Add manually
                        </label>
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Job Title:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        {...register("title", { required: true })}
                        placeholder="e.g. Senior Developer"
                    />
                    {errors.title && <p className="text-danger">Job title is required</p>}
                </div>

                <div className="mb-3 grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="form-label">Start Date:</label>
                        <DatePicker
                            date={watch("start_date") ? new Date(watch("start_date")) : undefined}
                            onChange={(date) => setValue("start_date", date?.toISOString() || "")}
                        />
                        {errors.start_date && (
                            <p className="text-danger">Start date is required</p>
                        )}
                    </div>
                    {!is_current && (
                        <div>
                            <label className="form-label">End Date:</label>
                            <DatePicker
                                date={watch("end_date") ? new Date(watch("end_date")) : undefined}
                                onChange={(date) => setValue("end_date", date?.toISOString() || "")}
                                disabled={is_current}
                            />
                            {errors.end_date && <p className="text-danger">End date is required</p>}
                        </div>
                    )}
                </div>

                <div className="mb-3 flex items-center gap-2">
                    <input type="checkbox" id="is_current" {...register("is_current")} />
                    <label htmlFor="is_current">I currently work here</label>
                </div>
            </div>
        </PopupModal>
    );
}