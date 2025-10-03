<?php

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
        Schema::create('opening_user_matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('opening_id')->constrained('openings')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedTinyInteger('match_score')->nullable();
            $table->text('match_summary')->nullable();
            $table->boolean('is_calculated');
            $table->timestamps();

            $table->unique(['opening_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opening_user_matches');
    }
};
