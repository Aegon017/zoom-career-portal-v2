<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Enums\JobStatusEnum;
use App\Models\Opening;
use App\Notifications\JobClosureFeedbackReminderNotification;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

final class SendJobClosureReminder implements ShouldQueue
{
    use Queueable;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $jobs = Opening::whereNotNull('expires_at')
            ->where('status', JobStatusEnum::Closed)
            ->whereDate('expires_at', Carbon::now()->subWeek()->toDateString())
            ->with('user')
            ->get();

        foreach ($jobs as $job) {
            if ($job->user) {
                $job->user->notify(new JobClosureFeedbackReminderNotification($job));
            }
        }
    }
}
