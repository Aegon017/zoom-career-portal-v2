import AuthLayoutTemplate from "@/layouts/auth/auth-card-layout";

export default function AuthAdminLayout({
	children,
	title,
	description,
	instruction,
	...props
}: {
	children: React.ReactNode;
	title: string;
	description: string;
	instruction?: string;
}) {
	return (
		<AuthLayoutTemplate title={title} description={description} {...props}>
			{children}
		</AuthLayoutTemplate>
	);
}
