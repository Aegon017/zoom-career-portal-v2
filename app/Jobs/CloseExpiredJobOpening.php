<?php

namespace App\Jobs;

use App\Enums\JobStatusEnum;
use App\Models\Opening;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class CloseExpiredJobOpening implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct() {}

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
