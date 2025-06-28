import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    isEmployerVerified: boolean;
    roles: string[];
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
    avatar?: string;
    password?: string,
    headline?: string,
    pronouns?: string,
    location?: string,
    profile_image?: string,
    banner?: string,
    followers: User[],
    followingUsers: User[],
    followingCompanies: Company[],
    email_verified_at: string | null;
    work_experiences: WorkExperience[];
    skills?: Skill[];
    created_at: string;
    updated_at: string;
    [ key: string ]: unknown;
}

export interface Company {
    id: number;
    company_name: string;
    company_logo: string;
    banner: string;
    industry: string;
    company_website: string;
    company_description: string;
    company_address: string;
    public_phone: string;
    public_email: string;
    company_size: string;
    company_type: string;
    created_at: string;
    updated_at: string;
    verification_status: string;
    is_followed: boolean;
    openings: Opening[];
    users: User[];
    followers: number;
    [ key: string ]: unknown;
}

interface AppNotificationData {
    message: string;
    employer_name: string;
    company_name: string;
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
    company_id: number;
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
    resume: string;
    user: User;
    created_at: string;
    updated_at: string;
}

interface Employer {
    id: number;
    user_id: number;
    company_id: number;
    profile_image: string;
    job_title: string;
    types_of_candidates: string[];
    phone: string;
    verification_status: string;
    talent_profiles: TalentProfile[];
    opening_title: OpeningTItle;
    educations: Education[];
}

interface Education {
    id: number;
    employer_id: number;
    jobseeker_id: number;
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

export interface ChatUser {
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
    participants: ChatUser[];
    messages: Message[];
}


export interface WorkExperience {
    id: number;
    user_id?: number;
    company_id?: number;
    company_name: string;
    title: string;
    start_date: string;
    end_date: string;
    is_current?: boolean;
    company_logo?: string;
    created_at?: string;
    updated_at?: string;
    company: Company;
}

export interface Jobseeker {
    id: string;
    name: string;
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
