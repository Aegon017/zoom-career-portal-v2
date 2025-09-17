<?php

namespace App\Observers;

use App\Models\Opening;
use App\Models\OpeningUserMatch;

class OpeningObserver
{
    /**
     * Handle the Opening "created" event.
     */
    public function created(Opening $opening): void
    {
        //
    }

    /**
     * Handle the Opening "updated" event.
     */
    public function updated(Opening $opening): void
    {
        OpeningUserMatch::where('opening_id', $opening->id)->update(['is_calculated' => false]);
    }

    /**
     * Handle the Opening "deleted" event.
     */
    public function deleted(Opening $opening): void
    {
        //
    }

    /**
     * Handle the Opening "restored" event.
     */
    public function restored(Opening $opening): void
    {
        //
    }

    /**
     * Handle the Opening "force deleted" event.
     */
    public function forceDeleted(Opening $opening): void
    {
        //
    }
}
