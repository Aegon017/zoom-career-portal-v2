import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import PopupModal from '../popup-modal';
import axios from 'axios';
import { router } from '@inertiajs/react';
import FileUpload from '../file-upload';
import { JobSeekerProfile, User } from '@/types';
import { PhoneInput } from '../phone-input';

interface ProfileModalProps {
    isActive: boolean;
    handleClose: () => void;
    defaultValues: {
        user: User,
        jobseeker_profile: JobSeekerProfile
    }
}

interface ProfileFormInputs {
    name: string;
    email: string;
    phone: string;
    profile_image: string;
    location: string;
    experience: string;
    notice_period: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isActive, handleClose, defaultValues }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<ProfileFormInputs>({
        defaultValues: {
            name: defaultValues.user.name ?? "",
            email: defaultValues.user.email ?? "",
            phone: defaultValues.user.phone ?? "",
            profile_image: defaultValues.user.profile_image ?? "",
            location: defaultValues.user.location ?? "",
            experience: defaultValues.jobseeker_profile.experience ?? "",
            notice_period: defaultValues.jobseeker_profile.notice_period ?? "",
        }
    });

    const onSubmit: SubmitHandler<ProfileFormInputs> = (data: any) => {
        router.post(route('jobseeker.profile.basic-details.store'), data);
        handleClose();
    };

    return (
        <PopupModal
            isActive={isActive}
            title="Profile Summary"
            onClose={handleClose}
            onSave={handleSubmit(onSubmit)}
        >
            <div className="modal-body overflow-auto" style={{ maxHeight: '400px' }}>
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">Profile image:</label>
                    <FileUpload
                        acceptedFileTypes={['image/*']}
                        placeholder="Upload profile image"
                        name="file"
                        onUploaded={(url) => setValue("profile_image", url)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        {...register('name', { required: true })}
                    />
                    {errors.name && <p className="text-danger">Name is required</p>}
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        {...register('email', { required: true })}
                    />
                    {errors.email && <p className="text-danger">Email is required</p>}
                </div>

                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone:</label>
                    <PhoneInput />
                    <input
                        type="tel"
                        className="form-control"
                        {...register('phone', { required: true })}
                    />
                    {errors.phone && <p className="text-danger">Phone is required</p>}
                </div>

                <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location:</label>
                    <input
                        type="text"
                        className="form-control"
                        {...register('location', { required: true })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="experience" className="form-label">Experience:</label>
                    <input
                        type="text"
                        className="form-control"
                        {...register('experience', { required: true })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="notice_period" className="form-label">Notice Period:</label>
                    <input
                        type="text"
                        className="form-control"
                        {...register('notice_period', { required: true })}
                    />
                </div>
            </div>
        </PopupModal>
    );
};

export default ProfileModal;
