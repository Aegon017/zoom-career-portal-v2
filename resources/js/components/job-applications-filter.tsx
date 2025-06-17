import { useForm } from "react-hook-form"
import { SelectPopoverField } from "./select-popover-field"
import { Card, CardContent } from "./ui/card"
import { Form } from "./ui/form"
import { router } from "@inertiajs/react"
import { useEffect, useRef } from "react"

interface Props {
    jobOptions: {
        value: string,
        label: string
    }[],
}

const JobApplicationsFilter = ({ jobOptions }: Props) => {

    const onSubmit = (data: any) => {
        router.get(route("employer.applications.index", data));
    };

    const form = useForm({
        defaultValues: {
            job_id: ""
        }
    });

    const { control, watch, handleSubmit } = form;

    const jobId = watch("job_id");

    const hasMounted = useRef(false);

    useEffect(() => {
        if (hasMounted.current) {
            handleSubmit(onSubmit)();
        } else {
            hasMounted.current = true;
        }
    }, [jobId]);

    return (
        <Card className="p-0 shadow-none border-0 border-b-2 rounded-none">
            <CardContent className="p-0 pb-4 space-y-4">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-4">
                            <SelectPopoverField
                                control={control}
                                name="job_id"
                                label=""
                                options={jobOptions}
                                placeholder="Select job"
                            />
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default JobApplicationsFilter