import { Jobseeker, User } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import MessageButton from "../message-button"

interface Props {
    user: User
}

const JobseekerCard = ( { user }: Props ) => {
    return (
        <Card className="w-full border-0 border-b shadow-none rounded-none hover:bg-accent">
            <CardContent className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                    <AvatarImage src={ user.avatar_url } alt={ user.name + "avatar" } />
                    <AvatarFallback>{ user.name ? user.name.charAt( 0 ) : "?" }</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                    <CardTitle className="text-base font-semibold">{ user.name }</CardTitle>
                    {/* education details */ }
                    {/* <span className="text-sm text-muted-foreground">{ }</span> */ }
                </div>

                <div className="ml-auto">
                    <MessageButton userId={ Number( user.id ) }>
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