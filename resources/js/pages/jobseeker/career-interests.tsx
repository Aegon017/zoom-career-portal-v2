import AppLayout from "@/layouts/jobseeker-layout";
import { Head, router } from "@inertiajs/react";
import React, { useState } from "react";

interface CareerInterest {
    preferred_positions?: string[];
    post_graduation_plans?: string[];
    zoom_support_preferences?: string[];
    desired_jobs?: string[];
    preferred_locations?: string[];
    target_industries?: string[];
    job_function_interests?: string[];
    graduation_month?: string;
    graduation_year?: string;
}

interface Props {
    careerInterest: CareerInterest;
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const years = [
    "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"
];

const preferredPositions = [
    "Full Time Job", "Part Time Job", "Internship", "On Campus Job"
];

const postGraduationPlans = [
    "Working", "Graduate School", "Gap Year", "Military Service"
];

const zoomSupportPreferences = [
    "I want a job",
    "I want an internship",
    "I'm interested in grad school",
    "I want to find out about career center events"
];

const desiredJobs = [ "corporate", "freelance", "remote", "part-time", "full-time" ];

const preferredLocations = [ "Hyderabad", "Delhi", "Bangalore" ];

const industries = [
    "Agriculture", "Animal & Wildlife", "Environmental Services", "Farming, Ranching and Fishing", "Forestry",
    "Energy", "Oil & Gas", "Utilities and Renewable Energy",
    "HealthCare", "Social Assistance", "Veterinary",
    "Biotech & Life Sciences", "Medical Devices", "Pharmaceuticals",
    "Architecture and Planning", "Civil Engineering", "Construction",
    "Accounting", "Commercial Banking & Credit", "Financial Services",
    "Hotels & Accommodation", "Restaurants & Food Service", "Tourism",
    "Human Resources", "Management Consulting", "Scientific and Technical Consulting",
    "CPG - Consumer Packaged Goods", "Food & Beverage",
    "Aerospace", "Automotive", "Manufacturing",
    "Retail Stores", "Wholesale Trade",
    "Fashion", "Movies, TV, Music, Gaming",
    "Defense", "Government - Consulting",
    "Advertising, PR & Marketing", "Design",
    "Computer Networking", "Electronic & Computer Hardware",
    "Higher Education", "K-12 Education", "Library Services", "Other Education",
    "NGO", "Non-Profit - Other", "Religious Work",
    "Transportation & Logistics", "Other Industries", "Research"
];

const jobFunctions = [
    "Accounting", "Data & Analytics", "Hotel / Restaurant / Hospitality",
    "Political Organizing / Lobbying", "Actuary", "Design / Art",
    "Human Resources", "Product / Project Management", "Administration"
];

const CareerInterests: React.FC<Props> = ( { careerInterest } ) => {
    const [ form, setForm ] = useState<CareerInterest>( {
        preferred_positions: careerInterest.preferred_positions || [],
        post_graduation_plans: careerInterest.post_graduation_plans || [],
        zoom_support_preferences: careerInterest.zoom_support_preferences || [],
        desired_jobs: careerInterest.desired_jobs || [],
        preferred_locations: careerInterest.preferred_locations || [],
        target_industries: careerInterest.target_industries || [],
        job_function_interests: careerInterest.job_function_interests || [],
        graduation_month: careerInterest.graduation_month || "",
        graduation_year: careerInterest.graduation_year || ""
    } );

    const [ isSubmitting, setIsSubmitting ] = useState( false );

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
        const { name, value, type } = e.target;

        if ( type === "checkbox" ) {
            setForm( ( prev ) => {
                const current = prev[ name as keyof CareerInterest ] as string[] || [];
                return {
                    ...prev,
                    [ name ]: current.includes( value )
                        ? current.filter( ( v ) => v !== value )
                        : [ ...current, value ]
                };
            } );
        } else if ( e.target instanceof HTMLSelectElement && e.target.multiple ) {
            const selected = Array.from( e.target.selectedOptions ).map( ( option ) => option.value );
            setForm( ( prev ) => ( {
                ...prev,
                [ name ]: selected
            } ) );
        } else {
            setForm( ( prev ) => ( {
                ...prev,
                [ name ]: value
            } ) );
        }
    };

