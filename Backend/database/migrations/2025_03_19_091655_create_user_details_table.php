<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key to users table
            $table->date('birthday')->nullable();
            $table->string('profile_image')->nullable();
            $table->string('gender')->nullable();
            $table->text('bio')->nullable();
            $table->string('skills_tag')->nullable();
            $table->string('resume_link_to_file')->nullable();
            $table->json('social_links')->nullable(); // Store social links as a JSON object
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_details');
    }
};
