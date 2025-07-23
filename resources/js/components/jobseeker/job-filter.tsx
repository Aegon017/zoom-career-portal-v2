import { Option } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

type JobFiltersProps = {
    filters: any;
    employmentOptions: Option[];
    industries: Array<{ id: number; name: string }>;
};

const JobFilters = ({ filters, employmentOptions, industries }: JobFiltersProps) => {
    const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
    const [isEmploymentDropdownOpen, setIsEmploymentDropdownOpen] = useState(false);
    const [industrySearch, setIndustrySearch] = useState('');

    const industryRef = useRef<HTMLDivElement>(null);
    const employmentRef = useRef<HTMLDivElement>(null);

    const { data, setData } = useForm({
        company: filters?.company || '',
        job_title: filters?.job_title || '',
        employment_types: filters?.employment_types || [],
        industries: filters?.industries || [],
    });

    const debouncedCompany = useDebounce(data.company, 500);
    const debouncedJobTitle = useDebounce(data.job_title, 500);

    // Filter industries based on search
    const filteredIndustries = industries.filter((industry) => industry.name.toLowerCase().includes(industrySearch.toLowerCase()));

    // Single optimized effect for all filters
    useEffect(() => {
        const params = {
            company: debouncedCompany,
            job_title: debouncedJobTitle,
            employment_types: data.employment_types,
            industries: data.industries,
        };

        router.get('/jobseeker/jobs', params, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            only: ['initialJobs', 'filters'],
        });
    }, [debouncedCompany, debouncedJobTitle, data.employment_types, data.industries]);

    const toggleFilter = (field: 'employment_types' | 'industries', value: string) => {
        const current = data[field];
        const updated = current.includes(value) ? current.filter((v: string) => v !== value) : [...current, value];

        setData(field, updated);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (employmentRef.current && !employmentRef.current.contains(e.target as Node)) {
            setIsEmploymentDropdownOpen(false);
        }

        if (industryRef.current && !industryRef.current.contains(e.target as Node)) {
            setIsIndustryDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="zc-jobs-filter-wrapper zc-card">
            <div className="widget-header d-block mb-3">
                <div className="icon-text d-flex align-items-center gap-1">
                    <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M4 5L10 5M10 5C10 6.10457 10.8954 7 12 7C13.1046 7 14 6.10457 14 5M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5M14 5L20 5M4 12H16M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM8 19H20M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19Z"
                            stroke="#000000"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                    Filter By
                </div>
            </div>
            <div className="zc-job-filter-widget d-block position-relative w-100">
                {/* Company */}
                <div className="zc-field-wrap mb-2">
                    <label htmlFor="search_by_company">Company</label>
                    <input
                        type="text"
                        name="search_by_company"
                        id="search_by_company"
                        className="form-control"
                        value={data.company}
                        onChange={(e) => setData('company', e.target.value)}
                    />
                </div>

                {/* Job Title */}
                <div className="zc-field-wrap mb-2">
                    <label htmlFor="search_by_jobtitle">Job Title</label>
                    <input
                        type="text"
                        name="search_by_jobtitle"
                        id="search_by_jobtitle"
                        className="form-control"
                        value={data.job_title}
                        onChange={(e) => setData('job_title', e.target.value)}
                    />
                </div>

                {/* Employment Type Dropdown */}
                <div ref={employmentRef} className="zc-field-wrap zc-dropdown-field position-relative mb-2">
                    <label htmlFor="search_by_emptype">Employment Type</label>
                    <input
                        type="text"
                        id="search_by_emptype"
                        className="dropdown-toggle"
                        readOnly
                        value={data.employment_types.length ? `${data.employment_types.length} selected` : ''}
                        onClick={() => {
                            setIsEmploymentDropdownOpen((prev) => !prev);
                            setIsIndustryDropdownOpen(false);
                        }}
                    />
                    <div className="zc-dropdown" style={{ display: isEmploymentDropdownOpen ? 'block' : 'none' }}>
                        <div className="dropdown-options">
                            {employmentOptions.map(({ label, value }) => (
                                <label className="option" key={value}>
                                    <input
                                        type="checkbox"
                                        checked={data.employment_types.includes(value)}
                                        onChange={() => toggleFilter('employment_types', value)}
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Industry Dropdown */}
                <div ref={industryRef} className="zc-field-wrap zc-dropdown-field position-relative mb-2">
                    <label htmlFor="search_by_industry">Industry</label>
                    <input
                        type="text"
                        id="search_by_industry"
                        className="dropdown-toggle"
                        readOnly
                        value={data.industries.length ? `${data.industries.length} selected` : ''}
                        onClick={() => {
                            setIsIndustryDropdownOpen((prev) => !prev);
                            setIsEmploymentDropdownOpen(false);
                            setIndustrySearch('');
                        }}
                    />
                    <div className="zc-dropdown" style={{ display: isIndustryDropdownOpen ? 'block' : 'none' }}>
                        <input
                            type="text"
                            className="zc-dropdown-search"
                            placeholder="Search industries..."
                            value={industrySearch}
                            onChange={(e) => setIndustrySearch(e.target.value)}
                        />
                        <div className="dropdown-options">
                            {filteredIndustries.length === 0 ? (
                                <div className="option py-2 text-center">No industries found</div>
                            ) : (
                                filteredIndustries.map((industry) => (
                                    <label className="option" key={industry.id}>
                                        <input
                                            type="checkbox"
                                            checked={data.industries.includes(industry.id.toString())}
                                            onChange={() => toggleFilter('industries', industry.id.toString())}
                                        />
                                        {industry.name}
                                    </label>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobFilters;
