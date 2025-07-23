<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Resume;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Smalot\PdfParser\Parser;

final class ProcessResume implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Resume $resume) {}

    /**
     * Execute the job.
     */
    public function handle(Parser $parser): void
    {
        $text = $parser->parseFile($this->resume->resume_url)->getText();

        $this->resume->text = $text;

        $this->resume->save();
    }
}