    const handleSubmit = async ( e: React.FormEvent ) => {
        e.preventDefault();
        setIsSubmitting( true );
        try {
            await router.post( "/jobseeker/career-interests/update", { ...form } );
        } catch ( error ) {
            console.error( "Submission failed:", error );
        } finally {
            setIsSubmitting( false );
        }
    };

    return (
        <AppLayout>
            <Head title="Career Interests" />
            <div className="zc-main-wrapper py-4">
                <div className="zc-container bg-white px-4 py-4 rounded shadow-sm">
                    <h3 className="mb-2">Zoom Career wants to help you find the career and job that's right for you.</h3>
                    <p className="mb-4">
                        Tell us a little more about yourself and we'll recommend the events, articles, and jobs that match your interests.
                    </p>
                    <hr />
                    <form onSubmit={ handleSubmit }>
                        {/* Preferred Positions */ }
                        <div className="mb-4">
                            <h5>What type of position are you looking for?</h5>
                            { preferredPositions.map( ( pos ) => (
                                <div className="form-check" key={ pos }>
                                    <input
                                        className="form-check-input"
                                        name="preferred_positions"
                                        type="checkbox"
                                        value={ pos }
                                        id={ `pos-${ pos.replace( /[^a-z0-9]/gi, "-" ).toLowerCase() }` }
                                        checked={ form.preferred_positions?.includes( pos ) || false }
                                        onChange={ handleChange }
                                        aria-label={ `Select ${ pos }` }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={ `pos-${ pos.replace( /[^a-z0-9]/gi, "-" ).toLowerCase() }` }
                                    >
                                        { pos }
                                    </label>
                                </div>
                            ) ) }
                        </div>

                        {/* Post Graduation Plans */ }
                        <div className="mb-4">
                            <h5>What options are you considering after graduation?</h5>
                            { postGraduationPlans.map( ( plan ) => (
                                <div className="form-check" key={ plan }>
                                    <input
                                        className="form-check-input"
                                        name="post_graduation_plans"
                                        type="checkbox"
                                        value={ plan }
                                        id={ `plan-${ plan.replace( /[^a-z0-9]/gi, "-" ).toLowerCase() }` }
                                        checked={ form.post_graduation_plans?.includes( plan ) || false }
                                        onChange={ handleChange }
                                        aria-label={ `Select ${ plan }` }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={ `plan-${ plan.replace( /[^a-z0-9]/gi, "-" ).toLowerCase() }` }
                                    >
                                        { plan }
                                    </label>
                                </div>
                            ) ) }
                        </div>

                        {/* Zoom Support Preferences */ }
                        <div className="mb-4">
                            <h5>How can Zoom Career help you?</h5>
                            { zoomSupportPreferences.map( ( pref ) => (
                                <div className="form-check" key={ pref }>
                                    <input
                                        className="form-check-input"
                                        name="zoom_support_preferences"
                                        type="checkbox"
                                        value={ pref }
                                        id={ `pref-${ pref.replace( /[^a-z0-9]/gi, "-" ).toLowerCase() }` }
                                        checked={ form.zoom_support_preferences?.includes( pref ) || false }
                                        onChange={ handleChange }
                                        aria-label={ `Select ${ pref }` }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={ `pref-${ pref.replace( /[^a-z0-9]/gi, "-" ).toLowerCase() }` }
                                    >
                                        { pref }
                                    </label>
                                </div>
                            ) ) }
                        </div>

                        {/* Desired Jobs */ }
                        <div className="mb-4">
                            <h5>What types of jobs are you interested in?</h5>
                            <div className="row gy-2">
                                { desiredJobs.map( ( job ) => (
                                    <div className="col-md-4" key={ job }>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                name="desired_jobs"
                                                type="checkbox"
                                                value={ job }
                                                id={ `jobtype-${ job.replace( /[^a-z0-9]/gi, "-" ).toLowerCase() }` }
                                                checked={ form.desired_jobs?.includes( job ) || false }
                                                onChange={ handleChange }
                                                aria-label={ `Select ${ job }` }
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={ `jobtype-${ job.replace( /[^a-z0-9]/gi, "-" ).toLowerCase() }` }
                                            >
                                                { job.charAt( 0 ).toUpperCase() + job.slice( 1 ).replace( "-", " " ) }
                                            </label>
                                        </div>
                                    </div>
                                ) ) }
                            </div>
                        </div>

                        {/* Preferred Locations */ }
                        <div className="mb-4">
                            <h5>Where are you interested in living?</h5>
                            <div className="row gy-2">
                                { preferredLocations.map( ( loc ) => (
                                    <div className="col-md-4" key={ loc }>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                name="preferred_locations"
                                                type="checkbox"
                                                value={ loc }
                                                id={ `location-${ loc.replace( /[^a-z0-9]/gi, "-" ).toLowerCase() }` }
                                                checked={ form.preferred_locations?.includes( loc ) || false }
                                                onChange={ handleChange }
                                                aria-label={ `Select ${ loc }` }
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={ `location-${ loc.replace( /[^a-z0-9]/gi, "-" ).toLowerCase() }` }
                                            >
                                                { loc }
                                            </label>
                                        </div>
                                    </div>
                                ) ) }
                            </div>
                        </div>

                        {/* Target Industries */ }
                        <div className="mb-4">
                            <h5>Which industries are you interested in?</h5>
                            <div className="row gy-2">
                                { industries.map( ( ind ) => (
                                    <div className="col-md-4" key={ ind }>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                name="target_industries"
                                                type="checkbox"
                                                value={ ind }
                                                id={ `industry-${ ind.replace( /[^a-z0-9]/gi, "-" ).toLowerCase() }` }
                                                checked={ form.target_industries?.includes( ind ) || false }
                                                onChange={ handleChange }
                                                aria-label={ `Select ${ ind }` }
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={ `industry-${ ind.replace( /[^a-z0-9]/gi, "-" ).toLowerCase() }` }
                                            >
                                                { ind }
                                            </label>
                                        </div>
                                    </div>
                                ) ) }
                            </div>
                        </div>

                        {/* Job Function Interests */ }
                        <div className="mb-4">
                            <h5>Which kinds of job functions interest you?</h5>
                            <div className="row gy-2">
                                { jobFunctions.map( ( func ) => (
                                    <div className="col-md-4" key={ func }>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                name="job_function_interests"
                                                type="checkbox"
                                                value={ func }
                                                id={ `job-${ func.replace( /[^a-z0-9]/gi, "-" ).toLowerCase() }` }
                                                checked={ form.job_function_interests?.includes( func ) || false }
                                                onChange={ handleChange }
                                                aria-label={ `Select ${ func }` }
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={ `job-${ func.replace( /[^a-z0-9]/gi, "-" ).toLowerCase() }` }
                                            >
                                                { func }
                                            </label>
                                        </div>
                                    </div>
                                ) ) }
                            </div>
                        </div>

                        {/* Graduation Month & Year */ }
                        <div className="mb-4">
                            <h5>When did you graduate?</h5>
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <label htmlFor="gradMonth" className="form-label">
                                        Graduation Month
                                    </label>
                                    <select
                                        className="form-select"
                                        id="gradMonth"
                                        name="graduation_month"
                                        value={ form.graduation_month || "" }
                                        onChange={ handleChange }
                                        aria-label="Select graduation month"
                                    >
                                        <option value="" disabled>
                                            Select Month
                                        </option>
                                        { months.map( ( month ) => (
                                            <option key={ month } value={ month }>
                                                { month }
                                            </option>
                                        ) ) }
                                    </select>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label htmlFor="gradYear" className="form-label">
                                        Graduation Year
                                    </label>
                                    <select
                                        className="form-select"
                                        id="gradYear"
                                        name="graduation_year"
                                        value={ form.graduation_year || "" }
                                        onChange={ handleChange }
                                        aria-label="Select graduation year"
                                    >
                                        <option value="" disabled>
                                            Select Year
                                        </option>
                                        { years.map( ( year ) => (
                                            <option key={ year } value={ year }>
                                                { year }
                                            </option>
                                        ) ) }
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="text-end mt-3">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={ isSubmitting }
                                aria-label="Submit career interests"
                            >
                                { isSubmitting ? "Submitting..." : "Submit" }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default CareerInterests;