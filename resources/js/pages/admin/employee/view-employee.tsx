import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, User } from "@/types";
import { Head } from "@inertiajs/react";
import { Briefcase, Mail, Phone, User2 } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Employee",
        href: "",
    },
];

interface Props {
    user: User;
}

const ViewEmployee = ( { user }: Props ) => {

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Employee" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 sm:p-6 lg:p-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="shadow-lg backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                                    <User2 className="w-5 h-5 text-primary" />
                                    Employee details
                                </CardTitle>
                                <div>Hakd</div>
                                {/* <Form { ...form }>
                                    <form>
                                        <FormField
                                            control={ control }
                                            name="verification_status"
                                            render={ ( { field } ) => (
                                                <FormItem className="p-0">
                                                    <FormControl>
                                                        <Select
                                                            defaultValue={ company.verification_status }
                                                            onValueChange={ field.onChange }
                                                        >
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
                                </Form> */}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <Avatar className="h-24 w-24 ring-4 ring-primary/10 shadow-lg">
                                    <AvatarImage src={ user.profile_image || undefined } />
                                    <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                                        { user.name?.[ 0 ] }
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-semibold text-foreground">{ user.name }</h3>
                                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                                        <Mail className="w-4 h-4" />
                                        { user.email }
                                    </p>
                                </div>
                            </div>
                            <Separator />
                        </CardContent>

                        <Separator />
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default ViewEmployee;