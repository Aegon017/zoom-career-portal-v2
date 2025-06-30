<?php

declare(strict_types=1);

namespace App\Enums;

use App\Traits\EnumHelpers;

enum JobApplicationStatusEnum: string
{
    use EnumHelpers;

    case Applied = 'applied';
    case Shortlisted = 'shortlisted';
    // case UnderReview = 'under_review';
    // case InterviewScheduled = 'interview_scheduled';
    // case Offered = 'offered';
    // case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Applied => 'Applied',
            self::Shortlisted => 'Shortlisted',
            // self::UnderReview => 'Under Review',
            // self::InterviewScheduled => 'Interview Scheduled',
            // self::Offered => 'Offered',
            // self::Rejected => 'Rejected',
        };
    }
}
