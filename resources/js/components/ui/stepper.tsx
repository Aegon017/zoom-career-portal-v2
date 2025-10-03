import { cn } from "@/lib/utils";

interface StepperProps {
	steps: { label: string; key: string }[];
	currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
	return (
		<div className="flex items-center justify-between w-full max-w-full overflow-x-auto py-2 px-1 sticky top-0 bg-background z-10 gap-2">
			{steps.map((step, idx) => (
				<span
					key={step.key}
					className={cn(
						"text-xs sm:text-sm truncate max-w-[90px] cursor-help transition-colors",
						idx === currentStep
							? "text-primary font-semibold"
							: "text-muted-foreground",
					)}
					title={step.label}
				>
					{step.label}
				</span>
			))}
		</div>
	);
}
