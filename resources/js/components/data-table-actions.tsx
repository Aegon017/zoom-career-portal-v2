import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DeleteAlert from "./delete-alert";

interface Props {
	hasShow?: boolean;
	hasDuplicate?: boolean;
	onShow?: () => void;
	onEdit: () => void;
	onDelete: () => void;
	onDuplicate?: () => void;
}

const DataTableActions = ({
	onShow,
	onEdit,
	onDelete,
	onDuplicate,
	hasShow = false,
	hasDuplicate = false,
}: Props) => {
	const [alertOpen, setAlertOpen] = useState<boolean>(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{hasDuplicate && (
						<DropdownMenuItem
							className="mb-1 cursor-pointer px-4 py-2"
							onClick={() => onDuplicate?.()}
						>
							Duplicate
						</DropdownMenuItem>
					)}
					{hasShow && (
						<DropdownMenuItem
							className="mb-1 cursor-pointer px-4 py-2"
							onClick={() => (onShow ? onShow() : null)}
						>
							Show
						</DropdownMenuItem>
					)}
					<DropdownMenuItem
						className="mb-1 cursor-pointer px-4 py-2"
						onClick={() => onEdit()}
					>
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem className="p-0">
						<Button
							variant="destructive"
							className="w-full justify-start"
							onClick={() => setTimeout(() => setAlertOpen(true), 0)}
						>
							Delete
						</Button>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<DeleteAlert
				alertOpen={alertOpen}
				setAlertOpen={setAlertOpen}
				onDelete={onDelete}
			/>
		</>
	);
};

export default DataTableActions;
