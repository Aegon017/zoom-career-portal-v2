import { AppHeader } from "@/components/app-header"
import ProfileImageUpload from "@/components/ProfileImageUpload";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Company } from "@/types";
import { Head, router } from "@inertiajs/react";
import { useForm } from "react-hook-form"

type CompanyOption = {
    value: string;
    label: string;
}

const CompanyRegister = ({ companySizes, companyTypes, company_name }: { companySizes: CompanyOption[], companyTypes: CompanyOption[], company_name: string }) => {
    const form = useForm<Company>({
        defaultValues: {
            company_name: company_name,
            company_logo: "",
            industry: "",
            company_website: "",
            company_description: "",
            company_address: "",
            public_phone: "",
            public_email: "",
            company_size: "",
            company_type: "",
        }
    });

    const { handleSubmit, control, setError } = form;

    const onSubmit = (data: any) => {
        router.post(route("company.register"), data, {
            onError: (errors) => {
                if (errors && typeof errors === 'object') {
                    Object.entries(errors).forEach(([field, message]) => {
                        setError(field as string, {
                            type: 'server',
                            message: message as string,
                        });
                    });
                }
            },
            preserveScroll: true,
        });
    }

    const setData = (name: string, value: string): void => {
        form.setValue(name, value);
    };

    return (
        <>
            <Head title="Company register" />
            <AppHeader />
            <div className="flex flex-1 justify-center p-8">
                <div className="md:w-xl">
                    <h1 className="text-2xl font-bold text-center">Register Company</h1>
                    <p className="text-gray-500 text-center mt-2 text-sm">Create your company account and start hiring talent</p>
                    <div className="py-8">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-1 gap-6">
                                        <FormField
                                            control={control}
                                            name="company_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Company name</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" {...field} autoComplete="company" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name="company_logo"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Company logo (Optional)</FormLabel>
                                                    <FormControl>
                                                        <ProfileImageUpload
                                                            placeholder={`Drag & Drop your company logo or <span class="filepond--label-action">Browse</span>`}
                                                            uploadUrl={route('company.profile.logo.upload')}
                                                            removeUrl={route('company.profile.logo.remove')}
                                                            onUploaded={(url) => setData('company_logo', url)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name="industry"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Industry</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" {...field} autoComplete="industry" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name="company_website"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Website</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="www.example.com" type="url" {...field} autoComplete="website" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name="company_description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>description</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name="company_address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" {...field} autoComplete="address" />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Enter full address or city/state/country. Entering full address will accelerate the verification
                                                        process.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name="public_phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Public phone number (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input type="tel" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is used for further verification.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name="public_email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Public company email (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is used for further verification.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name="company_size"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor="size-0">Company size</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            {...field}
                                                            onValueChange={field.onChange}
                                                            className="flex flex-wrap gap-x-1 gap-y-4 mt-2"
                                                        >
                                                            {companySizes.map((size, index) => {
                                                                const id = `size-${index}`;
                                                                const isSelected = field.value === size.value;

                                                                return (
                                                                    <div key={id} className="relative">
                                                                        <RadioGroupItem
                                                                            value={size.value}
                                                                            id={id}
                                                                            className="peer sr-only"
                                                                        />
                                                                        <Label
                                                                            htmlFor={id}
                                                                            className={`cursor-pointer rounded-sm border px-4 py-2 text-center text-sm font-medium transition-colors ${isSelected ? "border-orange-600" : "border-gray-300"}`}
                                                                        >
                                                                            {size.label}
                                                                        </Label>
                                                                    </div>
                                                                );
                                                            })}
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name="company_type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor="type-0">Company type</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            {...field}
                                                            onValueChange={field.onChange}
                                                            className="flex flex-wrap gap-x-1 gap-y-4 mt-2"
                                                        >
                                                            {companyTypes.map((type, index) => {
                                                                const id = `type-${index}`;
                                                                const isSelected = field.value === type.value;

                                                                return (
                                                                    <div key={id} className="relative">
                                                                        <RadioGroupItem
                                                                            value={type.value}
                                                                            id={id}
                                                                            className="peer sr-only"
                                                                        />
                                                                        <Label
                                                                            htmlFor={id}
                                                                            className={`cursor-pointer rounded-sm border px-4 py-2 text-center text-sm font-medium transition-colors ${isSelected ? "border-orange-600" : "border-gray-300"}`}
                                                                        >
                                                                            {type.label}
                                                                        </Label>
                                                                    </div>
                                                                );
                                                            })}
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">Submit</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanyRegister