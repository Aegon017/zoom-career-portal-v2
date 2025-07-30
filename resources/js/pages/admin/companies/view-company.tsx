import CompanyDetails from '@/components/company-details';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Company } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Company',
        href: '',
    },
];

interface Props {
    company: Company;
}

interface FormData {
    verification_status: string;
}

const ViewCompany = ( { company }: Props ) => {
    const form = useForm<FormData>( {
        defaultValues: {
            verification_status: company.verification_status ?? '',
        },
    } );

    const { control, watch, handleSubmit } = form;

    const verificationStatus = watch( 'verification_status' );

    const onSubmit = ( data: FormData ) => {
        router.patch( `/admin/companies/${ company.id }/status`, {
            verification_status: data.verification_status,
        } );
    };

    const hasMounted = useRef( false );

    useEffect( () => {
        if ( hasMounted.current ) {
            handleSubmit( onSubmit )();
        } else {
            hasMounted.current = true;
        }
    }, [ verificationStatus ] );

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Company" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 sm:p-6 lg:p-8">
                <div className="space-y-6">
                    <Card className="shadow-lg backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <CardTitle className="text-foreground flex items-center gap-2 text-lg font-semibold">
                                    <Building2 className="text-primary h-5 w-5" />
                                    Company Information
                                </CardTitle>
                                <Form { ...form }>
                                    <form>
                                        <FormField
                                            control={ control }
                                            name="verification_status"
                                            render={ ( { field } ) => (
                                                <FormItem className="p-0">
                                                    <FormControl>
                                                        <Select defaultValue={ company.verification_status } onValueChange={ field.onChange }>
                                                            <SelectTrigger className="w-full sm:w-64">
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="pending">Pending</SelectItem>
                                                                <SelectItem value="verified">Verified</SelectItem>
                                                                <SelectItem value="rejected">Rejected</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            ) }
                                        />
                                    </form>
                                </Form>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <CompanyDetails company={ company } />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default ViewCompany;