<?php

namespace App\Enums;

use App\Enums\Traits\EnumHelpers;

enum JobStatusEnum: string
{
    use EnumHelpers;

    case Draft = 'draft';
    case Published = 'published';
    case Closed = 'closed';
    case Archived = 'archived';
}
