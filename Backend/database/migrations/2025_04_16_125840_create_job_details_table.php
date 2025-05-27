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
    Schema::create('job_details', function (Blueprint $table) {
        $table->id();
        $table->foreignId('job_id')->constrained()->onDelete('cascade');

        $table->foreignId('country_id')->nullable()->constrained()->onDelete('set null');
        $table->foreignId('city_id')->nullable()->constrained()->onDelete('set null');

        $table->string('wage')->nullable(); 
        $table->string('location')->nullable(); 
        $table->string('employment_type')->nullable(); 
        $table->string('experience_level')->nullable(); 
        $table->json('hashtags')->nullable(); 
        $table->json('benefits')->nullable(); 
        $table->date('deadline')->nullable(); 
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_details');
    }
};
