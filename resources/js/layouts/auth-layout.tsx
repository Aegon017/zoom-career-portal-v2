import AuthLayoutTemplate from '@/layouts/auth/auth-split-layout';

export default function AuthLayout( { children, title, description, instruction, ...props }: { children: React.ReactNode; title: string; description: string, instruction?: string } ) {
    return (
        <AuthLayoutTemplate title={ title } description={ description } instruction={ instruction } { ...props }>
            { children }
        </AuthLayoutTemplate>
    );
}
