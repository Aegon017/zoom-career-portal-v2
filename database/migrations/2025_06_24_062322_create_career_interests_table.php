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
        Schema::create('career_interests', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->json('preferred_positions')->nullable();
            $table->json('post_graduation_plans')->nullable();
            $table->json('zoom_support_preferences')->nullable();
            $table->json('desired_jobs')->nullable();
            $table->json('preferred_locations')->nullable();
            $table->json('target_industries')->nullable();
            $table->json('job_function_interests')->nullable();
            $table->string('graduation_month')->nullable();
            $table->string('graduation_year')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('career_interests');
    }
};
