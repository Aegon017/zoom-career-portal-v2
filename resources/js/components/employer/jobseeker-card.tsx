import { Jobseeker } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import MessageButton from "../message-button"

interface jobseekerCardProps {
    jobseeker: Jobseeker
}

const JobseekerCard = ( { jobseeker }: jobseekerCardProps ) => {
    return (
        <Card className="w-full border-0 border-b shadow-none rounded-none hover:bg-accent">
            <CardContent className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                    <AvatarImage src="https://cdn.pixabay.com/photo/2015/04/23/22/00/new-year-background-736885_1280.jpg" alt="Jobseeker Avatar" />
                    <AvatarFallback>BB</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                    <CardTitle className="text-base font-semibold">{ jobseeker.name }</CardTitle>
                    <span className="text-sm text-muted-foreground">thasdfaj</span>
                </div>

                <div className="ml-auto">
                    <MessageButton userId={ Number( jobseeker.id ) }>
                        <Button variant="outline" size="sm">
                            Message
                        </Button>
                    </MessageButton>
                </div>
            </CardContent>
        </Card>
    )
}

export default JobseekerCard