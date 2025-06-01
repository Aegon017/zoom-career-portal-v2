import { router } from "@inertiajs/react";
import { useState, useCallback } from "react";

interface ApplyButtonProps {
    jobId: number;
    hasApplied: boolean;
    status?: string;
}

export default function ApplyButton({ jobId, hasApplied, status }: ApplyButtonProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const toggleApplication = useCallback(() => {
        if (isProcessing) return;

        setIsProcessing(true);

        const method = "post";
        const url = hasApplied
            ? `/job-postings/${jobId}/withdraw`
            : `/job-postings/${jobId}/apply`;

        router[method](url, {}, {
            preserveScroll: true,
            onFinish: () => {
                setIsProcessing(false);
            },
        });
    }, [isProcessing, hasApplied, jobId]);

    return (
        <button
            onClick={toggleApplication}
            className={`zc-btn zc-btn-primary ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isProcessing}
            title={hasApplied ? "Withdraw application" : "Apply for job"}
            aria-label={hasApplied ? "Withdraw application" : "Apply for job"}
            type="button"
        >
            {isProcessing
                ? "Processing..."
                : hasApplied
                    ? `Withdraw${status ? ` (${status})` : ""}`
                    : "Apply Now"
            }
        </button>
    );
}