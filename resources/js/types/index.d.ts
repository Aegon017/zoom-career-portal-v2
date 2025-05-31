import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
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
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    password?: string,
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Company {
    id: number;
    profile_image: string;
    company_name: string;
    company_logo: string;
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
    [key: string]: unknown;
}

interface NotificationData {
    type: string;
    title: string;
    message: string;
    link: string;
}

export interface Notification {
    id: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
}

export interface Skill {
    id: number,
    name: string
}

export interface JobPosting {
    id: number;
    company_id: number;
    employer_id: number;
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
    moderation_status: string;
    created_at: string;
    updated_at: string;
    skills: Skill[];
    company: Company
}

