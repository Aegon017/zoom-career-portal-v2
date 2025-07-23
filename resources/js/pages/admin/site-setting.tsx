import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Setting } from '@/types';

interface Props {
    settings: Setting[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Site settings',
        href: '/admin/site-settings',
    },
];

const SiteSetting = ({ settings }: Props) => {
    const defaultValues = settings.reduce(
        (acc, setting) => {
            acc[setting.name] = setting.status;
            return acc;
        },
        {} as Record<string, boolean>,
    );

    const form = useForm({
        defaultValues,
    });

    const onSubmit = (data: Record<string, boolean>) => {
        console.log('Submitted data:', data);
        router.post('/admin/site-settings', { settings: data });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Site settings" />
            <div className="flex flex-col gap-4 p-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Card className="mx-auto w-full max-w-xl shadow-md">
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold">🎓 Student Panel</CardTitle>
                            <CardDescription>Toggle student features below to customize their experience.</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid gap-4">
                                        {settings.map((setting) => (
                                            <FormField
                                                key={setting.id}
                                                control={form.control}
                                                name={setting.name}
                                                render={({ field }) => (
                                                    <FormItem className="hover:bg-muted flex items-center justify-between rounded-md border px-4 py-3 shadow-sm transition-colors">
                                                        <div className="space-y-1">
                                                            <FormLabel className="text-base font-medium capitalize">
                                                                {setting.name.replace(/_/g, ' ')}
                                                            </FormLabel>
                                                            <FormDescription>Enable this feature for student usage.</FormDescription>
                                                        </div>

                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} className="ml-4" />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>

                                    <div className="pt-4">
                                        <Button type="submit" className="w-full">
                                            💾 Save Settings
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>

                        <CardFooter className="text-center">
                            <p className="text-muted-foreground w-full text-sm">💡 Tip: You can update these settings at any time.</p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default SiteSetting;
