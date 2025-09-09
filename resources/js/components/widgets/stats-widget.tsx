import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "@inertiajs/react";

interface StatsWidgetProps {
	icon: LucideIcon;
	title: string;
	stat: number | string;
	description: string;
	bgColor: string;
	textColor: string;
	href?: string;
}

const StatsWidget = ({
	icon: Icon,
	title,
	stat,
	description,
	bgColor,
	textColor,
	href,
}: StatsWidgetProps) => {
	const content = (
		<Card className="relative overflow-hidden w-full h-full cursor-pointer">
			<CardHeader className="flex flex-row items-center gap-2 pb-2">
				<Icon className="h-5 w-5 text-muted-foreground" />
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
			</CardHeader>

			<CardContent>
				<div className={`text-4xl font-bold ${textColor}`}>{stat}</div>
				<CardDescription>{description}</CardDescription>
			</CardContent>

			<div className={`absolute bottom-0 left-0 right-0 h-1 ${bgColor}`} />
		</Card>
	);

	if (href) {
		return (
			<Link href={href} className="block">
				{content}
			</Link>
		);
	}

	return content;
};

export default StatsWidget;
