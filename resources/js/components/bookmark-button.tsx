import { router } from '@inertiajs/react';
import { useState } from 'react';

interface BookmarkButtonProps {
    jobId: number;
    isSaved: boolean;
    hasText: boolean;
}

export default function BookmarkButton({ jobId, isSaved: initialSaved, hasText }: BookmarkButtonProps) {
    const [isSaved, setIsSaved] = useState(initialSaved);

    const toggleBookmark = () => {
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);

        const route = newSavedState
            ? `/job-postings/${jobId}/save`
            : `/job-postings/${jobId}/unsave`;

        const method = newSavedState ? 'post' : 'delete';

        router[method](route, {}, {
            preserveScroll: true,
            onError: () => {
                setIsSaved(isSaved);
            },
        });
    };

    return (
        <div className="bookmark-job">
            <button
                onClick={toggleBookmark}
                className={`${hasText ? 'zc-btn zc-btn-primary zc-btn-outline zc-btn-icon' : 'jb-bookmark-btn'}`}
                title={isSaved ? 'Unsave Job' : 'Save Job'}
            >
                <i className={isSaved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}></i>
                {hasText && (isSaved ? 'Saved' : 'Save')}
            </button>
        </div>
    );
}
