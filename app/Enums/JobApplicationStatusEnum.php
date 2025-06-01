<?php

namespace App\Enums;

use App\Traits\EnumHelpers;

enum JobApplicationStatusEnum: string
{
    use EnumHelpers;

    case Pending = 'pending';
    case Applied = 'applied';
    case UnderReview = 'under_review';
    case Reviewed = 'reviewed';
    case InterviewScheduled = 'interview_scheduled';
    case Offered = 'offered';
    case Rejected = 'rejected';
    case Withdrawn = 'withdrawn';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Applied => 'Applied',
            self::UnderReview => 'Under Review',
            self::Reviewed => 'Reviewed',
            self::InterviewScheduled => 'Interview Scheduled',
            self::Offered => 'Offered',
            self::Rejected => 'Rejected',
            self::Withdrawn => 'Withdrawn',
        };
    }
}
