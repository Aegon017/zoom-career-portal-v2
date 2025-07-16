import { useForm, usePage, router, Head } from '@inertiajs/react';
import CompanyItem from '@/components/company-item';
import FilterIcon from '@/icons/filter-icon';
import JobseekerLayout from '@/layouts/jobseeker-layout';
import { useEffect, useRef, useState, useCallback } from 'react';

const Employers = () => {
    const { companies: initialCompanies = { data: [], next_page_url: null }, filters = {} } = usePage().props as any;
    const [ companies, setCompanies ] = useState( initialCompanies.data );
    const [ nextPageUrl, setNextPageUrl ] = useState( initialCompanies.next_page_url );
    const [ loading, setLoading ] = useState( false );
    const [ activeDropdown, setActiveDropdown ] = useState<'industries' | 'locations' | 'sizes' | null>( null );
    const dropdownRef = useRef<HTMLDivElement>( null );

    const getValueByPath = ( obj: any, path: string ): any => {
        return path.split( '.' ).reduce( ( acc, part ) => acc?.[ part ], obj );
    };

    const getUniqueValues = useCallback( ( keyPath: string ): string[] => {
        if ( !companies.length ) return [];

        const values = companies
            .map( ( company: any ) => getValueByPath( company, keyPath ) )
            .flat()
            .filter( Boolean );
        return Array.from( new Set( values ) as Set<string> ).sort( ( a, b ) => {
            const rangeRegex = /^(\d+)\s*-\s*(\d+)$/;
            const aMatch = a.match( rangeRegex );
            const bMatch = b.match( rangeRegex );

            if ( aMatch && bMatch ) {
                const aLow = Number( aMatch[ 1 ] ), aHigh = Number( aMatch[ 2 ] );
                const bLow = Number( bMatch[ 1 ] ), bHigh = Number( bMatch[ 2 ] );
                if ( aLow !== bLow ) return aLow - bLow;
                return aHigh - bHigh;
            }
            const aNum = Number( a ), bNum = Number( b );
            const aIsNum = !isNaN( aNum ) && a.trim() !== '', bIsNum = !isNaN( bNum ) && b.trim() !== '';
            if ( aIsNum && bIsNum ) return aNum - bNum;
            if ( aIsNum && !bIsNum ) return -1;
            if ( !aIsNum && bIsNum ) return 1;
            return a.toLowerCase().localeCompare( b.toLowerCase() );
        } );
    }, [ companies ] );

    const { data, setData } = useForm( {
        keyword: filters.keyword || '',
        industries: filters.industries || [],
        locations: filters.locations || [],
        sizes: filters.sizes || [],
        followed: String( filters.followed ) === 'true',
    } );

    const applyFilters = useCallback( () => {
        router.get( '/jobseeker/employers', data, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: [ 'companies', 'filters' ],
            onSuccess: ( page ) => {
                const companies = page.props.companies as { data: any[]; next_page_url: string | null };
                setCompanies( companies.data );
                setNextPageUrl( companies.next_page_url );
                setActiveDropdown( null );
            },
        } );
    }, [ data ] );

    useEffect( () => {
        const timeout = setTimeout( applyFilters, 500 );
        return () => clearTimeout( timeout );
    }, [ data.keyword, applyFilters ] );

    useEffect( () => {
        applyFilters();
    }, [ data.industries, data.locations, data.sizes, data.followed, applyFilters ] );

    useEffect( () => {
        const handler = ( e: MouseEvent ) => {
            if ( dropdownRef.current && !dropdownRef.current.contains( e.target as Node ) ) {
                setActiveDropdown( null );
            }
        };
        document.addEventListener( 'mousedown', handler );
        return () => document.removeEventListener( 'mousedown', handler );
    }, [] );

    const toggleArray = ( field: 'industries' | 'locations' | 'sizes', value: string ) => {
        const updated = data[ field ].includes( value )
            ? data[ field ].filter( ( v: string ) => v !== value )
            : [ ...data[ field ], value ];
        setData( field, updated );
    };

    const renderMultiSelect = ( label: string, field: 'industries' | 'locations' | 'sizes', items: string[] ) => {
        const [ searchTerm, setSearchTerm ] = useState( '' );

        const filteredItems = items.filter( item =>
            item.toLowerCase().includes( searchTerm.toLowerCase() )
        );

        return (
            <div className="zc-accordion-item">
                <div className="zc-accordion-header active">
                    <h3>{ label }</h3>
                    <i className="fa-solid fa-angle-down"></i>
                </div>
                <div className="zc-accordion-content">
                    <div className="zc-filter-search-dropdown position-relative" ref={ field === activeDropdown ? dropdownRef : null }>
                        { data[ field ].length > 0 && (
                            <div className="selected-items">
                                { data[ field ].map( ( item: string ) => (
                                    <div className="tag" key={ item } data-value={ item }>
                                        { item }
                                        <i
                                            className="fa-solid fa-xmark"
                                            style={ { cursor: 'pointer', marginLeft: 4 } }
                                            onClick={ () => setData( field, data[ field ].filter( ( i: string ) => i !== item ) ) }
                                        />
                                    </div>
                                ) ) }
                            </div>
                        ) }
                        <div className="search-field d-block w-100 position-relative">
                            <input
                                type="text"
                                placeholder={ `Search ${ label }` }
                                autoComplete="off"
                                value={ searchTerm }
                                onChange={ ( e ) => setSearchTerm( e.target.value ) }
                                onClick={ () => setActiveDropdown( activeDropdown === field ? null : field ) }
                            />
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <div className={ `filter-dropdown-wrapper${ activeDropdown === field ? ' active' : '' }` }>
                            <ul className="search-list">
                                { filteredItems.map( ( item ) => (
                                    <li
                                        key={ item }
                                        data-value={ item }
                                        className={ data[ field ].includes( item ) ? 'selected' : '' }
                                        onClick={ () => toggleArray( field, item ) }
                                    >
                                        { item }
                                    </li>
                                ) ) }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const loadMore = useCallback( () => {
        if ( !nextPageUrl || loading ) return;
        setLoading( true );
        router.get( nextPageUrl, {}, {
            preserveScroll: true,
            preserveState: true,
            only: [ 'companies' ],
            onSuccess: ( page ) => {
                const companies = page.props.companies as { data: any[]; next_page_url: string | null };
                setCompanies( ( prev: any[] ) => [ ...prev, ...companies.data ] );
                setNextPageUrl( companies.next_page_url );
                setLoading( false );
            },
        } );
    }, [ nextPageUrl, loading ] );

    // Calculate unique values once at the component level
    const uniqueIndustries = getUniqueValues( 'industry.name' );
    const uniqueLocations = getUniqueValues( 'address.location.city' );
    const uniqueSizes = getUniqueValues( 'size' );

    return (
        <JobseekerLayout>
            <Head title="Employers" />
            <div className="zc-container">
                <div className="page-title mb-3">
                    <h2>Employers</h2>
                    <p>Search and connect with Employer using Zoom's advanced search.</p>
                </div>
                <div className="zc-employer-list-wrapper">
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-12" >
                            <div className="zc-search-wrapper mb-3">
                                <input
                                    type="text"
                                    className="w-100"
                                    placeholder="Search by keyword"
                                    value={ data.keyword }
                                    onChange={ ( e ) => setData( 'keyword', e.target.value ) }
                                />
                            </div>
                            <div className="zc-filter-wrapper">
                                <div className="filter-header">
                                    <FilterIcon />
                                    <span className="text">Filters</span>
                                </div>
                                <div className="filter-content">
                                    <div className="zc-filter-accordion">
                                        <div className="zc-accordion-item">
                                            <div className="zc-accordion-header active">
                                                <h3>Activity</h3>
                                                <i className="fa-solid fa-angle-down"></i>
                                            </div>
                                            <div className="zc-accordion-content">
                                                <div className="zc-field check-box-field">
                                                    <input
                                                        type="checkbox"
                                                        id="followed-employers"
                                                        checked={ data.followed }
                                                        onChange={ ( e ) => setData( 'followed', e.target.checked ) }
                                                    />
                                                    <label htmlFor="followed-employers">Employers You Follow</label>
                                                </div>
                                            </div>
                                        </div>
                                        { renderMultiSelect( 'Industry', 'industries', uniqueIndustries ) }
                                        { renderMultiSelect( 'Location', 'locations', uniqueLocations ) }
                                        { renderMultiSelect( 'Employer Size', 'sizes', uniqueSizes ) }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-8 col-md-8 col-sm-12">
                            <div className="zc-employer-list">
                                { companies.length === 0 ? (
                                    <div className="text-center py-5 bg-white rounded-md shadow-md">
                                        <p>No employers found, Try again later.</p>
                                    </div>
                                ) : (
                                    <>
                                        { companies.map( ( company: any ) => (
                                            <CompanyItem key={ company.id } company={ company } />
                                        ) ) }
                                        { nextPageUrl && (
                                            <div className="load-more-wrapper text-center">
                                                <button onClick={ loadMore } disabled={ loading }>
                                                    { loading ? 'Loading...' : 'Load More' }
                                                </button>
                                            </div>
                                        ) }
                                    </>
                                ) }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </JobseekerLayout>
    );
};

export default Employers;