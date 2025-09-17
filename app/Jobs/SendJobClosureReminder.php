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
        Opening::where('status', JobStatusEnum::Closed->value)
            ->where('closure_reminder_sent', false)
            ->with('user')
            ->chunk(50, function ($jobs) {
                foreach ($jobs as $job) {
                    if ($job->user) {
                        $job->user->notify(new JobClosureFeedbackReminderNotification($job));
                        $job->update(['closure_reminder_sent' => true]);
                    }
                }
            });
    }
}
