import { useState, useEffect, useRef } from "react";
import { CalendarDays, Eye, Loader2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import JobStatus from "./job-status";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "./ui/card";
import MessageButton from "./message-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Application, ApplicationStatus } from "@/types";

interface Props {
    application: Application;
    statuses: ApplicationStatus[];
    message?: boolean;
}

const JobApplicationCard = ( { application, statuses, message = true }: Props ) => {
    const [ matchScore, setMatchScore ] = useState<number | null>(
        application.match_score?.score ?? null
    );
    const [ reason, setReason ] = useState( application.match_score?.reason ?? "" );
    const [ shortlistSuggested, setShortlistSuggested ] = useState<boolean | null>(
        application.match_score?.shortlist ?? null
    );
    const [ shortlistReason, setShortlistReason ] = useState(
        application.match_score?.shortlist_reason ?? ""
    );
    const [ loading, setLoading ] = useState( false );
    const [ elapsedTime, setElapsedTime ] = useState<number>( 0 );
    const timerRef = useRef<NodeJS.Timeout | null>( null );

    useEffect( () => {
        if ( loading ) {
            timerRef.current = setInterval( () => {
                setElapsedTime( prev => prev + 1 );
            }, 1000 );
        } else {
            if ( timerRef.current ) {
                clearInterval( timerRef.current );
                timerRef.current = null;
            }
        }

        return () => {
            if ( timerRef.current ) clearInterval( timerRef.current );
        };
    }, [ loading ] );

    const handleAnalyzeClick = async () => {
        setLoading( true );
        setElapsedTime( 0 );
        setReason( "" );
        setShortlistSuggested( null );
        setShortlistReason( "" );

        try {
            const res = await fetch( `/employer/ai/match-score/${ application.id }` );
            const text = await res.text();

            try {
                const parsed = JSON.parse( text );
                setMatchScore( parsed.score ?? null );
                setReason( parsed.reason ?? "" );
                setShortlistSuggested( parsed.shortlist ?? null );
                setShortlistReason( parsed.shortlist_reason ?? "" );
            } catch {
                setReason( text );
            }
        } finally {
            setLoading( false );
        }
    };

    return (
        <Card className="rounded-xl border bg-background p-4 shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-2xl mx-auto space-y-4 gap-0">
            {/* Top Row: Applicant Info + Message Button */ }
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 ring ring-muted-foreground/10">
                        <AvatarImage src={ application.user.avatar_url } />
                        <AvatarFallback>
                            { application.user.name
                                .split( " " )
                                .map( ( n ) => n[ 0 ] )
                                .join( "" )
                                .toUpperCase() }
                        </AvatarFallback>
                    </Avatar>

                    <div className="space-y-0.5">
                        <h3 className="text-base font-semibold">{ application.user.name }</h3>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
                            <CalendarDays className="w-4 h-4" />
                            <span>
                                Applied on{ " " }
                                { new Date( application.created_at ).toLocaleDateString( "en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                } ) }
                            </span>
                        </div>
                    </div>
                </div>
                { loading ? (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span>Analyzing with AI... ({ elapsedTime }s)</span>
                    </div>
                ) : matchScore === null && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm px-2 h-auto text-primary hover:text-secondary transition-colors ease"
                        onClick={ handleAnalyzeClick }
                        disabled={ loading }
                    >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Analyze with AI
                    </Button>
                ) }
            </div>

            <CardContent className="px-0 space-y-4">
                {/* Match Score */ }
                <div>
                    { ( matchScore !== null ) && (
                        <div className="text-sm font-medium text-green-700">
                            🧠 Match Score: <span className="font-bold">{ matchScore }/100</span>
                            <span className="ml-2 text-xs text-muted-foreground">⏱ { elapsedTime }s</span>
                        </div>
                    ) }

                    { reason && (
                        <p className="text-sm text-muted-foreground whitespace-pre-line mt-2">
                            { reason }
                        </p>
                    ) }
                </div>

                {/* Shortlist Suggestion */ }
                { shortlistSuggested !== null && !loading && (
                    <div className="rounded-md border px-4 py-2 bg-muted/30 space-y-1">
                        <span
                            className={ `text-sm font-semibold ${ shortlistSuggested ? "text-green-700" : "text-red-600"
                                }` }
                        >
                            { shortlistSuggested ? "✅ Suggest Shortlisting" : "❌ Do Not Shortlist" }
                        </span>
                        { shortlistReason && (
                            <p className="text-xs text-muted-foreground">{ shortlistReason }</p>
                        ) }
                    </div>
                ) }
            </CardContent>

            <CardFooter className="flex flex-row justify-between items-center gap-3 px-0">
                <div className="w-full sm:w-auto flex justify-start sm:justify-start gap-2">
                    { application.resume_url && (
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-8 w-full sm:w-auto"
                            disabled={ loading }
                        >
                            <a
                                href={ application.resume_url }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center"
                            >
                                <Eye className="h-3 w-3 mr-1" />
                                View Resume
                            </a>
                        </Button>
                    ) }
                </div>

                <div className="w-full sm:w-auto">
                    <JobStatus statuses={ statuses } application={ application } />
                </div>

                { message && (
                    <div className="sm:ml-auto sm:mt-0 mt-2">
                        <MessageButton userId={ application.user.id }>
                            <Button size="sm" variant="outline" disabled={ loading }>
                                Message
                            </Button>
                        </MessageButton>
                    </div>
                ) }
            </CardFooter>
        </Card>
    );
};

export default JobApplicationCard;
