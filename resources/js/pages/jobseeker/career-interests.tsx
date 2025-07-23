import { MultiSelect } from '@/components/multi-select';
import AppLayout from '@/layouts/jobseeker-layout';
import { Head, router } from '@inertiajs/react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

interface Option {
    value: string | number;
    label: string;
}

interface Props {
    years: string[];
    months: string[];
    industries: Option[];
    locations: Option[];
    employmentTypes: Option[];
    jobTitles: Option[];
    initialValues?: FormValues;
}

type FormValues = {
    graduation_month: string;
    graduation_year: string;
    employment_types: string[];
    desired_jobs: number[];
    target_industries: number[];
    preferred_locations: number[];
};

const CareerInterests: React.FC<Props> = ({ years, months, industries, locations, employmentTypes, jobTitles, initialValues }) => {
    const { register, handleSubmit, control } = useForm<FormValues>({
        defaultValues: initialValues || {
            graduation_month: '',
            graduation_year: '',
            employment_types: [],
            desired_jobs: [],
            target_industries: [],
            preferred_locations: [],
        },
    });

    const onSubmit = (values: FormValues) => {
        router.post('/jobseeker/career-interests/update', values);
    };

    const toggleCheckboxValue = (selected: string[], value: string): string[] =>
        selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value];

    return (
        <AppLayout>
            <Head title="Career Interests" />
            <div className="zc-container py-4">
                <div className="page-title px-4">
                    <h2 className="mt-0">Career Interests</h2>
                </div>
                <div className="p-md-5 mx-auto rounded bg-white p-3 shadow-sm">
                    <h3 className="mb-2">Zoom Career wants to help you find the career and job that's right for you.</h3>
                    <p className="border-bottom mb-4 pb-2">
                        Tell us a little more about yourself and we'll recommend jobs that match your interests.
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)} className="row gy-4 gx-3">
                        <div className="col-12">
                            <label className="form-label fw-bold">Employment Types</label>
                            <Controller
                                name="employment_types"
                                control={control}
                                render={({ field }) => (
                                    <div className="d-flex flex-column gap-2">
                                        {employmentTypes.map((option) => (
                                            <div key={option.value} className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`employment_${option.value}`}
                                                    checked={(field.value || []).includes(option.value.toString())}
                                                    onChange={() => field.onChange(toggleCheckboxValue(field.value || [], option.value.toString()))}
                                                />
                                                <label htmlFor={`employment_${option.value}`} className="form-check-label">
                                                    {option.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />
                        </div>

                        <div className="col-md-6 col-12">
                            <label className="form-label fw-bold">Job Types</label>
                            <Controller
                                name="desired_jobs"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        defaultValue={Array.isArray(field.value) ? field.value.map(String) : []}
                                        options={jobTitles.map((opt) => ({ ...opt, value: String(opt.value) }))}
                                        value={field.value?.map(String)}
                                        onValueChange={(val) => field.onChange(val.map(Number))}
                                    />
                                )}
                            />
                        </div>

                        <div className="col-md-6 col-12">
                            <label className="form-label fw-bold">Target Industries</label>
                            <Controller
                                name="target_industries"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        defaultValue={Array.isArray(field.value) ? field.value.map(String) : []}
                                        options={industries.map((opt) => ({ ...opt, value: String(opt.value) }))}
                                        value={field.value?.map(String)}
                                        onValueChange={(val) => field.onChange(val.map(Number))}
                                    />
                                )}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-bold">Preferred Locations</label>
                            <Controller
                                name="preferred_locations"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        defaultValue={Array.isArray(field.value) ? field.value.map(String) : []}
                                        options={locations.map((opt) => ({ ...opt, value: String(opt.value) }))}
                                        value={field.value?.map(String)}
                                        onValueChange={(val) => field.onChange(val.map(Number))}
                                    />
                                )}
                            />
                        </div>

                        <div className="col-md-6 col-12">
                            <label className="form-label fw-bold">Graduation Year</label>
                            <select className="form-select" {...register('graduation_year')}>
                                <option value="">Select Year</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6 col-12">
                            <label className="form-label fw-bold">Graduation Month</label>
                            <select className="form-select" {...register('graduation_month')}>
                                <option value="">Select Month</option>
                                {months.map((month) => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 text-end">
                            <button type="submit" className="btn btn-primary px-4">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default CareerInterests;
