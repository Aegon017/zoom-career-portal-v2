import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";

const DeleteAlert = ({
	alertOpen,
	setAlertOpen,
	onDelete,
}: {
	alertOpen: any;
	setAlertOpen: any;
	onDelete: any;
}) => {
	return (
		<AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the
						record from server.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						className="cursor-pointer"
						onClick={() => setAlertOpen(false)}
					>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						className="cursor-pointer bg-red-600 hover:bg-red-500 dark:hover:bg-red-700"
						onClick={() => {
							setAlertOpen(false);
							onDelete();
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteAlert;
