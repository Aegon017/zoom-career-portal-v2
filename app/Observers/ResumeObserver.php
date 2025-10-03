<?php

namespace App\Observers;

use App\Models\OpeningUserMatch;
use App\Models\Resume;

class ResumeObserver
{
    /**
     * Handle the Resume "created" event.
     */
    public function created(Resume $resume): void
    {
        //
    }

    /**
     * Handle the Resume "updated" event.
     */
    public function updated(Resume $resume): void
    {
        OpeningUserMatch::where('user_id', $resume->user_id)->update(['is_calculated' => false]);
    }

    /**
     * Handle the Resume "deleted" event.
     */
    public function deleted(Resume $resume): void
    {
        //
    }

    /**
     * Handle the Resume "restored" event.
     */
    public function restored(Resume $resume): void
    {
        //
    }

    /**
     * Handle the Resume "force deleted" event.
     */
    public function forceDeleted(Resume $resume): void
    {
        //
    }
}
