<?php

declare(strict_types=1);

use App\Jobs\CloseExpiredJobOpening;
use App\Jobs\SendJobClosureReminder;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new CloseExpiredJobOpening())->everyMinute();

Schedule::job(new SendJobClosureReminder())->everyMinute();

Schedule::command('app:process-pending-matches')->everyMinute();
