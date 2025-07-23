import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Company, WorkExperience } from '@/types';
import WorkExperienceForm from './work-experience-form';

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (data: WorkExperience) => void;
    companies: Company[];
}

export default function WorkExperienceModal({ open, onClose, onSave, companies }: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Work Experience</DialogTitle>
                    <DialogDescription>
                        Fill in the details of your past or current job. If the company isn't listed, you can add it manually.
                    </DialogDescription>
                </DialogHeader>

                <WorkExperienceForm
                    companies={companies}
                    onSubmit={(data) => {
                        onSave(data);
                        onClose();
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
