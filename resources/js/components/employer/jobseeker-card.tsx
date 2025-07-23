import { User } from '@/types';
import MessageButton from '../message-button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { router } from '@inertiajs/react';

interface Props {
    user: User;
    selectedSkill?: string;
}

const JobseekerCard = ( { user, selectedSkill }: Props ) => {
    // Fetch AI summary using Inertia's router
    const { data: aiSummary, isLoading, isError } = useQuery( {
        queryKey: [ 'ai-summary', user.id, selectedSkill ],
        queryFn: async () => {
            if ( !selectedSkill ) return null;

            const response = await fetch('/ai/summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    skill: selectedSkill
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch AI summary');
            }

            return await response.json();
        },
        enabled: !!selectedSkill,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    } );

    return (
        <Card className="hover:bg-accent w-full rounded-none border-0 border-b shadow-none">
            <CardContent className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={ user.avatar_url } alt={ user.name + 'avatar' } />
                    <AvatarFallback>{ user.name ? user.name.charAt( 0 ) : '?' }</AvatarFallback>
                </Avatar>

                <div className="flex flex-col flex-1">
                    <CardTitle className="text-base font-semibold">{ user.name }</CardTitle>

                    {/* Education details */ }
                    { user.educations?.length > 0 && (
                        <span className="text-sm text-muted-foreground">
                            { user.educations[0].course_title } at { user.educations[0].institution }
                        </span>
                    ) }

                    {/* AI Summary section */ }
                    { selectedSkill && (
                        <div className="mt-2">
                            { isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            ) : isError ? (
                                <p className="text-sm text-muted-foreground">Could not generate summary</p>
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    <p className="font-medium text-primary">
                                        AI Summary for { selectedSkill }:
                                    </p>
                                    <p className="text-foreground">
                                        { aiSummary?.summary || 'No relevant information found' }
                                    </p>
                                </div>
                            ) }
                        </div>
                    ) }
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
    );
};

export default JobseekerCard;