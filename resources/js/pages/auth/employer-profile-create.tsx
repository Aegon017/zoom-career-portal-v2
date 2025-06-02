import { AppHeader } from "@/components/app-header";
import { MultiSelect } from "@/components/multi-select";
import ProfileImageUpload from "@/components/ProfileImageUpload";
import { SelectPopoverField } from "@/components/select-popover-field";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Employer, SharedData, User } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { useForm } from "react-hook-form";

const types_of_candidates = [
    { id: 1, name: "Software Engineer" },
    { id: 2, name: "Data Scientist" },
    { id: 3, name: "Product Manager" },
    { id: 4, name: "Designer" },
    { id: 5, name: "Marketing Specialist" },
    { id: 6, name: "Sales Executive" },
    { id: 7, name: "Customer Support" },
    { id: 8, name: "HR Specialist" },
    { id: 9, name: "Finance Analyst" },
    { id: 10, name: "Operations Manager" }
];

const job_titles = [
    { id: 1, name: "CEO" },
    { id: 2, name: "CTO" },
    { id: 3, name: "COO" },
    { id: 4, name: "HR Director" },
    { id: 5, name: "Talent Acquisition Manager" },
    { id: 6, name: "Recruiter" },
    { id: 7, name: "HR Manager" },
    { id: 8, name: "Hiring Manager" },
    { id: 9, name: "People Operations Manager" },
    { id: 10, name: "HR Business Partner" }
];

const EmployerProfileCreate = () => {
    const user: User = usePage<SharedData>().props.auth.user;

    const form = useForm<Employer>({
        defaultValues: {
            profile_image: "",
            job_title: "",
            types_of_candidates: [],
            phone: ""
        }
    });

    const { handleSubmit, control, setError, setValue } = form;

    const onSubmit = (data: Employer) => {
        console.log("Form data submitted:", data);

        router.post(route("employer.user-profile.create"), data as Record<string, any>, {
            onError: (errors) => {
                if (errors && typeof errors === "object") {
                    Object.entries(errors).forEach(([field, message]) => {
                        setError(field as keyof Employer, {
                            type: "server",
                            message: message as string
                        });
                    });
                }
            },
            preserveScroll: true
        });
    };

    return (
        <>
            <Head title="Company register" />
            <AppHeader />
            <div className="flex flex-1 justify-center p-8">
                <div className="md:w-xl">
                    <h1 className="text-2xl font-bold text-center">
                        Complete your profile, {user.name}
                    </h1>
                    <p className="text-gray-500 text-center mt-2 text-sm">
                        Double your candidate engagement when you complete your user profile.
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
                                                            onUploaded={(url) => setValue("profile_image", url)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="md:col-span-2">
                                            <SelectPopoverField
                                                options={job_titles.map((title) => ({
                                                    value: title.name,
                                                    label: title.name
                                                }))}
                                                name="job_title"
                                                control={control}
                                                label="Select your job title"
                                                placeholder="Select your job title"
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
                                                            options={types_of_candidates.map((candidate) => ({
                                                                value: candidate.name,
                                                                label: candidate.name
                                                            }))}
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                            placeholder="Select up to 3 types"
                                                            animation={2}
                                                            maxCount={3}
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

export default EmployerProfileCreate;
