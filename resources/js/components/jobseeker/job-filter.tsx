import { Option } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function useDebounce<T>( value: T, delay: number ): T {
    const [ debouncedValue, setDebouncedValue ] = useState( value );

    useEffect( () => {
        const handler = setTimeout( () => setDebouncedValue( value ), delay );
        return () => clearTimeout( handler );
    }, [ value, delay ] );

    return debouncedValue;
}

type JobFiltersProps = {
    filters: any;
    employmentOptions: Option[];
    industries: Array<{ id: number; name: string }>;
    companies: Array<{ id: number; name: string }>;
    locations: Array<{ id: number; full_name: string }>;
};

const JobFilters = ( { filters, employmentOptions, industries, companies, locations }: JobFiltersProps ) => {
    const [ isIndustryDropdownOpen, setIsIndustryDropdownOpen ] = useState( false );
    const [ isEmploymentDropdownOpen, setIsEmploymentDropdownOpen ] = useState( false );
    const [ isCompanyDropdownOpen, setIsCompanyDropdownOpen ] = useState( false ); // Added company dropdown state
    const [ industrySearch, setIndustrySearch ] = useState( '' );
    const [ companySearch, setCompanySearch ] = useState( '' );
    const [ isLocationDropdownOpen, setIsLocationDropdownOpen ] = useState( false );
    const [ locationSearch, setLocationSearch ] = useState( '' );
    const locationRef = useRef<HTMLDivElement>( null );

    const industryRef = useRef<HTMLDivElement>( null );
    const employmentRef = useRef<HTMLDivElement>( null );
    const companyRef = useRef<HTMLDivElement>( null ); // Added company dropdown ref

    const { data, setData } = useForm( {
        company: filters?.company || '',
        job_title: filters?.job_title || '',
        employment_types: filters?.employment_types || [],
        industries: filters?.industries || [],
        selected_companies: filters?.selected_companies || [],
        locations: filters?.locations || [],
    } );

    const debouncedCompany = useDebounce( data.company, 500 );
    const debouncedJobTitle = useDebounce( data.job_title, 500 );

    // Filter industries and companies based on search
    const filteredIndustries = industries.filter( ( industry ) =>
        industry.name.toLowerCase().includes( industrySearch.toLowerCase() )
    );
    const filteredCompanies = companies.filter( ( company ) =>
        company.name.toLowerCase().includes( companySearch.toLowerCase() )
    );

    // Single optimized effect for all filters
    useEffect( () => {
        const params = {
            company: data.selected_companies.length > 0 ? '' : debouncedCompany, // Use manual input only if no companies are selected
            selected_companies: data.selected_companies,
            job_title: debouncedJobTitle,
            employment_types: data.employment_types,
            industries: data.industries,
            locations: data.locations,
        };

        router.get( '/jobseeker/jobs', params, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            only: [ 'initialJobs', 'filters' ],
        } );
    }, [ debouncedCompany, debouncedJobTitle, data.employment_types, data.industries, data.selected_companies ] );

    const toggleFilter = ( field: 'employment_types' | 'industries' | 'selected_companies' | 'locations', value: string ) => {
        const current = data[ field ];
        const updated = current.includes( value )
            ? current.filter( ( v: string ) => v !== value )
            : [ ...current, value ];

        setData( field, updated );

        // Clear manual company input if companies are selected
        if ( field === 'selected_companies' && updated.length > 0 ) {
            setData( 'company', '' );
        }
    };

    const handleClickOutside = ( e: MouseEvent ) => {
        if ( companyRef.current && !companyRef.current.contains( e.target as Node ) ) {
            setIsCompanyDropdownOpen( false );
        }
        if ( employmentRef.current && !employmentRef.current.contains( e.target as Node ) ) {
            setIsEmploymentDropdownOpen( false );
        }
        if ( industryRef.current && !industryRef.current.contains( e.target as Node ) ) {
            setIsIndustryDropdownOpen( false );
        }
        if ( locationRef.current && !locationRef.current.contains( e.target as Node ) ) {
            setIsLocationDropdownOpen( false );
        }
    };

    useEffect( () => {
        document.addEventListener( 'mousedown', handleClickOutside );
        return () => {
            document.removeEventListener( 'mousedown', handleClickOutside );
        };
    }, [] );

    const filteredLocations = locations.filter( location =>
        location.full_name.toLowerCase().includes( locationSearch.toLowerCase() )
    );

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
                {/* Company Dropdown */ }
                <div ref={ companyRef } className="zc-field-wrap zc-dropdown-field position-relative mb-2">
                    <label htmlFor="search_by_company">Company</label>
                    <input
                        type="text"
                        id="search_by_company"
                        className="dropdown-toggle"
                        readOnly
                        value={
                            data.selected_companies.length
                                ? `${ data.selected_companies.length } selected`
                                : data.company || ''
                        }
                        onClick={ () => {
                            setIsCompanyDropdownOpen( ( prev ) => !prev );
                            setIsEmploymentDropdownOpen( false );
                            setIsIndustryDropdownOpen( false );
                            setCompanySearch( '' );
                        } }
                    />
                    <div className="zc-dropdown" style={ { display: isCompanyDropdownOpen ? 'block' : 'none' } }>
                        <input
                            type="text"
                            className="zc-dropdown-search"
                            placeholder="Search companies..."
                            value={ companySearch }
                            onChange={ ( e ) => setCompanySearch( e.target.value ) }
                        />
                        <div className="dropdown-options">
                            { filteredCompanies.length === 0 ? (
                                <div className="option py-2 text-center">No companies found</div>
                            ) : (
                                filteredCompanies.map( ( company ) => (
                                    <label className="option" key={ company.id }>
                                        <input
                                            type="checkbox"
                                            checked={ data.selected_companies.includes( company.id.toString() ) }
                                            onChange={ () => toggleFilter( 'selected_companies', company.id.toString() ) }
                                        />
                                        { company.name }
                                    </label>
                                ) )
                            ) }
                        </div>
                    </div>
                </div>

                {/* Job Title */ }
                <div className="zc-field-wrap mb-2">
                    <label htmlFor="search_by_jobtitle">Job Title</label>
                    <input
                        type="text"
                        name="search_by_jobtitle"
                        id="search_by_jobtitle"
                        className="form-control"
                        value={ data.job_title }
                        onChange={ ( e ) => setData( 'job_title', e.target.value ) }
                    />
                </div>

                {/* Employment Type Dropdown */ }
                <div ref={ employmentRef } className="zc-field-wrap zc-dropdown-field position-relative mb-2">
                    <label htmlFor="search_by_emptype">Employment Type</label>
                    <input
                        type="text"
                        id="search_by_emptype"
                        className="dropdown-toggle"
                        readOnly
                        value={ data.employment_types.length ? `${ data.employment_types.length } selected` : '' }
                        onClick={ () => {
                            setIsEmploymentDropdownOpen( ( prev ) => !prev );
                            setIsCompanyDropdownOpen( false );
                            setIsIndustryDropdownOpen( false );
                        } }
                    />
                    <div className="zc-dropdown" style={ { display: isEmploymentDropdownOpen ? 'block' : 'none' } }>
                        <div className="dropdown-options">
                            { employmentOptions.map( ( { label, value } ) => (
                                <label className="option" key={ value }>
                                    <input
                                        type="checkbox"
                                        checked={ data.employment_types.includes( value ) }
                                        onChange={ () => toggleFilter( 'employment_types', value ) }
                                    />
                                    { label }
                                </label>
                            ) ) }
                        </div>
                    </div>
                </div>

                {/* Industry Dropdown */ }
                <div ref={ industryRef } className="zc-field-wrap zc-dropdown-field position-relative mb-2">
                    <label htmlFor="search_by_industry">Industry</label>
                    <input
                        type="text"
                        id="search_by_industry"
                        className="dropdown-toggle"
                        readOnly
                        value={ data.industries.length ? `${ data.industries.length } selected` : '' }
                        onClick={ () => {
                            setIsIndustryDropdownOpen( ( prev ) => !prev );
                            setIsCompanyDropdownOpen( false );
                            setIsEmploymentDropdownOpen( false );
                            setIndustrySearch( '' );
                        } }
                    />
                    <div className="zc-dropdown" style={ { display: isIndustryDropdownOpen ? 'block' : 'none' } }>
                        <input
                            type="text"
                            className="zc-dropdown-search"
                            placeholder="Search industries..."
                            value={ industrySearch }
                            onChange={ ( e ) => setIndustrySearch( e.target.value ) }
                        />
                        <div className="dropdown-options">
                            { filteredIndustries.length === 0 ? (
                                <div className="option py-2 text-center">No industries found</div>
                            ) : (
                                filteredIndustries.map( ( industry ) => (
                                    <label className="option" key={ industry.id }>
                                        <input
                                            type="checkbox"
                                            checked={ data.industries.includes( industry.id.toString() ) }
                                            onChange={ () => toggleFilter( 'industries', industry.id.toString() ) }
                                        />
                                        { industry.name }
                                    </label>
                                ) )
                            ) }
                        </div>
                    </div>
                </div>
                <div ref={ locationRef } className="zc-field-wrap zc-dropdown-field position-relative mb-2">
                    <label htmlFor="search_by_location">Location</label>
                    <input
                        type="text"
                        id="search_by_location"
                        className="dropdown-toggle"
                        readOnly
                        value={ data.locations.length ? `${ data.locations.length } selected` : '' }
                        onClick={ () => {
                            setIsLocationDropdownOpen( prev => !prev );
                            // Close other dropdowns
                            setIsCompanyDropdownOpen( false );
                            setIsEmploymentDropdownOpen( false );
                            setIsIndustryDropdownOpen( false );
                            setLocationSearch( '' );
                        } }
                    />
                    <div className="zc-dropdown" style={ { display: isLocationDropdownOpen ? 'block' : 'none' } }>
                        <input
                            type="text"
                            className="zc-dropdown-search"
                            placeholder="Search locations..."
                            value={ locationSearch }
                            onChange={ e => setLocationSearch( e.target.value ) }
                        />
                        <div className="dropdown-options">
                            { filteredLocations.length === 0 ? (
                                <div className="option py-2 text-center">No locations found</div>
                            ) : (
                                filteredLocations.map( location => (
                                    <label className="option" key={ location.id }>
                                        <input
                                            type="checkbox"
                                            checked={ data.locations.includes( location.id.toString() ) }
                                            onChange={ () => toggleFilter( 'locations', location.id.toString() ) }
                                        />
                                        { location.full_name }
                                    </label>
                                ) )
                            ) }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobFilters;