import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';

interface BookmarkButtonProps {
    jobId: number;
    isSaved: boolean;
    hasText: boolean;
}

export default function BookmarkButton({ jobId, isSaved, hasText }: BookmarkButtonProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const toggleBookmark = useCallback(() => {
        if (isProcessing) return;

        setIsProcessing(true);

        const route = isSaved ? `/jobseeker/jobs/${jobId}/unsave` : `/jobseeker/jobs/${jobId}/save`;

        router.post(
            route,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsProcessing(false);
                },
            },
        );
    }, [isProcessing, isSaved, jobId]);

    return (
        <div className="bookmark-job">
            <button
                onClick={toggleBookmark}
                className={`${
                    hasText ? 'zc-btn zc-btn-primary zc-btn-outline zc-btn-icon' : 'jb-bookmark-btn'
                } ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={isProcessing}
                title={isSaved ? 'Unsave Job' : 'Save Job'}
                aria-label={isSaved ? 'Unsave job' : 'Save job'}
                type="button"
            >
                <i className={isSaved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}></i>
                {hasText && (isSaved ? ' Saved' : ' Save')}
            </button>
        </div>
    );
}
