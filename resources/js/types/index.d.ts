import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    isEmployerVerified: boolean;
    roles: string[];
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: {
        title: string;
        href: string;
    }[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    features: {
        people_feature: boolean;
    };
    sidebarOpen: boolean;
    [ key: string ]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
    banner_url?: string;
    password?: string;
    followers: User[];
    followingUsers: User[];
    followingCompanies: Company[];
    email_verified_at: string | null;
    work_experiences: WorkExperience[];
    careerInterest: CareerInterest;
    personal_detail: PersonalDetail;
    work_permits: workPermit[];
    address: Address;
    profile?: Profile;
    user_languages?: UserLanguage[];
    certificates: Certificate[];
    educations: Education[];
    skills?: Skill[];
    created_at: string;
    updated_at: string;
    [ key: string ]: unknown;
}

export interface PersonalDetail {
    user_id: number;
    gender: string;
    date_of_birth: Date;
    marital_status: string;
    differently_abled: boolean;
    user?: User;
}

export interface WorkPermit {
    user_id: number;
    country: string;
    user?: User;
}
export interface CareerInterest {
    preferred_positions?: string[];
    post_graduation_plans?: string[];
    zoom_support_preferences?: string[];
    desired_jobs?: string[];
    preferred_locations?: string[];
    target_industries?: string[];
    job_function_interests?: string[];
    graduation_month?: string;
    graduation_year?: string;
    employment_types?: string[];
}

export interface JobTitle {
    id: number;
    name: string;
}

export interface SavedJob {
    id: number;
    opening_id: number;
    user_id: number;
    opening: Opening;
    created_at: string;
    updated_at: string;
}

export interface Company {
    id: number;
    name: string;
    logo_url: string;
    banner_url: string;
    industry_id: number | null;
    website_url: string;
    description: string;
    email: string;
    phone: string;
    size: string;
    type: string;
    verification_status: string;
    users: User[];
    industry: Industry;
    address: Address;
    openings: Opening[];
    is_followed: boolean;
    created_at: string;
    updated_at: string;
    [ key: string ]: unknown;
}

export interface CompanyUser {
    id: number;
    user_id: number;
    company_id: number;
    verified_at: string | null;
    verification_status: string;
    role: string;
    created_at: string | null;
    updated_at: string | null;
}

export interface Profile {
    id: number;
    user_id: number;
    user: User;
    job_title: string;
    experience: string;
    notice_period: string;
    summary: string;
    created_at: string;
    updated_at: string;
}

export interface Address {
    id: number;
    user_id: number;
    location_id: number;
    user: User;
    location: Location;
}

interface AppNotificationData {
    message: string;
    employer_name: string;
    name: string;
    registered_at: string;
    url: string;
    type: 'new_employer' | string;
}

export interface AppNotification {
    id: string;
    data: AppNotificationData;
    read_at: string | null;
    created_at: string;
}

export interface Skill {
    id: number;
    name: string;
}

export interface Opening {
    id: number;
    user_id: number;
    industry_id: number;
    title: string;
    employment_type: string;
    work_model: string;
    description: string;
    salary_min: number;
    salary_max: number;
    salary_unit: string;
    currency: string;
    published_at: string;
    expires_at: Date;
    apply_link?: string;
    status: string;
    verification_status: string;
    created_at: string;
    updated_at: string;
    user: User;
    skills: Skill[];
    company: Company;
    address: Address;
    industry: Industry;
    is_saved: boolean;
    has_applied: boolean;
    application_status: string;
    application_created_at: string;
}

export interface Application {
    id: number;
    user: User;
    opening: Opening;
    created_at: string;
    updated_at: string;
    resume_id?: number;
    resume: Resume;
    cover_letter: string;
    status: string;
    match_score: number;
    match_summary: string;
}

export interface Resume {
    id: number;
    user_id: number;
    resume_text?: string | null;
    resume_url?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Education {
    id?: number;
    course_title: string;
    institution: string;
    start_date: Date | null;
    end_date?: Date | null;
    is_current: boolean;
    course_type: string;
    created_at?: string;
    updated_at?: string;
}

interface OpeningTItle {
    id: number;
    name: string;
}

interface TalentProfile {
    id: number;
    name: string;
}

export interface Message {
    id: number;
    chat_id: number;
    user_id: number;
    message: string;
    sent_at: Date;
    created_at: string;
    user: User;
}

export interface ChatParticipant {
    id: number;
    chat_id: number;
    user_id: number;
    last_read_at: string | null;
    user: User;
}

export interface Chat {
    id: number;
    created_at: string;
    updated_at: string;
    participants: ChatParticipant[];
    messages: Message[];
}

export interface WorkExperience {
    id?: number;
    user_id?: number;
    company_id?: number | null;
    company_name: string;
    title: string;
    start_date: Date | null;
    end_date: Date | null;
    is_current: boolean;
    logo_url?: string | null;
    company: Company;
}

export interface JobSeekerProfile {
    user_id: number;
    location: string;
    experience: string | null;
    notice_period: string;
    summary: string;
    gender: 'male' | 'female' | 'other';
    date_of_birth: string;
    address: string;
    marital_status: 'single' | 'married' | 'divorced' | 'widowed';
    work_permit: string;
    differently_abled: boolean;
    created_at: string;
    updated_at: string | null;
}

export interface Industry {
    id: number;
    name: string;
    jobs: Opening[];
}

export interface JobFunction {
    id: number;
    name: string;
}

export interface JobType {
    id: number;
    name: string;
}

export interface Location {
    id: number;
    country: string;
    state: string;
    city: string;
    full_name: string;
}

export interface Setting {
    id: number;
    name: string;
    status: boolean;
}

export interface Option {
    value: string;
    label: string;
    disable?: boolean;
    fixed?: boolean;
    [ key: string ]: string | boolean | undefined;
}

export interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

export interface Permission {
    id: number;
    name: string;
}

export interface Language {
    id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
}

export interface UserLanguage {
    id?: number;
    language: {
        id?: number;
        name: string;
        code?: string;
    };
    proficiency: string;
    can_read: boolean;
    can_write: boolean;
    can_speak: boolean;
}

export interface Certificate {
    id?: number;
    user_id?: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

export interface Feedback {
    id: number;
    feedback: string;
    hired_details: string;
    selected_candidates: {
        value: number | string;
        label: string;
    }[];
    additional_comments: string;
    created_at: string;
    user: {
        name: string;
        email: string;
    };
    opening: {
        id: number;
        title: string;
    };
}

