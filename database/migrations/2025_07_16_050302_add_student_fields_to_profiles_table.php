<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table): void {
            $table->string('course_completed')->nullable()->after('notice_period');
            $table->string('student_id')->nullable()->after('course_completed');
            $table->string('completed_month')->nullable()->after('student_id');
            $table->boolean('is_verified')->default(false)->after('completed_month');
        });
    }

    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table): void {
            $table->dropColumn(['course_completed', 'student_id', 'completed_month', 'is_verified']);
        });
    }
};
