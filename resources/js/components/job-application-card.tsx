import { Application, ApplicationStatus } from "@/types"
import { Card, CardFooter, CardHeader } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { CalendarDays, Eye } from "lucide-react"
import { Button } from "./ui/button"
import JobStatus from "./job-status"
import MessageButton from "./message-button"

interface Props {
    application: Application,
    statuses: ApplicationStatus[]
}
const JobApplicationCard = ( { application, statuses }: Props ) => {
    return (
        <Card key={ application.id } className="hover:shadow-md transition-shadow duration-200">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={ application.user.avatar_url } />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                { application.user.name
                                    .split( " " )
                                    .map( ( n ) => n[ 0 ] )
                                    .join( "" )
                                    .toUpperCase() }
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-lg leading-none mb-1">{ application.user.name }</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <CalendarDays className="h-3 w-3 mr-1" />
                                Applied{ " " }
                                { new Date( application.created_at ).toLocaleDateString( "en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                } ) }
                            </div>
                        </div>
                    </div>
                    <MessageButton userId={ application.user.id }>
                        <Button variant="outline" size="sm">
                            Message
                        </Button>
                    </MessageButton>
                </div>
            </CardHeader>
            <CardFooter>
                <div className="flex gap-4 px-1">
                    { application.resume_url && (
                        <Button variant="outline" size="sm" asChild className="h-8">
                            <a
                                href={ application.resume_url }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                            >
                                <Eye className="h-3 w-3 mr-1" />
                                Resume
                            </a>
                        </Button>
                    ) }
                    <JobStatus statuses={ statuses } application={ application } />
                </div>
            </CardFooter>
        </Card>
    )
}

export default JobApplicationCard