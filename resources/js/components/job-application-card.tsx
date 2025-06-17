import { Application, ApplicationStatus } from "@/types"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { CalendarDays, Eye, Mail } from "lucide-react"
import { Button } from "./ui/button"
import JobStatus from "./job-status"

interface Props {
    application: Application,
    statuses: ApplicationStatus[]
}
const JobApplicationCard = ({ application, statuses }: Props) => {
    return (
        <Card key={application.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={application.user.profile_image} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {application.user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-lg leading-none mb-1">{application.user.name}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <CalendarDays className="h-3 w-3 mr-1" />
                                Applied{" "}
                                {new Date(application.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </div>
                        </div>
                    </div>
                    {application.resume && (
                        <Button variant="outline" size="sm" asChild className="h-8">
                            <a
                                href={application.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                            >
                                <Eye className="h-3 w-3 mr-1" />
                                Resume
                            </a>
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardFooter>
                <JobStatus statuses={statuses} application={application} />
            </CardFooter>
        </Card>
    )
}

export default JobApplicationCard