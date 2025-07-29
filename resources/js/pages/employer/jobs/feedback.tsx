import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Opening, Option } from '@/types';
import MultipleSelector from '@/components/multiple-selector';
import { AppHeader } from '@/components/employer/employer-header';
import { Head, router } from '@inertiajs/react';

interface Props {
    candidateOptions: Option[];
    job: Opening;
}

const FeedbackForm = ( { candidateOptions, job }: Props ) => {
    const [ selectedCandidates, setSelectedCandidates ] = useState<Option[]>( [] );
    const [ feedback, setFeedback ] = useState( '' );
    const [ hiredDetails, setHiredDetails ] = useState( '' );
    const [ additionalComments, setAdditionalComments ] = useState( '' );

    const handleCandidateChange = ( selected: Option[] ) => {
        const notHiredSelected = selected.some( opt => opt.value === 'not_hired' );
        if ( notHiredSelected ) {
            setSelectedCandidates( [ { value: 'not_hired', label: 'Not Hired' } ] );
        } else {
            const filtered = selected.filter( opt => opt.value !== 'not_hired' );
            setSelectedCandidates( filtered );
        }
    };

    const handleSubmit = () => {
        router.post( `/employer/jobs/${ job.id }/feedback`, {
            feedback,
            hiredDetails,
            selectedCandidates,
            additionalComments,
        } );
    };

    return (
        <>
            <AppHeader />
            <Head title="Feedback" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="max-w-2xl mx-auto space-y-6 p-6 border rounded-xl shadow-md bg-white">
                    <h1 className="text-center text-2xl font-bold">We’d love your feedback!</h1>
                    <p className="mt-2 text-center text-sm text-gray-500">
                        Please share your thoughts, suggestions, or feedback about your experience using our job board.
                    </p>

                    <div className="space-y-2">
                        <label className="font-medium text-sm text-gray-700">
                            1. How was your overall experience with the portal and the candidates?
                        </label>
                        <Textarea
                            rows={ 6 }
                            className="h-auto min-h-[9rem]"
                            placeholder="Share your experience..."
                            value={ feedback }
                            onChange={ ( e ) => setFeedback( e.target.value ) }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="font-medium text-sm text-gray-700">
                            2. Were you able to find suitable candidates for your requirements?
                        </label>
                        <Textarea
                            rows={ 4 }
                            className="h-auto min-h-[7rem]"
                            placeholder="If yes, please share brief details on the candidate selected..."
                            value={ hiredDetails }
                            onChange={ ( e ) => setHiredDetails( e.target.value ) }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="font-medium text-sm text-gray-700">
                            3. Have you successfully hired someone through the platform?
                        </label>
                        <MultipleSelector
                            placeholder="Select candidate(s)..."
                            options={ candidateOptions }
                            value={ selectedCandidates }
                            onChange={ handleCandidateChange }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="font-medium text-sm text-gray-700">
                            4. Additional comments or suggestions
                        </label>
                        <Textarea
                            rows={ 4 }
                            className="h-auto min-h-[7rem]"
                            placeholder="Share any additional comments..."
                            value={ additionalComments }
                            onChange={ ( e ) => setAdditionalComments( e.target.value ) }
                        />
                    </div>

                    <div className="pt-4">
                        <Button onClick={ handleSubmit } className="w-full">
                            Submit Feedback
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FeedbackForm;
