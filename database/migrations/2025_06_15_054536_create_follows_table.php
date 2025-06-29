<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('follows', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('follower_id')->constrained('users')->cascadeOnDelete();
            $table->morphs('followable');
            $table->timestamps();

            $table->unique(['follower_id', 'followable_id', 'followable_type'], 'follows_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('follows');
    }
};
