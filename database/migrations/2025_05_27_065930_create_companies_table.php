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
        Schema::create('companies', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->unique();
            $table->foreignId('industry_id')->nullable()->constrained()->nullOnDelete();
            $table->string('website_url');
            $table->text('description');
            $table->string('size');
            $table->string('type');
            $table->string('verification_status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
