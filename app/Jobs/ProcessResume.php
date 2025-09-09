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
        $text = $parser->parseFile($this->resume->getFirstMediaPath('resumes'))->getText();

        $this->resume->text = mb_convert_encoding($text, 'UTF-8', 'UTF-8');

        $this->resume->save();
    }
}
