<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Enums\JobStatusEnum;
use App\Models\Opening;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

final class CloseExpiredJobOpening implements ShouldQueue
{
    use Queueable;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Opening::whereNot('status', JobStatusEnum::Closed->value)
            ->where('expires_at', '<=', now())
            ->update(['status' => JobStatusEnum::Closed->value]);
    }
}
