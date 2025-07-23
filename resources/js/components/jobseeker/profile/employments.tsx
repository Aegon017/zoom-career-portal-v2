import PopupModal from '@/components/popup-modal';
import { User } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Select from 'react-select';
import EditButton from './edit-button';

interface Props {
    user: User;
    isUpdatable: boolean;
}

export interface WorkExperienceFormData {
    work_experiences: {
        company_id?: number | null;
        company_name?: string;
        title: string;
        start_date: Date | null;
        end_date: Date | null;
        is_current: boolean;
    }[];
}

export default function WorkExperiences({ user, isUpdatable }: Props) {
    const { control, handleSubmit, reset, watch } = useForm<WorkExperienceFormData>({
        defaultValues: {
            work_experiences: user.work_experiences.map((we) => ({
                company_id: we.company_id ?? null,
                company_name: we.company_id ? '' : we.company_name,
                title: we.title,
                start_date: we.start_date ? new Date(we.start_date) : null,
                end_date: we.end_date ? new Date(we.end_date) : null,
                is_current: we.is_current,
            })),
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'work_experiences' });
    const [activeModal, setActiveModal] = useState(false);
    const entries = watch('work_experiences');

    // Company select options and search term
    const [companyOptions, setCompanyOptions] = useState<{ label: string; value: number }[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch companies with debounce on searchTerm
    useEffect(() => {
        if (!searchTerm) {
            setCompanyOptions([]); // clear options if empty search
            return;
        }

        const delayDebounce = setTimeout(() => {
            axios
                .get<{ id: number; name: string }[]>('/companies', {
                    params: { search: searchTerm },
                })
                .then((res) => {
                    setCompanyOptions(res.data.map((c) => ({ value: c.id, label: c.name })));
                })
                .catch(() => {
                    setCompanyOptions([]);
                });
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    // Open modal and reset form values
    const openModal = useCallback(() => {
        reset({
            work_experiences: user.work_experiences.map((we) => ({
                company_id: we.company_id ?? null,
                company_name: we.company_id ? '' : we.company_name,
                title: we.title,
                start_date: we.start_date ? new Date(we.start_date) : null,
                end_date: we.end_date ? new Date(we.end_date) : null,
                is_current: we.is_current,
            })),
        });
        setActiveModal(true);
    }, [user.work_experiences, reset]);

    const closeModal = () => setActiveModal(false);

    // Submit handler - posts data
    const onSubmit = (data: WorkExperienceFormData) => {
        router.post(
            '/jobseeker/profile/employments',
            {
                work_experiences: data.work_experiences.map((we) => ({
                    ...we,
                    start_date: we.start_date?.toISOString().slice(0, 10),
                    end_date: we.end_date?.toISOString().slice(0, 10),
                })),
            },
            {
                preserveScroll: true,
                onSuccess: closeModal,
                onError: (errors) => console.error(errors),
            },
        );
    };

    return (
        <>
            <div className="zc-profile-employment zc-card-style-2 mb-3">
                <div className="zc-card-header d-flex justify-content-between align-items-center">
                    <h3>Employment</h3>
                    {isUpdatable && <EditButton onClick={openModal} />}
                </div>
                <div className="zc-card-content">
                    <div className="employment-list">
                        {user.work_experiences.length ? (
                            user.work_experiences.map((we, idx) => (
                                <div key={we.id || idx} className="employment-list-item">
                                    <div className="icon-text">
                                        <h3 className="job-title">{we.title}</h3>
                                    </div>
                                    <h4 className="company-name-location">{we.company_name ?? we.company.name}</h4>
                                    <div className="duration">
                                        {we.start_date ? format(new Date(we.start_date), 'MMM yyyy') : '-'} –{' '}
                                        {we.is_current ? 'Present' : we.end_date ? format(new Date(we.end_date), 'MMM yyyy') : '-'}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No employment entries yet.</p>
                        )}
                    </div>
                </div>
            </div>

            <PopupModal title="Edit Employment" isActive={activeModal} onClose={closeModal} onSave={handleSubmit(onSubmit)}>
                {fields.map((field, i) => {
                    const isOther = entries[i]?.company_id == null;
                    const isCurrent = entries[i]?.is_current;

                    return (
                        <div key={field.id} className="border-bottom mb-4 pb-3">
                            <label>Company</label>
                            <Controller
                                name={`work_experiences.${i}.company_id`}
                                control={control}
                                render={({ field }) => {
                                    const selected = companyOptions.find((opt) => opt.value === field.value) || null;

                                    return (
                                        <Select
                                            options={companyOptions}
                                            value={selected}
                                            onChange={(opt) => field.onChange(opt?.value ?? null)}
                                            onInputChange={(inputValue, action) => {
                                                if (action.action === 'input-change') {
                                                    setSearchTerm(inputValue);
                                                }
                                            }}
                                            onMenuOpen={() => {
                                                // Add selected company to options if missing
                                                if (field.value && !companyOptions.some((opt) => opt.value === field.value)) {
                                                    axios.get(`/companies/${field.value}`).then((res) => {
                                                        setCompanyOptions((prev) => [...prev, { value: res.data.id, label: res.data.name }]);
                                                    });
                                                }
                                            }}
                                            isClearable
                                            placeholder="Select company..."
                                        />
                                    );
                                }}
                            />

                            <div className="form-check mt-2">
                                <Controller
                                    name={`work_experiences.${i}.company_id`}
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={field.value == null}
                                            onChange={() => field.onChange(null)}
                                        />
                                    )}
                                />
                                <label className="form-check-label">Other (enter manually)</label>
                            </div>

                            {isOther && (
                                <Controller
                                    name={`work_experiences.${i}.company_name`}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <input type="text" {...field} className="form-control mt-2" placeholder="Custom company name" />
                                    )}
                                />
                            )}

                            <label className="mt-3">Title</label>
                            <Controller
                                name={`work_experiences.${i}.title`}
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => <input type="text" {...field} className="form-control" />}
                            />

                            <label className="mt-3">Start Date</label>
                            <Controller
                                name={`work_experiences.${i}.start_date`}
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                                    />
                                )}
                            />

                            <label className="mt-3">End Date</label>
                            <Controller
                                name={`work_experiences.${i}.end_date`}
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="date"
                                        className="form-control"
                                        disabled={isCurrent}
                                        value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                                    />
                                )}
                            />

                            <div className="form-check mt-2">
                                <Controller
                                    name={`work_experiences.${i}.is_current`}
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    )}
                                />
                                <label className="form-check-label">Currently Working Here</label>
                            </div>

                            <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => remove(i)}>
                                Remove
                            </button>
                        </div>
                    );
                })}

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                        append({
                            company_id: null,
                            company_name: '',
                            title: '',
                            start_date: null,
                            end_date: null,
                            is_current: false,
                        })
                    }
                >
                    Add Employment
                </button>
            </PopupModal>
        </>
    );
}
