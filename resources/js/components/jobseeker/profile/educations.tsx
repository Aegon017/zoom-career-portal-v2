import PopupModal from '@/components/popup-modal';
import { Education, User } from '@/types';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import EditButton from './edit-button';

interface Props {
    isUpdatable: boolean;
    user: User;
}

interface EducationFormData {
    educations: Omit<Education, 'id' | 'created_at' | 'updated_at'>[];
}

const DateInput = ({ value, onChange, disabled }: { value: Date | null; onChange: (date: Date | null) => void; disabled?: boolean }) => {
    const formattedValue = useMemo(() => (value ? format(value, 'yyyy-MM-dd') : ''), [value]);

    return (
        <input
            type="date"
            className="form-control"
            disabled={disabled}
            value={formattedValue}
            onChange={(e) => {
                const val = e.target.value;
                onChange(val ? new Date(val) : null);
            }}
        />
    );
};

export default function Educations({ isUpdatable, user }: Props) {
    const { control, handleSubmit, reset, watch } = useForm<EducationFormData>({
        defaultValues: {
            educations:
                user.educations?.map((edu) => ({
                    ...edu,
                    start_date: edu.start_date ? new Date(edu.start_date) : null,
                    end_date: edu.end_date ? new Date(edu.end_date) : null,
                })) || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'educations',
    });

    const [activeModal, setActiveModal] = useState(false);
    const educationsWatch = watch('educations');

    const openModal = useCallback(() => {
        reset({
            educations:
                user.educations?.map((edu) => ({
                    ...edu,
                    start_date: edu.start_date ? new Date(edu.start_date) : null,
                    end_date: edu.end_date ? new Date(edu.end_date) : null,
                })) || [],
        });
        setActiveModal(true);
    }, [reset, user.educations]);

    const closeModal = useCallback(() => setActiveModal(false), []);

    const onSubmit = useCallback(
        (data: EducationFormData) => {
            router.post(
                '/jobseeker/profile/educations',
                {
                    educations: data.educations.map((edu) => ({
                        ...edu,
                        start_date: edu.start_date ? edu.start_date.toISOString() : null,
                        end_date: edu.end_date ? edu.end_date.toISOString() : null,
                    })),
                },
                {
                    preserveScroll: true,
                    onSuccess: closeModal,
                    onError: (errors) => console.error(errors),
                },
            );
        },
        [closeModal],
    );

    return (
        <>
            <div className="zc-profile-education zc-card-style-2 mb-3">
                <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                    <h3 className="mb-0">Education</h3>
                    {isUpdatable && <EditButton onClick={openModal} />}
                </div>
                <div className="zc-card-content">
                    <div className="education-list">
                        {user.educations?.length ? (
                            user.educations.map((edu) => (
                                <div className="education-list-item" key={edu.id || edu.course_title}>
                                    <div className="icon-text">
                                        <h3 className="education-course-title">{edu.course_title}</h3>
                                    </div>
                                    <h4 className="education-university-college">{edu.institution}</h4>
                                    <div className="course-type-year d-flex align-items-center mb-2 gap-1">
                                        <span className="year">
                                            {edu.start_date
                                                ? edu.is_current
                                                    ? `${new Date(edu.start_date).getFullYear()} - Present`
                                                    : edu.end_date
                                                      ? `${new Date(edu.start_date).getFullYear()} - ${new Date(edu.end_date).getFullYear()}`
                                                      : `${new Date(edu.start_date).getFullYear()} - -`
                                                : '-'}
                                        </span>
                                        <span className="divider" />
                                        <span className="course-type">{edu.course_type}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No education added yet.</p>
                        )}
                    </div>
                </div>
            </div>

            <PopupModal title="Edit Education" isActive={activeModal} onClose={closeModal} onSave={handleSubmit(onSubmit)}>
                {fields.map((field, index) => {
                    const isCurrent = educationsWatch?.[index]?.is_current;
                    return (
                        <div key={field.id} className="border-bottom mb-4 pb-3">
                            <label>Course Title</label>
                            <Controller
                                name={`educations.${index}.course_title`}
                                control={control}
                                rules={{ required: 'Course title is required' }}
                                render={({ field }) => (
                                    <input type="text" {...field} className="form-control" placeholder="e.g. B.Sc. Computer Science" />
                                )}
                            />

                            <label className="mt-2">Institution</label>
                            <Controller
                                name={`educations.${index}.institution`}
                                control={control}
                                rules={{ required: 'Institution is required' }}
                                render={({ field }) => (
                                    <input type="text" {...field} className="form-control" placeholder="e.g. Stanford University" />
                                )}
                            />

                            <label className="mt-2">Course Type</label>
                            <Controller
                                name={`educations.${index}.course_type`}
                                control={control}
                                render={({ field }) => (
                                    <select {...field} className="form-select">
                                        <option value="">Select</option>
                                        <option value="Full Time">Full Time</option>
                                        <option value="Part Time">Part Time</option>
                                        <option value="Online">Online</option>
                                    </select>
                                )}
                            />

                            <label className="mt-2">Start Date</label>
                            <Controller
                                name={`educations.${index}.start_date`}
                                control={control}
                                render={({ field }) => <DateInput value={field.value} onChange={field.onChange} />}
                            />

                            <label className="mt-2">End Date</label>
                            <Controller
                                name={`educations.${index}.end_date`}
                                control={control}
                                render={({ field }) => <DateInput value={field.value ?? null} onChange={field.onChange} disabled={isCurrent} />}
                            />

                            <div className="form-check mt-2">
                                <Controller
                                    name={`educations.${index}.is_current`}
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            onChange={(e) => field.onChange(e.target.checked)}
                                            checked={field.value}
                                        />
                                    )}
                                />
                                <label className="form-check-label">Currently Studying</label>
                            </div>

                            <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => remove(index)}>
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
                            course_title: '',
                            institution: '',
                            course_type: '',
                            start_date: null,
                            end_date: null,
                            is_current: false,
                        })
                    }
                >
                    Add Education
                </button>
            </PopupModal>
        </>
    );
}
