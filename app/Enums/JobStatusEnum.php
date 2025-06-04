<?php

declare(strict_types=1);

namespace App\Enums;

use App\Traits\EnumHelpers;

enum JobStatusEnum: string
{
    use EnumHelpers;

    case Draft = 'draft';
    case Published = 'published';
    case Closed = 'closed';
    case Archived = 'archived';
}
