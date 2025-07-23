import FileUpload from '@/components/file-upload';
import { WorkExperience } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import { toast } from 'sonner';
import { DatePicker } from '../date-picker';
import PopupModal from '../popup-modal';

interface Props {
    isActive: boolean;
    handleClose: () => void;
    defaultValues?: Partial<WorkExperience>;
}

type CompanyOption = { label: string; value: number };

type FormData = {
    company_id: number | null;
    company_name: string;
    logo?: string;
    title: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
};

export default function EmploymentModal({ isActive, handleClose, defaultValues }: Props) {
    const [manualEntry, setManualEntry] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        defaultValues: {
            company_id: null,
            company_name: '',
            logo: '',
            title: '',
            start_date: '',
            end_date: '',
            is_current: false,
            ...defaultValues,
        },
    });

    // Sync modal open state and defaults
    useEffect(() => {
        if (isActive) {
            const isManual = !defaultValues?.company_id && !!defaultValues?.company_name;
            setManualEntry(isManual);

            if (defaultValues?.company_id && defaultValues?.company_name) {
                setSelectedCompany({ label: defaultValues.company_name, value: defaultValues.company_id });
            } else {
                setSelectedCompany(null);
            }

            reset({
                ...defaultValues,
                company_id: defaultValues?.company_id ?? null,
                is_current: defaultValues?.is_current ?? false,
            });
        }
    }, [isActive, defaultValues, reset]);

    const loadCompanyOptions = useCallback(async (input: string) => {
        if (!input) return [];
        try {
            const { data } = await axios.get(`/companies?search=${encodeURIComponent(input)}`);
            return data.map((c: { id: number; name: string }) => ({
                label: c.name,
                value: c.id,
            }));
        } catch {
            return [];
        }
    }, []);

    const onCompanyChange = (option: CompanyOption | null) => {
        setSelectedCompany(option);
        setValue('company_id', option ? option.value : null, { shouldValidate: true });
        if (option) setValue('company_name', option.label);
    };

    const isCurrent = watch('is_current');

    const onSubmit = async (data: FormData) => {
        try {
            await router.post(
                '/jobseeker/profile/experience',
                { ...data },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Experience saved successfully!');
                        handleClose();
                    },
                    onError: () => {
                        toast.error('Failed to save experience.');
                    },
                },
            );
        } catch {
            toast.error('An unexpected error occurred.');
        }
    };

    return (
        <PopupModal isActive={isActive} title="Employment Details" onClose={handleClose} onSave={handleSubmit(onSubmit)}>
            <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div className="mb-3">
                    {!manualEntry ? (
                        <>
                            <label htmlFor="company-select" className="form-label">
                                Select Company
                            </label>
                            <Controller
                                control={control}
                                name="company_id"
                                rules={{ required: !manualEntry }}
                                render={({ field }) => (
                                    <AsyncSelect
                                        {...field}
                                        inputId="company-select"
                                        cacheOptions
                                        defaultOptions
                                        loadOptions={loadCompanyOptions}
                                        onChange={(option) => {
                                            field.onChange(option?.value ?? null);
                                            onCompanyChange(option);
                                        }}
                                        value={selectedCompany}
                                        isClearable
                                        placeholder="Search or select company..."
                                    />
                                )}
                            />
                            {errors.company_id && <p className="text-danger mt-1">Company is required</p>}
                        </>
                    ) : (
                        <>
                            <label htmlFor="company_name" className="form-label">
                                Company Name
                            </label>
                            <input
                                id="company_name"
                                type="text"
                                className={`form-control ${errors.company_name ? 'is-invalid' : ''}`}
                                {...register('company_name', { required: manualEntry })}
                                placeholder="Enter company name"
                            />
                            {errors.company_name && <p className="text-danger mt-1">Company name is required</p>}

                            <label className="form-label mt-3">Company Logo</label>
                            <FileUpload
                                acceptedFileTypes={['image/*']}
                                placeholder="Upload logo"
                                name="file"
                                onUploaded={(url) => setValue('logo', url)}
                            />
                        </>
                    )}
                    <div className="form-check mt-2">
                        <input
                            type="checkbox"
                            id="manualCompany"
                            className="form-check-input"
                            checked={manualEntry}
                            onChange={(e) => {
                                setManualEntry(e.target.checked);
                                if (e.target.checked) {
                                    setSelectedCompany(null);
                                    setValue('company_id', null);
                                }
                            }}
                        />
                        <label htmlFor="manualCompany" className="form-check-label">
                            Company not listed? Add manually
                        </label>
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Job Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        {...register('title', { required: true })}
                        placeholder="e.g. Senior Developer"
                    />
                    {errors.title && <p className="text-danger mt-1">Job title is required</p>}
                </div>

                <div className="d-flex mb-3 flex-wrap gap-3">
                    <div className="flex-grow-1">
                        <label htmlFor="start_date" className="form-label">
                            Start Date
                        </label>
                        <Controller
                            control={control}
                            name="start_date"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <DatePicker
                                    date={field.value ? new Date(field.value) : undefined}
                                    onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                                />
                            )}
                        />
                        {errors.start_date && <p className="text-danger mt-1">Start date is required</p>}
                    </div>

                    {!isCurrent && (
                        <div className="flex-grow-1">
                            <label htmlFor="end_date" className="form-label">
                                End Date
                            </label>
                            <Controller
                                control={control}
                                name="end_date"
                                rules={{ required: !isCurrent }}
                                render={({ field }) => (
                                    <DatePicker
                                        date={field.value ? new Date(field.value) : undefined}
                                        onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                                        disabled={isCurrent}
                                    />
                                )}
                            />
                            {errors.end_date && <p className="text-danger mt-1">End date is required</p>}
                        </div>
                    )}
                </div>

                <div className="form-check mb-0">
                    <input id="is_current" type="checkbox" className="form-check-input" {...register('is_current')} />
                    <label htmlFor="is_current" className="form-check-label">
                        I currently work here
                    </label>
                </div>
            </div>
        </PopupModal>
    );
}
