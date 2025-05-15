<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('past_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->string('job_title');
            $table->string('company_name');
            $table->string('city')->nullable();
            $table->enum('job_type', ['Internship', 'Full-Time', 'Part-Time', 'Contract', 'Freelance'])->default('Full-Time');

            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->text('description')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('past_jobs');
    }
};
