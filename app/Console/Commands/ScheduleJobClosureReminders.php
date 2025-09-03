<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Jobs\SendJobClosureReminder;
use App\Models\Opening;
use Carbon\Carbon;
use Illuminate\Console\Command;

final class ScheduleJobClosureReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:schedule-job-closure-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Schedule a job to send feedback reminders for expired jobs after 7 days';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $jobs = Opening::whereNotNull('expires_at')
            ->whereDate('expires_at', Carbon::now()->subWeek()->toDateString())
            ->with('user')
            ->get();

        foreach ($jobs as $job) {
            SendJobClosureReminder::dispatch($job);
        }

        return self::SUCCESS;
    }
}
