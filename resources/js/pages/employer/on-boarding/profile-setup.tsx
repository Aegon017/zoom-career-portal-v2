import { AppHeader } from "@/components/app-header";
import { MultiSelect } from "@/components/multi-select";
import ProfileImageUpload from "@/components/ProfileImageUpload";
import { SelectPopoverField } from "@/components/select-popover-field";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import { Head } from "@inertiajs/react";
import { useForm } from "react-hook-form";

interface ProfileSetup {
    user: User,
    job_titles: {
        id: number,
        name: string
    }[],
    talent_profiles: {
        id: number,
        name: string
    }[]
}

const profileSetup = (props: ProfileSetup) => {
    const { user, job_titles, talent_profiles } = props;
    const form = useForm({
        defaultValues: {
            profile_image: "",
            job_title: "",
            types_of_candidates: [],
            phone: ""
        }
    });
    const { handleSubmit, control } = form;

    const onSubmit = () => {

    }
    return (
        <>
            <Head title="Employer profile setup" />
            <AppHeader />
            <div className="flex flex-1 justify-center p-8">
                <div className="md:w-xl">
                    <h1 className="text-3xl font-bold text-center">
                        Complete your profile, {user.name}
                    </h1>
                    <p className="text-gray-500 text-center mt-2 text-sm">
                        Maximize your hiring potential—complete your profile to connect with twice as many qualified professionals.
                    </p>
                    <div className="py-8">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-1 gap-6">
                                        <FormField
                                            control={control}
                                            name="profile_image"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Profile image (Optional)</FormLabel>
                                                    <FormControl>
                                                        <ProfileImageUpload
                                                            placeholder={`Drag & Drop your profile image or <span class="filepond--label-action">Browse</span>`}
                                                            uploadUrl={route("employer.profile.image.upload")}
                                                            removeUrl={route("employer.profile.image.remove")}
                                                            onUploaded={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="md:col-span-2">
                                            <SelectPopoverField
                                                options={job_titles.map((job_title) => ({
                                                    value: job_title.name,
                                                    label: job_title.name
                                                }))}
                                                name="job_title"
                                                control={control}
                                                label="Job title"
                                                placeholder="Select options"
                                            />
                                        </div>

                                        <FormField
                                            control={control}
                                            name="types_of_candidates"
                                            render={({ field }) => (
                                                <FormItem className="md:col-span-2">
                                                    <FormLabel>Types of candidates you're looking for</FormLabel>
                                                    <FormControl>
                                                        <MultiSelect
                                                            options={talent_profiles.map((talent_profile) => ({
                                                                value: talent_profile.name,
                                                                label: talent_profile.name
                                                            }))}
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                            animation={2}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem className="md:col-span-2">
                                                    <FormLabel>Phone number</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="tel"
                                                            placeholder="Enter your phone number"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-8">
                                    <Button type="submit">Continue</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default profileSetup