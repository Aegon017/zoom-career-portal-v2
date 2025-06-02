import { AppHeader } from '@/components/app-header'
import { CreatableCombobox, Option } from '@/components/creatable-combobox'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Company, SharedData } from '@/types'
import { Head, router, usePage } from '@inertiajs/react'
import { Building2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const CreateOrJoinCompany = ({ companies }: { companies: Company[] }) => {
    const user = usePage<SharedData>().props.auth.user;

    const [companyOptions, setCompanyOptions] = useState<Option[]>(
        companies.map((company) => ({
            label: company.company_name,
            value: company.id.toString(),
        }))
    );

    const form = useForm<{ company: string; isNewCompany?: boolean }>({
        defaultValues: {
            company: '',
            isNewCompany: false,
        },
    });

    const { control, setError, handleSubmit, setValue, watch } = form

    const selectedCompanyId = watch('company')
    const isNewCompany = watch('isNewCompany')

    const selectedCompany = companyOptions.find(
        (opt) => opt.value === selectedCompanyId
    );

    const handleCompanyChange = (newValue: string, isNew?: boolean) => {
        if (isNew) {
            const newOption = {
                label: newValue,
                value: newValue,
            }

            setCompanyOptions((prev) => [...prev, newOption])
            setValue('company', newOption.value)
            setValue('isNewCompany', true)
        } else {
            setValue('company', newValue)
            setValue('isNewCompany', false)
        }
    }

    const onSubmit = (data: any) => {
        router.post(route('employer.company.verify'), data, {
            onError: (errors) => {
                if (errors && typeof errors === 'object') {
                    Object.entries(errors).forEach(([field, message]) => {
                        setError(field as 'company', {
                            type: 'server',
                            message: message as string,
                        })
                    })
                }
            },
            preserveScroll: true,
        })
    }

    return (
        <>
            <Head title="Company register" />
            <AppHeader />
            <div className="flex flex-1 justify-center p-8">
                <div className="md:w-xl">
                    <h1 className="text-2xl font-bold text-center">
                        Create or Join Your Company
                    </h1>
                    <p className="text-gray-500 text-center mt-2 text-sm">
                        Join or create a company to get started.
                    </p>
                    <div className="py-8">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-1 gap-6">
                                        <FormField
                                            control={control}
                                            name="company"
                                            render={() => (
                                                <FormItem>
                                                    <FormLabel>Company name</FormLabel>
                                                    <FormControl>
                                                        <CreatableCombobox
                                                            value={selectedCompanyId}
                                                            options={companyOptions}
                                                            onChange={handleCompanyChange}
                                                            placeholder="Search company..."
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {isNewCompany && (
                                            <input type="hidden" name="isNewCompany" value={isNewCompany ? 'true' : 'false'} />
                                        )}
                                    </div>

                                    {selectedCompany && (
                                        <Card className="w-full overflow-hidden rounded-lg border border-muted/50 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                                            <CardHeader className="h-10 bg-gray-400 p-0" />

                                            <CardContent className="flex items-center gap-5 px-8 py-4">
                                                <div className="flex size-14 items-center justify-center rounded-lg bg-orange-100 text-orange-600 shadow-sm ring-2 ring-orange-200 transition-all duration-300 hover:bg-orange-200 hover:text-orange-700">
                                                    <Building2 className="size-6" />
                                                </div>

                                                <div>
                                                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{selectedCompany.label}</h1>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                                <div className=" flex justify-end mt-8">
                                    <Button type="submit" variant="default">Continue</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateOrJoinCompany
