<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('company_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->string('status')->default('pending'); // Use string instead of enum, with a default value
            $table->string('company_certificate_url')->nullable(); // Make this nullable
            $table->string('owner_id_front')->nullable(); // Make this nullable
            $table->string('owner_id_back')->nullable(); // Make this nullable
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('company_verifications');
    }
};
