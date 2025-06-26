import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import PopupModal from '../popup-modal';
import axios from 'axios';
import { router } from '@inertiajs/react';
import FileUpload from '../file-upload';

interface SummaryModalProps {
    isActive: boolean;
    handleClose: () => void;
    defaultSummary?: string;
}

interface SummaryFormInputs {
    summary: string;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ isActive, handleClose, defaultSummary }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SummaryFormInputs>({
        defaultValues: {
            summary: defaultSummary ?? 'Write your summary here...'
        }
    });

    const onSubmit: SubmitHandler<SummaryFormInputs> = (data: any) => {
        router.post("/jobseeker/profile/summary", data);
        handleClose();
    };

    return (
        <PopupModal
            isActive={isActive}
            title="Profile Summary"
            onClose={handleClose}
            onSave={handleSubmit(onSubmit)}
        >
            <p className="mb-0">Give recruiters a brief overview of the highlights of your career, key achievements, and career goals to help recruiters know your profile better.</p>
            <div className="modal-body overflow-auto px-0" style={{ maxHeight: '400px' }}>
                <div className="mb-3">
                    {/* <label htmlFor="summary" className="form-label"></label> */}
                    <textarea className="form-control" {...register('summary', { required: true })} />
                </div>
            </div>
        </PopupModal>
    );
};

export default SummaryModal;
