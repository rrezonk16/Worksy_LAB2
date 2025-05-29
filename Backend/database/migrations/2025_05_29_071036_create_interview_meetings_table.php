<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('interview_meetings', function (Blueprint $table) {
        $table->id();
        $table->foreignId('job_application_id')->constrained()->onDelete('cascade');
        $table->string('room_name');
        $table->dateTime('scheduled_at');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interview_meetings');
    }
};
