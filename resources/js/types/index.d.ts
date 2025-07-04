import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    isEmployerVerified: boolean;
    roles: string[];
}

export interface PaginatedData<T> {
    data: T[]
    current_page: number
    from: number | null
    last_page: number
    per_page: number
    to: number | null
    total: number
    links: {
        url: string | null
        label: string
        active: boolean
    }[]
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
    }
    sidebarOpen: boolean;
    [ key: string ]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
    banner_url?: string,
    password?: string,
    followers: User[],
    followingUsers: User[],
    followingCompanies: Company[],
    email_verified_at: string | null;
    work_experiences: WorkExperience[];
    careerInterest: CareerInterest;
    address: Address;
    profile?: Profile;
    skills?: Skill[];
    created_at: string;
    updated_at: string;
    [ key: string ]: unknown;
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
    id: number,
    name: string
}

export interface Opening {
    id: number;
    id: number;
    user_id: number;
    title: string;
    employment_type: string;
    work_model: string;
    description: string;
    salary_min: number;
    salary_max: number;
    salary_unit: string;
    currency: string;
    city: string | null;
    state: string | null;
    country: string | null;
    published_at: string;
    expires_at: Date;
    apply_link?: string;
    status: string;
    verification_status: string;
    created_at: string;
    updated_at: string;
    skills: Skill[];
    company: Company;
    is_saved: boolean;
    has_applied: boolean;
    application_status: string;
    application_created_at: string;
}

interface Application {
    id: number;
    opening_id: number;
    user_id: number;
    status: string;
    cover_letter: string;
    resume_url: string;
    user: User;
    created_at: string;
    updated_at: string;
}

interface Education {
    id: number;
    user_id: number;
    school_name: string;
    graduation_year: number;
}

interface OpeningTItle {
    id: number,
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
    id: number;
    user_id?: number;
    id?: number;
    name: string;
    title: string;
    start_date: string;
    end_date: string;
    is_current?: boolean;
    logo?: string;
    created_at?: string;
    updated_at?: string;
    company: Company;
}

export interface ApplicationStatus {
    value: string;
    label: string;
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
    created_at: string,
    updated_at: string | null
}

export interface Industry {
    id: number;
    name: string;
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
}

export interface Setting {
    id: number;
    name: string;
    status: boolean;
}

export interface Option {
    value: string;
    label: string;
}

export interface Role {
    id: number,
    name: string,
    permissions: Permission[]
}

export interface Permission {
    id: number,
    name: string
}
