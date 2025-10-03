<?php

namespace App\Console\Commands;

use App\Jobs\ProcessOpeningUserMatch;
use App\Models\OpeningUserMatch;
use Illuminate\Console\Command;

class ProcessPendingMatches extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:process-pending-matches';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process opening-user matches that are not yet calculated';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        OpeningUserMatch::where('is_calculated', false)
            ->chunkById(500, function ($matches) {
                foreach ($matches as $match) {
                    ProcessOpeningUserMatch::dispatch($match);
                }
            });

        $this->info('Dispatched pending matches for processing.');
    }
}
