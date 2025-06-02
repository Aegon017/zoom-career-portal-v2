import { usePage } from '@inertiajs/react';

export default function useRoles() {
    const { auth } = usePage().props as any;
    const roles = auth.roles || [];

    return {
        isEmployer: roles.includes('employer'),
        isJobSeeker: roles.includes('job_seeker'),
        isSuperAdmin: roles.includes('super_admin'),
    };
}
